// Transaction to mint NFTs
// Sender: Account that has TopShot's Admin resource object

import TopShot from 0xfc40912427c789d2

transaction() {
    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&TopShot.Admin>(from: /storage/TopShotAdmin)!
    }

    execute {
        let setID: UInt32 = UInt32(1)
        let playID: UInt32 = UInt32(1)
        let recipientAddr: Address = 0x0000000000000001

        let setRef = self.adminRef.borrowSet(setID: setID)
        let moment1 <- setRef.mintMoment(playID: playID)
        let recipient = getAccount(recipientAddr)
        let receiverRef = recipient.getCapability(/public/MomentCollection)!.borrow<&{TopShot.MomentCollectionPublic}>()
            ?? panic("Cannot borrow a reference to the recipient's moment collection")
        receiverRef.deposit(token: <-moment1)
    }
  }
}