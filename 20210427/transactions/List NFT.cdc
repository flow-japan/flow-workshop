// Sender: 0x04

import VIV3 from 0x05
import FungibleToken from 0x01 
import NonFungibleToken from 0x02
import FlowToken from 0x03
import Evolution from 0x04

transaction {
    prepare(acct: AuthAccount) {
        // Create a token sale collection if none present
        if acct.borrow<&VIV3.TokenSaleCollection>(from: /storage/_04_Evolution_Collection_VIV3xFLOW) == nil {
            let ownerCapability = acct.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            let beneficiaryCapability = getAccount(0x04).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            let royaltyCapability = getAccount(0x04).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)

            var tokenCollection: Capability<&NonFungibleToken.Collection> = acct.getCapability<&NonFungibleToken.Collection>(/private/EvolutionCollection)
            if !tokenCollection.check() {
              tokenCollection = acct.link<&NonFungibleToken.Collection>(/private/EvolutionCollection, target: /storage/EvolutionCollection)!
            }

            let collection <- VIV3.createTokenSaleCollection(collection: tokenCollection, ownerCapability:ownerCapability, beneficiaryCapability: beneficiaryCapability, royaltyCapability: royaltyCapability, fee: 0.025, royalty: 0.1, currency: Type<@FlowToken.Vault>())
            acct.save(<-collection, to: /storage/_04_Evolution_Collection_VIV3xFLOW)
            acct.link<&VIV3.TokenSaleCollection{VIV3.TokenSale}>(/public/_04_Evolution_Collection_VIV3xFLOW, target: /storage/_04_Evolution_Collection_VIV3xFLOW)
        }

        let tokenSaleCollection = acct.borrow<&VIV3.TokenSaleCollection>(from: /storage/_04_Evolution_Collection_VIV3xFLOW)
            ?? panic("Could not borrow from sale in storage")

        // List the specified token for sale
        tokenSaleCollection.listForSale(tokenId: 1, price: 1.5)

        log("success")
    }
}
