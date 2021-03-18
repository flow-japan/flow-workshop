// Setup Kibbles and KittyItem, Mint/Receive a KittyItem

import FungibleToken from 0xFUNGIBLETOKENADDRESS
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Kibble from 0xKIBBLE
import KittyItems from 0xKITTYITEMS

transaction(recipient: Address, typeID: UInt64) {
    let minter: &KittyItems.NFTMinter

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

        // borrow a reference to the NFTMinter resource in storage
        self.minter = acct.borrow<&KittyItems.NFTMinter>(from: KittyItems.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        let receiver = getAccount(recipient)
            .getCapability(KittyItems.CollectionPublicPath)!
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")
        self.minter.mintNFT(recipient: receiver, typeID: typeID)
    }
}
