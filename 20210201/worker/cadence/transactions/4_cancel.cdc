import SampleMarket from 0xSAMPLEMARKET

transaction(
    saleItemTokenAddress: Address,
    saleItemTokenName: String,
    saleItemID: UInt64
) {
    prepare(account: AuthAccount) {
        let listing <- account
            .borrow<&SampleMarket.Collection>(from: SampleMarket.CollectionStoragePath)!
            .remove(
                saleItemTokenAddress: saleItemTokenAddress,
                saleItemTokenName: saleItemTokenName,
                saleItemID: saleItemID
            )
        destroy listing
    }
}
