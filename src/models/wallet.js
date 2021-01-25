const mongoose =require ('mongoose')
const Schema = mongoose.Schema

const WalletSchema = Schema ({
    Author: 'Id',
    Comentary:'String',
    Payment: [],
    Receiver: 'Id',
    Date: {number},
    Amount:{number},
    Concept:'String',
    Sender:'Id'
})

module.export = mongoose.model ('Wallet',WalletSchema)