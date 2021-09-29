const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/Emp'
const ro = require('./routes/rou')
const session = require('express-session')

const app = new express()

mongoose.connect(url,{useNewUrlParser:true})

const con = mongoose.connection
con.on('open',()=>{
    console.log('Connected!!!...')
})

app.use(express.urlencoded())
app.use(session({
    secret:'AJAY JANGID',
    resave:false,
    saveUninitialized:true
}))

app.use('/',ro);

app.listen(9000,()=>{
    console.log('Server started....')
})
