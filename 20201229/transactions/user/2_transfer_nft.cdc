// Transaction to transfer NFTs
// Sender: Account that has NFTs

import NonFungibleToken from 0x631e88ae7f1d7c20
import TopShot from 0xfc40912427c789d2

transaction() {
    prepare(acct: AuthAccount) {
        let withdrawID: UInt64 = UInt64(1) // TODO: Change token id
        let recipient: Address = 0x0000000000000001 // TODO: Change address

        let collectionRef = acct.borrow<&TopShot.Collection>(from: /storage/MomentCollection)
            ?? panic("Could not borrow a reference to the stored Moment collection")
        let transferToken <- collectionRef.withdraw(withdrawID: withdrawID)

        let receiverRef = getAccount(recipient).getCapability(/public/MomentCollection)!.borrow<&{TopShot.MomentCollectionPublic}>()!
        receiverRef.deposit(token: <- transferToken)
    }
}