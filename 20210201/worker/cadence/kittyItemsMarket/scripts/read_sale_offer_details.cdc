import KittyItemsMarket from 0xKITTYMARKET

// This transaction returns an array of all the nft ids fro sale in the collection

pub fun main(account: Address, saleItemID: UInt64): [UInt64] {
    let acct = getAccount(account)
    let marketCollectionRef = getAccount(marketCollectionAddress)
         .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(
            KittyItemsMarket.CollectionPublicPath
        )
        .borrow()
        ?? panic("Could not borrow market collection from market address")
    let saleOffer = marketCollectionRef.borrowSaleItem(saleItemID: saleItemID)
    
    return [
        saleOffer.saleCompleted,
        saleOffer.saleItemID,
        saleOffer.salePrice
    ]
}
 