// Send this transaction by each account (0x03 and 0x04)

import FungibleToken from 0x01
import FlowToken from 0x03
import Evolution from 0x04

transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
            let vault <- FlowToken.createEmptyVault() as! @FlowToken.Vault
            acct.save(<- vault, to: /storage/flowTokenVault)
            acct.link<&{FungibleToken.Receiver, FungibleToken.Balance}>(/public/flowTokenReceiver, target: /storage/flowTokenVault)
        }

        if acct.borrow<&Evolution.Collection>(from: /storage/EvolutionCollection) == nil {
            let collection <- Evolution.createEmptyCollection() as! @Evolution.Collection
            acct.save(<- collection, to: /storage/EvolutionCollection)
            acct.link<&{Evolution.EvolutionCollectionPublic}>(/public/EvolutionCollection, target: /storage/EvolutionCollection)
        }

        log("success")
    }
}
