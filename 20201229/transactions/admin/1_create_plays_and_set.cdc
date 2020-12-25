// Transaction to create some Play data and a Set
// Sender: Account that has TopShot's Admin resource object

import TopShot from 0xfc40912427c789d2

transaction() {
    prepare(acct: AuthAccount) {
        let admin = acct.borrow<&TopShot.Admin>(from: /storage/TopShotAdmin)
                        ?? panic("No admin resource in storage")

        // Create some Play data
        admin.createPlay(metadata: {
            "FullName": "Lou Williams",
            "Birthdate": "1986-10-27",
            "JerseyNumber": "23",
            "TeamAtMoment": "Los Angeles Clippers",
            "DateOfMoment": "2020-01-05 20:30:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "Jaren Jackson Jr.",
            "Birthdate": "1999-09-15",
            "JerseyNumber": "13",
            "TeamAtMoment": "Memphis Grizzlies",
            "DateOfMoment": "2019-11-09 00:00:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "Myles Turner",
            "Birthdate": "1996-03-24",
            "JerseyNumber": "33",
            "TeamAtMoment": "Indiana Pacers",
            "DateOfMoment": "2020-01-25 03:30:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "Kyrie Irving",
            "Birthdate": "1992-03-23",
            "JerseyNumber": "11",
            "TeamAtMoment": "Brooklyn Nets",
            "DateOfMoment": "2020-02-01 00:30:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "P.J. Tucker",
            "Birthdate": "1985-05-05",
            "JerseyNumber": "17",
            "TeamAtMoment": "Houston Rockets",
            "DateOfMoment": "2019-11-12 01:00:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "Nikola Jokić",
            "Birthdate": "1995-02-19",
            "JerseyNumber": "15",
            "TeamAtMoment": "Denver Nuggets",
            "DateOfMoment": "2019-12-30 01:00:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "Mike Conley",
            "Birthdate": "1987-10-11",
            "JerseyNumber": "10",
            "TeamAtMoment": "Utah Jazz",
            "DateOfMoment": "2019-11-12 03:30:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "Nemanja Bjelica",
            "Birthdate": "1988-05-09",
            "JerseyNumber": "88",
            "TeamAtMoment": "Sacramento Kings",
            "DateOfMoment": "2019-12-10 01:00:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "Ky Bowman",
            "Birthdate": "1997-06-16",
            "JerseyNumber": "12",
            "TeamAtMoment": "Golden State Warriors",
            "DateOfMoment": "2020-01-09 03:00:00 +0000 UTC"
        })
        admin.createPlay(metadata: {
            "FullName": "Pascal Siakam",
            "Birthdate": "1994-04-02",
            "JerseyNumber": "43",
            "TeamAtMoment": "Toronto Raptors",
            "DateOfMoment": "2019-11-11 02:30:00 +0000 UTC"
        })

        // Create a Set
        let setName = "Test Set 1"
        admin.createSet(name: setName)

        // Add the Play to the Set
        let setRef = admin.borrowSet(setID: UInt32(1))
        setRef.addPlay(playID: UInt32(1))
        setRef.addPlay(playID: UInt32(2))
        setRef.addPlay(playID: UInt32(3))
        setRef.addPlay(playID: UInt32(4))
        setRef.addPlay(playID: UInt32(5))
        setRef.addPlay(playID: UInt32(6))
        setRef.addPlay(playID: UInt32(7))
        setRef.addPlay(playID: UInt32(8))
        setRef.addPlay(playID: UInt32(9))
        setRef.addPlay(playID: UInt32(10))
    }
}