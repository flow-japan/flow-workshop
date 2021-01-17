import FungibleToken from 0xFUNGIBLETOKENADDRESS
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Kibble from 0xKIBBLE
import FlowToken from 0xFLOWTOKEN
import KittyItems from 0xKITTYITEMS
import SampleMarket from 0xKITTYMARKET

transaction(
    saleItemTokenAddress: Address,
    saleItemTokenName: String,
    saleItemID: UInt64,
    salePaymentTokenAddress: Address,
    salePaymentTokenName: String,
    saleItemPrice: UFix64
) {
    let paymentTokenVault: Capability<&AnyResource{FungibleToken.Receiver}>
    let itemsCollection: Capability<&AnyResource{NonFungibleToken.Provider}>
    let marketCollection: &SampleMarket.Collection

    prepare(acct: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one.
        let KittyItemsCollectionProviderPrivatePath = /private/KittyItemsCollectionProvider

        if salePaymentTokenAddress == Address(0xKIBBLE) {
            self.paymentTokenVault = acct.getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)!
        } else {
            self.paymentTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        }
        assert(self.paymentTokenVault.borrow() != nil, message: "Missing or mis-typed receiver")

        if !acct.getCapability<&KittyItems.Collection{NonFungibleToken.Provider}>(KittyItemsCollectionProviderPrivatePath)!.check() {
            acct.link<&KittyItems.Collection{NonFungibleToken.Provider}>(KittyItemsCollectionProviderPrivatePath, target: KittyItems.CollectionStoragePath)
        }

        self.itemsCollection = acct.getCapability<&KittyItems.Collection{NonFungibleToken.Provider}>(KittyItemsCollectionProviderPrivatePath)!
        assert(self.itemsCollection.borrow() != nil, message: "Missing or mis-typed KittyItemsCollection provider")

        self.marketCollection = acct.borrow<&SampleMarket.Collection>(from: SampleMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed SampleMarket Collection")
    }

    execute {
        let offer <- SampleMarket.createSaleOffer (
            saleItemTokenAddress: saleItemTokenAddress,
            saleItemTokenName: saleItemTokenName,
            saleItemID: saleItemID,
            sellerItemProvider: self.itemsCollection,
            salePaymentTokenAddress: salePaymentTokenAddress,
            salePaymentTokenName: salePaymentTokenName,
            salePrice: saleItemPrice,
            sellerPaymentReceiver: self.paymentTokenVault
        )
        self.marketCollection.insert(offer: <-offer)
    }
}
