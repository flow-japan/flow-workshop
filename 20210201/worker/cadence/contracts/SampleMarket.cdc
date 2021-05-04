import FungibleToken from 0xFUNGIBLETOKENADDRESS
import NonFungibleToken from 0xNONFUNGIBLETOKEN

/*
    This is a simple KittyItems initial sale contract for the DApp to use
    in order to list and sell KittyItems.

    Its structure is neither what it would be if it was the simplest possible
    marjet contract or if it was a complete general purpose market contract.
    Rather it's the simplest possible version of a more general purpose
    market contract that indicates how that contract might function in
    broad strokes. This has been done so that integrating with this contract
    is a useful preparatory exercise for code that will integrate with the
    later more general purpose market contract.

    It allows:
    - Anyone to create Sale Offers and place them in a collection, making it
      publicly accessible.
    - Anyone to accept the offer and buy the item.

    It notably does not handle:
    - Multiple different sale NFT contracts.
    - Multiple different payment FT contracts.
    - Splitting sale payments to multiple recipients.

 */

pub contract SampleMarket {
    // SaleOffer events.
    //
    // A sale offer has been created.
    pub event SaleOfferCreated(id: UInt64, itemTokenAddress: Address, itemTokenName: String, itemID: UInt64, paymentTokenAddress: Address, paymentTokenName: String, price: UFix64)
    // Someone has purchased an item that was offered for sale.
    pub event SaleOfferAccepted(id: UInt64, itemTokenAddress: Address, itemTokenName: String, itemID: UInt64)
    // A sale offer has been destroyed, with or without being accepted.
    pub event SaleOfferFinished(id: UInt64, itemTokenAddress: Address, itemTokenName: String, itemID: UInt64)

    // Collection events.
    //
    // A sale offer has been inserted into the collection of Address.
    pub event CollectionInsertedSaleOffer(saleOfferId: UInt64, saleItemTokenAddress: Address, saleItemTokenName: String, saleItemID: UInt64, saleItemCollection: Address)
    // A sale offer has been removed from the collection of Address.
    pub event CollectionRemovedSaleOffer(saleOfferId: UInt64, saleItemTokenAddress: Address, saleItemTokenName: String, saleItemID: UInt64, saleItemCollection: Address)

    pub let CollectionStoragePath: Path
    pub let CollectionPublicPath: Path

    pub var saleOfferCount: UInt64

    // SaleOfferPublicView
    // An interface providing a read-only view of a SaleOffer
    //
    pub resource interface SaleOfferPublicView {
        pub var saleCompleted: Bool
        pub let id: UInt64
        pub let saleItemTokenAddress: Address
        pub let saleItemTokenName: String
        pub let saleItemID: UInt64
        pub let salePrice: UFix64
        pub let salePaymentTokenAddress: Address
        pub let salePaymentTokenName: String
    }

    // SaleOffer
    // A NFT being offered to sale for a set fee paid in Kibble etc.
    //
    pub resource SaleOffer: SaleOfferPublicView {
        pub var saleCompleted: Bool

        pub let id: UInt64

        pub let saleItemTokenAddress: Address
        pub let saleItemTokenName: String
        pub let saleItemID: UInt64
        access(self) let sellerItemProvider: Capability<&AnyResource{NonFungibleToken.Provider}>

        pub let salePrice: UFix64
        pub let salePaymentTokenAddress: Address
        pub let salePaymentTokenName: String
        access(self) let sellerPaymentReceiver: Capability<&AnyResource{FungibleToken.Receiver}>

        // Called by a purchaser to accept the sale offer.
        // If they send the correct payment in Kibble, and if the item is still available,
        // the KittyItems NFT will be placed in their KittyItems.Collection .
        //
        pub fun accept(
            buyerCollection: &AnyResource{NonFungibleToken.Receiver},
            buyerPayment: @FungibleToken.Vault
        ) {
            pre {
                buyerPayment.balance == self.salePrice: "payment does not equal offer price"
                self.saleCompleted == false: "the sale offer has already been accepted"
            }

            self.saleCompleted = true

            self.sellerPaymentReceiver.borrow()!.deposit(from: <-buyerPayment)

            let nft <- self.sellerItemProvider.borrow()!.withdraw(withdrawID: self.saleItemID)
            buyerCollection.deposit(token: <-nft)

            emit SaleOfferAccepted(
                id: self.id,
                itemTokenAddress: self.saleItemTokenAddress,
                itemTokenName: self.saleItemTokenName,
                itemID: self.saleItemID
            )
        }

        destroy() {
            // Whether the sale completed or not, publicize that it is being withdrawn.
            emit SaleOfferFinished(
                id: self.id,
                itemTokenAddress: self.saleItemTokenAddress,
                itemTokenName: self.saleItemTokenName,
                itemID: self.saleItemID
            )
        }

        // initializer
        // Take the information required to create a sale offer, notably the capability
        // to transfer the NFT and the capability to receive Kibble etc. in payment.
        //
        init(
            id: UInt64,
            saleItemTokenAddress: Address,
            saleItemTokenName: String,
            saleItemID: UInt64,
            sellerItemProvider: Capability<&AnyResource{NonFungibleToken.Provider}>,
            salePaymentTokenAddress: Address, // TODO: この情報が正しいことを確認すべき（現状の Cadence 仕様では難しい）
            salePaymentTokenName: String,
            salePrice: UFix64,
            sellerPaymentReceiver: Capability<&AnyResource{FungibleToken.Receiver}>
        ) {
            pre {
                sellerItemProvider.borrow() != nil: "Cannot borrow seller"
                sellerPaymentReceiver.borrow() != nil: "Cannot borrow sellerPaymentReceiver"
            }

            self.saleCompleted = false

            self.id = id

            self.saleItemTokenAddress = saleItemTokenAddress
            self.saleItemTokenName = saleItemTokenName
            self.sellerItemProvider = sellerItemProvider
            self.saleItemID = saleItemID

            self.salePaymentTokenAddress = salePaymentTokenAddress
            self.salePaymentTokenName = salePaymentTokenName
            self.sellerPaymentReceiver = sellerPaymentReceiver
            self.salePrice = salePrice

            emit SaleOfferCreated(
                id: self.id,
                itemTokenAddress: self.saleItemTokenAddress,
                itemTokenName: self.saleItemTokenName,
                itemID: self.saleItemID,
                paymentTokenAddress: self.salePaymentTokenAddress,
                paymentTokenName: self.salePaymentTokenName,
                price: self.salePrice,
            )
        }
    }

    // createSaleOffer
    // Make creating a SaleOffer publicly accessible.
    //
    pub fun createSaleOffer (
        saleItemTokenAddress: Address,
        saleItemTokenName: String,
        saleItemID: UInt64,
        sellerItemProvider: Capability<&AnyResource{NonFungibleToken.Provider}>,
        salePaymentTokenAddress: Address,
        salePaymentTokenName: String,
        salePrice: UFix64,
        sellerPaymentReceiver: Capability<&AnyResource{FungibleToken.Receiver}>
    ): @SaleOffer {
        let saleOffer <-create SaleOffer(
            id: SampleMarket.saleOfferCount,
            saleItemTokenAddress: saleItemTokenAddress,
            saleItemTokenName: saleItemTokenName,
            saleItemID: saleItemID,
            sellerItemProvider: sellerItemProvider,
            salePaymentTokenAddress: salePaymentTokenAddress,
            salePaymentTokenName: salePaymentTokenName,
            salePrice: salePrice,
            sellerPaymentReceiver: sellerPaymentReceiver
        )
        SampleMarket.saleOfferCount = SampleMarket.saleOfferCount + (1 as UInt64)
        return <- saleOffer
    }

    // CollectionManager
    // An interface for adding and removing SaleOffers to a collection, intended for
    // use by the collection's owner.
    //
    pub resource interface CollectionManager {
        pub fun insert(offer: @SampleMarket.SaleOffer)
        pub fun remove(saleItemTokenAddress: Address, saleItemTokenName: String, saleItemID: UInt64): @SaleOffer 
    }

    // CollectionPurchaser
    // An interface to allow purchasing items via SaleOffers in a collection.
    // This function is also provided by CollectionPublic, it is here to support
    // more fine-grained access to the collection for as yet unspecified future use cases.
    //
    pub resource interface CollectionPurchaser {
        pub fun purchase(
            saleItemTokenAddress: Address,
            saleItemTokenName: String,
            saleItemID: UInt64,
            buyerCollection: &AnyResource{NonFungibleToken.Receiver},
            buyerPayment: @FungibleToken.Vault
        )
    }

    // CollectionPublic
    // An interface to allow listing and borrowing SaleOffers, and purchasing items via SaleOffers in a collection.
    //
    pub resource interface CollectionPublic {
        pub fun getSaleOfferKeys(): [String]
        pub fun borrowSaleItem(saleItemTokenAddress: Address, saleItemTokenName: String, saleItemID: UInt64): &SaleOffer{SaleOfferPublicView}
        pub fun purchase(
            saleItemTokenAddress: Address,
            saleItemTokenName: String,
            saleItemID: UInt64,
            buyerCollection: &AnyResource{NonFungibleToken.Receiver},
            buyerPayment: @FungibleToken.Vault
        )
   }

    // Collection
    // A resource that allows its owner to manage a list of SaleOffers, and purchasers to interact with them.
    //
    pub resource Collection : CollectionManager, CollectionPurchaser, CollectionPublic {
        pub var saleOffers: @{String: SaleOffer}

        // insert
        // Insert a SaleOffer into the collection, replacing one with the same saleItemID if present.
        //
        pub fun insert(offer: @SampleMarket.SaleOffer) {
            let saleOfferId = offer.id
            let tokenAddress = offer.saleItemTokenAddress
            let tokenName = offer.saleItemTokenName
            let id = offer.saleItemID
            let key = tokenAddress.toString()
                .concat(".")
                .concat(tokenName)
                .concat(".")
                .concat(id.toString())

            // add the new offer to the dictionary which removes the old one
            let oldOffer <- self.saleOffers[key] <- offer
            destroy oldOffer

            emit CollectionInsertedSaleOffer(
                saleOfferId: saleOfferId,
                saleItemTokenAddress: tokenAddress,
                saleItemTokenName: tokenName,
                saleItemID: id,
                saleItemCollection: self.owner?.address!
            )
        }

        // remove
        // Remove and return a SaleOffer from the collection.
        pub fun remove(saleItemTokenAddress: Address, saleItemTokenName: String, saleItemID: UInt64): @SaleOffer {
            let key = saleItemTokenAddress.toString()
                .concat(".")
                .concat(saleItemTokenName)
                .concat(".")
                .concat(saleItemID.toString())
            let offer <-(self.saleOffers.remove(key: key) ?? panic("missing SaleOffer"))
            emit CollectionRemovedSaleOffer(
                saleOfferId: offer.id,
                saleItemTokenAddress: saleItemTokenAddress,
                saleItemTokenName: saleItemTokenName,
                saleItemID: saleItemID,
                saleItemCollection: self.owner?.address!
            )
            return <- offer
        }
 
        // purchase
        // If the caller passes a valid saleItemID and the item is still for sale, and passes a Kibble vault
        // typed as a FungibleToken.Vault (Kibble.deposit() handles the type safety of this)
        // containing the correct payment amount, this will transfer the KittyItem to the caller's
        // KittyItems collection.
        // It will then remove and destroy the offer.
        // Note that is means that events will be emitted in this order:
        //   1. Collection.CollectionRemovedSaleOffer
        //   2. KittyItems.Withdraw
        //   3. KittyItems.Deposit
        //   4. SaleOffer.SaleOfferFinished
        //
        pub fun purchase(
            saleItemTokenAddress: Address,
            saleItemTokenName: String,
            saleItemID: UInt64,
            buyerCollection: &AnyResource{NonFungibleToken.Receiver},
            buyerPayment: @FungibleToken.Vault
        ) {
            pre {
                self.saleOffers[saleItemTokenAddress.toString().concat(".").concat(saleItemTokenName).concat(".").concat(saleItemID.toString())] != nil: "SaleOffer does not exist in the collection!"
            }
            let offer <- self.remove(
                saleItemTokenAddress: saleItemTokenAddress,
                saleItemTokenName: saleItemTokenName,
                saleItemID: saleItemID
            )
            offer.accept(buyerCollection: buyerCollection, buyerPayment: <-buyerPayment)
            //FIXME: Is this correct? Or should we return it to the caller to dispose of?
            destroy offer
        }

        pub fun getSaleOfferKeys(): [String] {
            return self.saleOffers.keys
        }

        // borrowSaleItem
        // Returns a read-only view of the SaleItem for the given saleItemTokenAddress, saleItemTokenName and saleItemID if it is contained by this collection.
        //
        pub fun borrowSaleItem(saleItemTokenAddress: Address, saleItemTokenName: String, saleItemID: UInt64): &SaleOffer{SaleOfferPublicView} {
            pre {
                self.saleOffers[saleItemTokenAddress.toString().concat(".").concat(saleItemTokenName).concat(".").concat(saleItemID.toString())] != nil: "SaleOffer does not exist in the collection!"
            }
            let key = saleItemTokenAddress.toString()
                .concat(".")
                .concat(saleItemTokenName)
                .concat(".")
                .concat(saleItemID.toString())
            return &self.saleOffers[key] as &SaleOffer{SaleOfferPublicView}
        }

        destroy () {
            destroy self.saleOffers
        }

        init () {
            self.saleOffers <- {}
        }
    }

    pub fun createEmptyCollection(): @Collection {
        return <-create Collection()
    }

    init () {
        //FIXME: REMOVE SUFFIX BEFORE RELEASE
        self.CollectionStoragePath = /storage/SampleMarketCollection002
        self.CollectionPublicPath = /public/SampleMarketCollection002

        self.saleOfferCount = 0
    }
}