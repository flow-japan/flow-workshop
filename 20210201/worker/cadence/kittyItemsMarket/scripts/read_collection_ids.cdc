import KittyItemsMarket from 0xKITTYMARKET

// This transaction returns an array of all the nft ids fro sale in the collection

pub fun main(account: Address): [UInt64] {
    let cap = getAccount(account)
      .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath)!

    if let col = cap.borrow() {
      return col.getSaleOfferIDs()
    } else {
      return []
    }
  }