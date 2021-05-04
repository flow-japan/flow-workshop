// Sender: 0x04

import Evolution from 0x04

transaction {
    prepare(acct: AuthAccount) {
        // Mint
        let admin = acct.borrow<&Evolution.Admin>(from: /storage/EvolutionAdmin) ?? panic("No admin resource in storage")

        admin.startNewSeries()
 
        admin.createItem(metadata: {"Title":"Cerulean", "Description":"Aquatic species from Andromeda", "Hash":"365871ea019e9ba0da27d21091111dd7d5c16cd5e3c444dd460ebf95b8e3afde"})
        admin.createItem(metadata: {"Title":"Cornelius", "Description":"#Monke", "Hash":"02c81e2f902a180b77b5eee3ed809bd248643c0e05e86aacff87e7f973c0ab34"})
        admin.createItem(metadata: {"Title":"Happy", "Description":"There is no need to be upset", "Hash":"156fff9f3dffcc1e7a0494e4219841e018d7c36bcdf6f17186ddda5c2c834fcc"})
        admin.createItem(metadata: {"Title":"Tetra", "Description":"Aquatic species from Andromeda moon", "Hash":"dc4bbe4d547de6df0443cc745c199505c5eb86ffbb79cdaef9711620d12abb4a"})
        admin.createItem(metadata: {"Title":"Socrates", "Description":"All I know is that I know nothing.", "Hash":"575321e4441003353228d247ee4d205ca57d6bf3c4a7155caf0f49fd8c7b73f3"})

        admin.createSet(name: "Evolution", description: "")

        let set = admin.borrowSet(setId: 1 as UInt32)

        set.addItems(itemIds: [1 as UInt32, 2 as UInt32, 3 as UInt32, 4 as UInt32, 5 as UInt32])

        let item1Collection <- set.batchMintCollectible(itemId: 1, quantity: 10)
        let item2Collection <- set.batchMintCollectible(itemId: 2, quantity: 10)
        let item3Collection <- set.batchMintCollectible(itemId: 3, quantity: 10)
        let item4Collection <- set.batchMintCollectible(itemId: 4, quantity: 10)
        let item5Collection <- set.batchMintCollectible(itemId: 5, quantity: 10)

        let collection = acct.borrow<&Evolution.Collection>(from: /storage/EvolutionCollection)!
        collection.batchDeposit(tokens: <-item1Collection)
        collection.batchDeposit(tokens: <-item2Collection)
        collection.batchDeposit(tokens: <-item3Collection)
        collection.batchDeposit(tokens: <-item4Collection)
        collection.batchDeposit(tokens: <-item5Collection)

        log("success")
    }
}
