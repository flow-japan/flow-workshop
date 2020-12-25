// This script reads the current number of moments that have been minted
// from the TopShot contract and returns that number to the caller

import TopShot from 0xfc40912427c789d2

pub fun main(): UInt64 {
    return TopShot.totalSupply
}