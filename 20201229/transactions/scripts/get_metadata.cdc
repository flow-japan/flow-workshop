// Script to get the metadata associated with a moment of specified account and tokenID

import TopShot from 0xfc40912427c789d2

pub fun main(): {String: String} {
    let addr: Address = 0x0000000000000001 // TODO: Change address
    let id: UInt64 = UInt64(1) // TODO: Change token id

    let collectionRef = getAccount(addr).getCapability(/public/MomentCollection)!
        .borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("Could not get public moment collection reference")
    let token = collectionRef.borrowMoment(id: id)
        ?? panic("Could not borrow a reference to the specified moment")
    let data = token.data
    let metadata = TopShot.getPlayMetaData(playID: data.playID) ?? panic("Play doesn't exist")
    log(metadata)
    return metadata
}