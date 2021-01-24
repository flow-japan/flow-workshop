import FungibleToken from 0xFUNGIBLETOKENADDRESS
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Kibble from 0xKIBBLE
import KittyItems from 0xKITTYITEMS
import SampleMarket from 0xKITTYMARKET

pub fun hasKibble(_ address: Address): Bool {
  let receiver = getAccount(address)
    .getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)!
    .check()

  let balance = getAccount(address)
    .getCapability<&Kibble.Vault{FungibleToken.Balance}>(Kibble.BalancePublicPath)!
    .check()

  return receiver && balance
}

pub fun hasItems(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath)!
    .check()
}

pub fun hasMarket(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&SampleMarket.Collection{SampleMarket.CollectionPublic}>(SampleMarket.CollectionPublicPath)!
    .check()
}

transaction {
  prepare(acct: AuthAccount) {
    if !hasKibble(acct.address) {
      if acct.borrow<&Kibble.Vault>(from: /storage/KibbleVault) == nil {
        acct.save(<-Kibble.createEmptyVault(), to: Kibble.VaultStoragePath)
      }
      acct.unlink(Kibble.ReceiverPublicPath)
      acct.unlink(Kibble.BalancePublicPath)
      acct.link<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath, target: Kibble.VaultStoragePath)
      acct.link<&Kibble.Vault{FungibleToken.Balance}>(Kibble.BalancePublicPath, target: Kibble.VaultStoragePath)
    }

    if !hasItems(acct.address) {
      if acct.borrow<&KittyItems.Collection>(from: /storage/KittyItemsCollection) == nil {
        acct.save(<-KittyItems.createEmptyCollection(), to: KittyItems.CollectionStoragePath)
      }
      acct.unlink(KittyItems.CollectionPublicPath)
      acct.link<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath, target: KittyItems.CollectionStoragePath)
    }

    if !hasMarket(acct.address) {
      if acct.borrow<&SampleMarket.Collection>(from: /storage/SampleMarketCollection) == nil {
        acct.save(<-SampleMarket.createEmptyCollection(), to: SampleMarket.CollectionStoragePath)
      }
      acct.unlink(SampleMarket.CollectionPublicPath)
      acct.link<&SampleMarket.Collection{SampleMarket.CollectionPublic}>(SampleMarket.CollectionPublicPath, target:SampleMarket.CollectionStoragePath)
    }
  }
}
