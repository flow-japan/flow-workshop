// Sender: 0x03

import VIV3 from 0x05
import FungibleToken from 0x01 
import NonFungibleToken from 0x02
import FlowToken from 0x03
import Evolution from 0x04

transaction {
    let vault: @FlowToken.Vault

    prepare(acct: AuthAccount) {
        // Create a collection to store the purchase if none present
        if acct.borrow<&Evolution.Collection>(from: /storage/EvolutionCollection) == nil {
            let collection <- Evolution.createEmptyCollection() as! @Evolution.Collection

            acct.save(<-collection, to: /storage/EvolutionCollection)

            acct.link<&{Evolution.EvolutionCollectionPublic}>(/public/EvolutionCollection, target: /storage/EvolutionCollection)
        }

        let provider = acct.borrow<&FlowToken.Vault{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
        self.vault <- provider.withdraw(amount: 1.5) as! @FlowToken.Vault
    }

    execute {
        let seller = getAccount(0x04)
        let buyer = getAccount(0x03)

        let buyerRef = buyer.getCapability(/public/EvolutionCollection).borrow<&{Evolution.EvolutionCollectionPublic}>()
                    ?? panic("Could not borrow a reference to the buyer's token collection")

        let tokenSaleCollection = seller.getCapability(/public/_04_Evolution_Collection_VIV3xFLOW)
                                    .borrow<&{VIV3.TokenSale}>() ?? panic("Could not borrow from sale in storage")
        let purchasedToken <- tokenSaleCollection.purchase(tokenId: 1, kind: Type<@Evolution.NFT>(), vault: <-self.vault)
        buyerRef.deposit(token: <-purchasedToken)

        log("Purchase success")
    }
}