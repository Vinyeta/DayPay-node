const express =require('express')
const bodyParser = require('body-parser')
const mongoose = require ('mongoose')
const Wallet = require ('./models/wallet')

const app =express()
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/api/wallet', (req,res) => {
res.send(200, {wallet:[{}]})
})



app.post('/api/wallet', (req,res) => {
console.log('POST/api/wallet')
console.log(req.body)

//let wallet = new Wallet ()
//wallet.name = req.body.name
//wallet.picture = req.body.picture()

wallet.save((err, walletStored))
if (err) res.status(500).send({message:`Error ${err}`})
res.status(200).send({wallet: walletStorage})


    })

app.put('/api/wallet/walletId', (req,res) => {
})

app.delete('/api/wallet/:walletId', (req,res) => {
let walletId = req.params.walletId

Wallet.findById(walletId, (err) => {
    if (err) res.status(500).send({message: `Error: ${err}`})

    wallet.remove(err => {
        if (err) res.status(500).send({message: `Error: ${err}`})
        res.status(200).send({message:'Wallet eliminate'})
    })
})

})
mongoose.connection('mpngodb://localhost:2701/transfer', (err, res) =>{
    if (err) 
    return console.log(`Error: ${err}`)
    app.listen(port, () => {
        console.log(`API REST corriendo en http://localhost:${port}`)
})
})