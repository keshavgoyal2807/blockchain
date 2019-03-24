const express = require('express');
const getBlock = require('./chain.js').getBlock;
const blockchain = require('./chain.js').blockchain;
const blockHeight = require('./chain.js').getBlockHeight;
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.get('/block/:height',(req,res) =>{
    const height = req.params.height;
    blockHeight().then((blockHeight) =>{
        if(height <= blockHeight)
        {
            getBlock(height).then((res1) =>{
                res.send(res1);
            }).catch((e) =>{
                res.send(e);
            })
        }
        else
        {
            res.send('height out of bounds');
        }
    })
});

app.post('/block',(req,res) =>{
    const body = req.body.body;
    if(body === "" || typeof(body) === "undefined")
    {
        res.send('body is empty');
    }
    else
    {
        res.send(blockchain.addBody(body));
    }
    
})

app.listen(3000,(err,res) =>{
    if(err)
    {
        console.log("Unable To Connect");
    }
    else
    {
        console.log("Connected to port 3000");
    }
})