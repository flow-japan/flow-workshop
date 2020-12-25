// Script to get the NFT list (tokenID list) in the collection of the specified account

import TopShot from 0xfc40912427c789d2

pub fun main(): [UInt64] {
  let addr: Address = 0x0000000000000001 // TODO: Change address

  let collectionRef = getAccount(addr).getCapability(/public/MomentCollection)!
                          .borrow<&{TopShot.MomentCollectionPublic}>()!
  return collectionRef.getIDs()
}