// Setup Kibbles and KittyItem, Mint/Receive Kibbles

import FungibleToken from 0xFUNGIBLETOKENADDRESS
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Kibble from 0xKIBBLE
import KittyItems from 0xKITTYITEMS

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &Kibble.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(acct: AuthAccount) {
        // Setup to receive Kibbles
        if acct.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath) == nil {
            acct.save(<-Kibble.createEmptyVault(), to: Kibble.VaultStoragePath)
            acct.link<&Kibble.Vault{FungibleToken.Receiver}>(
                Kibble.ReceiverPublicPath,
                target: Kibble.VaultStoragePath
            )
            acct.link<&Kibble.Vault{FungibleToken.Balance}>(
                Kibble.BalancePublicPath,
                target: Kibble.VaultStoragePath
            )
        }

        // Setup to receive KittyItems
        if acct.borrow<&KittyItems.Collection>(from: KittyItems.CollectionStoragePath) == nil {
            let collection <- KittyItems.createEmptyCollection()
            acct.save(<-collection, to: KittyItems.CollectionStoragePath)
            acct.link<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(
              KittyItems.CollectionPublicPath,
              target: KittyItems.CollectionStoragePath
            )
        }

        self.tokenAdmin = acct
            .borrow<&Kibble.Administrator>(from: Kibble.AdminStoragePath)
            ?? panic("acct is not the token admin")

        self.tokenReceiver = getAccount(recipient)
            .getCapability(Kibble.ReceiverPublicPath)!
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)
        self.tokenReceiver.deposit(from: <-mintedVault)
        destroy minter
    }
}
