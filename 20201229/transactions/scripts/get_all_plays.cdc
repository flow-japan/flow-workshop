// Script to get an array of all the plays that have ever been created for Top Shot

import TopShot from 0xfc40912427c789d2

pub fun main(): [TopShot.Play] {
    return TopShot.getAllPlays()
}