// ref. https://github.com/dapperlabs/nba-smart-contracts/blob/master/contracts/TopShot.cdc

// ref. https://docs.onflow.org/core-contracts/non-fungible-token/
// Testnet: 0x631e88ae7f1d7c20
// Mainnet: 0x1d7e57aa55817448
import NonFungibleToken from 0x631e88ae7f1d7c20

pub contract TopShot: NonFungibleToken {
    pub event ContractInitialized()
    pub event PlayCreated(id: UInt32, metadata: {String:String})
    pub event NewSeriesStarted(newCurrentSeries: UInt32)

    pub event SetCreated(setID: UInt32, series: UInt32)
    pub event PlayAddedToSet(setID: UInt32, playID: UInt32)
    pub event PlayRetiredFromSet(setID: UInt32, playID: UInt32, numMoments: UInt32)
    pub event SetLocked(setID: UInt32)
    pub event MomentMinted(momentID: UInt64, playID: UInt32, setID: UInt32, serialNumber: UInt32)

    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event MomentDestroyed(id: UInt64)

    pub var currentSeries: UInt32

    access(self) var playDatas: {UInt32: Play}
    access(self) var setDatas: {UInt32: SetData}
    access(self) var sets: @{UInt32: Set}

    pub var nextPlayID: UInt32

    pub var nextSetID: UInt32

    pub var totalSupply: UInt64

    pub struct Play {
        pub let playID: UInt32
        pub let metadata: {String: String}

        init(metadata: {String: String}) {
            pre {
                metadata.length != 0: "New Play metadata cannot be empty"
            }
            self.playID = TopShot.nextPlayID
            self.metadata = metadata
            TopShot.nextPlayID = TopShot.nextPlayID + UInt32(1)
            emit PlayCreated(id: self.playID, metadata: metadata)
        }
    }

    pub struct SetData {
        pub let setID: UInt32
        pub let name: String // ex. "Times when the Toronto Raptors choked in the playoffs"
        pub let series: UInt32

        init(name: String) {
            pre {
                name.length > 0: "New Set name cannot be empty"
            }
            self.setID = TopShot.nextSetID
            self.name = name
            self.series = TopShot.currentSeries
            TopShot.nextSetID = TopShot.nextSetID + UInt32(1)
            emit SetCreated(setID: self.setID, series: self.series)
        }
    }

    pub resource Set {
        pub let setID: UInt32
        pub var plays: [UInt32]
        pub var retired: {UInt32: Bool}
        pub var locked: Bool
        pub var numberMintedPerPlay: {UInt32: UInt32}

        init(name: String) {
            self.setID = TopShot.nextSetID
            self.plays = []
            self.retired = {}
            self.locked = false
            self.numberMintedPerPlay = {}
            TopShot.setDatas[self.setID] = SetData(name: name)
        }

        pub fun addPlay(playID: UInt32) {
            pre {
                TopShot.playDatas[playID] != nil: "Cannot add the Play to Set: Play doesn't exist."
                !self.locked: "Cannot add the play to the Set after the set has been locked."
                self.numberMintedPerPlay[playID] == nil: "The play has already beed added to the set."
            }
            self.plays.append(playID)
            self.retired[playID] = false
            self.numberMintedPerPlay[playID] = 0
            emit PlayAddedToSet(setID: self.setID, playID: playID)
        }

        pub fun addPlays(playIDs: [UInt32]) {
            for play in playIDs {
                self.addPlay(playID: play)
            }
        }

        pub fun retirePlay(playID: UInt32) {
            pre {
                self.retired[playID] != nil: "Cannot retire the Play: Play doesn't exist in this set!"
            }

            if !self.retired[playID]! {
                self.retired[playID] = true

                emit PlayRetiredFromSet(setID: self.setID, playID: playID, numMoments: self.numberMintedPerPlay[playID]!)
            }
        }

        pub fun retireAll() {
            for play in self.plays {
                self.retirePlay(playID: play)
            }
        }

        pub fun lock() {
            if !self.locked {
                self.locked = true
                emit SetLocked(setID: self.setID)
            }
        }

        pub fun mintMoment(playID: UInt32): @NFT {
            pre {
                self.retired[playID] != nil: "Cannot mint the moment: This play doesn't exist."
                !self.retired[playID]!: "Cannot mint the moment from this play: This play has been retired."
            }
            let numInPlay = self.numberMintedPerPlay[playID]!
            let newMoment: @NFT <- create NFT(serialNumber: numInPlay + UInt32(1),
                                              playID: playID,
                                              setID: self.setID)
            self.numberMintedPerPlay[playID] = numInPlay + UInt32(1)
            return <-newMoment
        }

        pub fun batchMintMoment(playID: UInt32, quantity: UInt64): @Collection {
            let newCollection <- create Collection()

            var i: UInt64 = 0
            while i < quantity {
                newCollection.deposit(token: <-self.mintMoment(playID: playID))
                i = i + UInt64(1)
            }

            return <-newCollection
        }
    }

    pub struct MomentData {
        pub let setID: UInt32
        pub let playID: UInt32
        pub let serialNumber: UInt32

        init(setID: UInt32, playID: UInt32, serialNumber: UInt32) {
            self.setID = setID
            self.playID = playID
            self.serialNumber = serialNumber
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let data: MomentData

        init(serialNumber: UInt32, playID: UInt32, setID: UInt32) {
            TopShot.totalSupply = TopShot.totalSupply + UInt64(1)
            self.id = TopShot.totalSupply
            self.data = MomentData(setID: setID, playID: playID, serialNumber: serialNumber)
            emit MomentMinted(momentID: self.id, playID: playID, setID: self.data.setID, serialNumber: self.data.serialNumber)
        }

        destroy() {
            emit MomentDestroyed(id: self.id)
        }
    }

    pub resource Admin {
        pub fun createPlay(metadata: {String: String}): UInt32 {
            var newPlay = Play(metadata: metadata)
            let newID = newPlay.playID
            TopShot.playDatas[newID] = newPlay
            return newID
        }

        pub fun createSet(name: String) {
            var newSet <- create Set(name: name)
            TopShot.sets[newSet.setID] <-! newSet
        }

        pub fun borrowSet(setID: UInt32): &Set {
            pre {
                TopShot.sets[setID] != nil: "Cannot borrow Set: The Set doesn't exist"
            }
            return &TopShot.sets[setID] as &Set
        }

        pub fun startNewSeries(): UInt32 {
            TopShot.currentSeries = TopShot.currentSeries + UInt32(1)
            emit NewSeriesStarted(newCurrentSeries: TopShot.currentSeries)
            return TopShot.currentSeries
        }

        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }
    }

    pub resource interface MomentCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowMoment(id: UInt64): &TopShot.NFT? {
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Moment reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: MomentCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic { 
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: Moment does not exist in the collection")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <-token
        }

        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            var batchCollection <- create Collection()
            for id in ids {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: id))
            }
            return <-batchCollection
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @TopShot.NFT
            let id = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }
            destroy oldToken
        }

        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {
            let keys = tokens.getIDs()
            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }
            destroy tokens
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        pub fun borrowMoment(id: UInt64): &TopShot.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &TopShot.NFT
            } else {
                return nil
            }
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create TopShot.Collection()
    }

    pub fun getAllPlays(): [TopShot.Play] {
        return TopShot.playDatas.values
    }

    pub fun getPlayMetaData(playID: UInt32): {String: String}? {
        return self.playDatas[playID]?.metadata
    }

    pub fun getPlayMetaDataByField(playID: UInt32, field: String): String? {
        if let play = TopShot.playDatas[playID] {
            return play.metadata[field]
        } else {
            return nil
        }
    }

    pub fun getSetName(setID: UInt32): String? {
        return TopShot.setDatas[setID]?.name
    }

    pub fun getSetSeries(setID: UInt32): UInt32? {
        return TopShot.setDatas[setID]?.series
    }

    pub fun getSetIDsByName(setName: String): [UInt32]? {
        var setIDs: [UInt32] = []
        for setData in TopShot.setDatas.values {
            if setName == setData.name {
                setIDs.append(setData.setID)
            }
        }
        if setIDs.length == 0 {
            return nil
        } else {
            return setIDs
        }
    }

    pub fun getPlaysInSet(setID: UInt32): [UInt32]? {
        return TopShot.sets[setID]?.plays
    }

    pub fun isEditionRetired(setID: UInt32, playID: UInt32): Bool? {
        if let setToRead <- TopShot.sets.remove(key: setID) {
            let retired = setToRead.retired[playID]
            TopShot.sets[setID] <-! setToRead
            return retired
        } else {
            return nil
        }
    }

    pub fun isSetLocked(setID: UInt32): Bool? {
        return TopShot.sets[setID]?.locked
    }

    pub fun getNumMomentsInEdition(setID: UInt32, playID: UInt32): UInt32? {
        if let setToRead <- TopShot.sets.remove(key: setID) {
            let amount = setToRead.numberMintedPerPlay[playID]
            TopShot.sets[setID] <-! setToRead
            return amount
        } else {
            return nil
        }
    }

    init() {
        self.currentSeries = 0
        self.playDatas = {}
        self.setDatas = {}
        self.sets <- {}
        self.nextPlayID = 1
        self.nextSetID = 1
        self.totalSupply = 0

        self.account.save<@Collection>(<- create Collection(), to: /storage/MomentCollection)
        self.account.link<&{MomentCollectionPublic}>(/public/MomentCollection, target: /storage/MomentCollection)
        self.account.save<@Admin>(<- create Admin(), to: /storage/TopShotAdmin)

        emit ContractInitialized()
    }
}