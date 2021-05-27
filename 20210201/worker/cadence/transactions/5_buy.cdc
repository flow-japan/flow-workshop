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
    marketCollectionAddress: Address
) {
    let paymentTokenVault: @FungibleToken.Vault
    let kittyItemsCollection: &KittyItems.Collection{NonFungibleToken.Receiver}
    let marketCollection: &SampleMarket.Collection{SampleMarket.CollectionPublic}

    prepare(acct: AuthAccount) {
        self.marketCollection = getAccount(marketCollectionAddress)
            .getCapability<&SampleMarket.Collection{SampleMarket.CollectionPublic}>(
                SampleMarket.CollectionPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow market collection from market address")

        let saleItem = self.marketCollection.borrowSaleItem(
            saleItemTokenAddress: saleItemTokenAddress,
            saleItemTokenName: saleItemTokenName,
            saleItemID: saleItemID
        )
        let price = saleItem.salePrice
        let paymentTokenAddress = saleItem.salePaymentTokenAddress

        if paymentTokenAddress == Address(0xKIBBLE) {
            let kibbleVault = acct.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath)
                ?? panic("Cannot borrow Kibble vault from acct storage")
            self.paymentTokenVault <- kibbleVault.withdraw(amount: price)
        } else {
            let flowTokenVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                ?? panic("Cannot borrow FlowToken vault from acct storage")
            self.paymentTokenVault <- flowTokenVault.withdraw(amount: price)
        }

        self.kittyItemsCollection = acct.borrow<&KittyItems.Collection{NonFungibleToken.Receiver}>(
            from: KittyItems.CollectionStoragePath
        ) ?? panic("Cannot borrow KittyItems collection receiver from acct")
    }

    execute {
        self.marketCollection.purchase(
            saleItemTokenAddress: saleItemTokenAddress,
            saleItemTokenName: saleItemTokenName,
            saleItemID: saleItemID,
            buyerCollection: self.kittyItemsCollection,
            buyerPayment: <- self.paymentTokenVault
        )
    }
}
