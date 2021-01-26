import FungibleToken from 0xFUNGIBLETOKENADDRESS
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Kibble from 0xKIBBLE
import FlowToken from 0xFLOWTOKEN
import KittyItems from 0xKITTYITEMS
import SampleMarket from 0xSAMPLEMARKET

transaction(
    saleItemTokenAddress: Address,
    saleItemTokenName: String,
    saleItemID: UInt64,
    salePaymentTokenAddress: Address,
    salePaymentTokenName: String,
    saleItemPrice: UFix64
) {
    let market: &SampleMarket.Collection
    let sellerPaymentReceiver: Capability<&AnyResource{FungibleToken.Receiver}>
    let itemProvider: Capability<&AnyResource{NonFungibleToken.Provider}>

    prepare(acct: AuthAccount) {
        self.market = acct.borrow<&SampleMarket.Collection>(from: SampleMarket.CollectionStoragePath) ?? panic("Need the marketplace resouce")

        if salePaymentTokenName == "Kibble" {
            self.sellerPaymentReceiver = acct.getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)!
        } else {
            self.sellerPaymentReceiver = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        }

        let providerPath = /private/KittyItemsCollectionProvider
        acct.unlink(providerPath)

        if !acct.getCapability<&KittyItems.Collection{NonFungibleToken.Provider}>(providerPath)!.check() {
            acct.link<&KittyItems.Collection{NonFungibleToken.Provider}>(providerPath, target: KittyItems.CollectionStoragePath)
        }

        // if saleItemTokenName == "KittyItems" {
            self.itemProvider = acct.getCapability<&KittyItems.Collection{NonFungibleToken.Provider}>(providerPath)!
            assert(self.itemProvider.borrow() != nil, message: "Missing or mis-typed KittyItemsCollection provider")
        // } else {
        //   ...
        // }
    }

    execute {
        let offer <- SampleMarket.createSaleOffer (
            saleItemTokenAddress: saleItemTokenAddress,
            saleItemTokenName: saleItemTokenName,
            saleItemID: saleItemID,
            sellerItemProvider: self.itemProvider,
            salePaymentTokenAddress: salePaymentTokenAddress,
            salePaymentTokenName: salePaymentTokenName,
            salePrice: saleItemPrice,
            sellerPaymentReceiver: self.sellerPaymentReceiver
        )

        self.market.insert(offer: <-offer)
    }
}
