// Sender: 0x03

import FlowToken from 0x03

transaction {
    prepare(acct: AuthAccount) {
        // Mint
        let admin = acct.borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin) ?? panic("No admin resource in storage")
        let minter <- admin.createNewMinter(allowedAmount: 10.0)
        let receiver = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!
        receiver.deposit(from: <- minter.mintTokens(amount: 10.0))
        destroy minter

        log("success")
    }
}
