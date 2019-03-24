const sha256 = require('crypto-js/sha256');
const level = require('level');
const DB = './DB';
const db = level(DB);

function addData(key,value){
    db.put(key,value,function(err){
        if(err)
        {
            console.log(`unable to add to db. ${err}`);
        }
    });
}

function getData(key){
    db.get(key,function(err,res){
        if(err)
        {
            console.log(`unable to get data ${err}`);
        }
        else
        {
            console.log(res);
        }
    })
}

// function addDataToLevelDB(value){
//     let i=0;
//     db.createReadStream().on('data',function(){
//         i++;
//     }).on('error',function(err){
//         console.log(err);
//     }).on('close',function(){
//         addData(i,value);
//     })
// }

//"getBlockHeight"

function getBlockHeight(){
    // let newHeight=0;
    // db.createReadStream().on('data',function(data){
    //     console.log(data);
    //     newHeight++;
    // }).on('error',function(err){
    //     console.log(err+'123');
    // }).on('end',function(){
    //     console.log(newHeight);
    //     return newHeight;
    // })
    // console.log(newHeight);
    return new Promise(function(resolve,reject){
        let newHeight=-1;

        db.createReadStream().on('data',function(data){
            // console.log(data);
            newHeight++;
        }).on('error',function(err){
            console.log(err+'123');
        }).on('end',function(){
            // console.log(newHeight);
            resolve(newHeight);
        })
    })  
}

function getBlockHash(height){
    return new Promise(function(resolve,reject){
        db.get(height,function(err,res){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res1=JSON.parse(res);
            // console.log(res1);
            resolve(res1.hash);
        }
    })
    })
}

function getBlock(height){
    return new Promise(function(resolve,reject){
        db.get(height,function(err,res){
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log(res);
            res1=JSON.parse(res);
            // console.log(res1);
            resolve(res1);
        }
    })
    })
}

class Block{
    constructor(data){
        this.hash="",
        this.height=0,
        this.body=data,
        this.time=0,
        this.previousblockhash=""
        this.nextblockhash=""
    }
}

class blockChain{
    constructor(){
        // this.addBlock(new Block('Genisis Block'));
    }
    addBlock(block){
        getBlockHeight().then((height) =>{
            block.height=height+1;
            // console.log(block.height);
            block.time = new Date().getTime().toString();
            if(block.height>0)
            {
                getBlockHash(block.height-1).then((hash)=>{
                    block.previousblockhash=hash;
                    block.hash = sha256(JSON.stringify(block)).toString();
                    // using array method
                    // this.chain.push(block);

                    // using levelDB
                    addData(block.height,JSON.stringify(block));
                        // console.log(block.height)
                });
                        // this.chain[this.chain.length-1].nextblockhash = block.hash;
            }
            else{
                block.hash = sha256(JSON.stringify(block)).toString();
                addData(block.height,JSON.stringify(block));   
            }

        }).catch((e)=>{
            console.log(e);
        })
        // console.log(block);
        // block.height = height;
    }

    addBody(body){
        this.addBlock(new Block(body));
    }
    validateBlock(height){
        return getBlock(height).then((block) =>{
            // console.log(block);
            var hash = block.hash;
            // console.log(hash);
            block.hash='';
            var validateHash = sha256(JSON.stringify(block)).toString();
            if(hash === validateHash)
            {
                return new Promise(function(resolve,reject){
                    resolve(1);
                })
            }
            else
            {
                return new Promise(function(resolve,reject){
                    resolve(false);
                })
            }
        }).catch((e) =>{
            console.log(e);
        })
    }
}

blockchain = new blockChain();
// blockchain.addBody('from addBody123');
// blockchain.addBlock(new Block('keshav'));
// new blockChain().addBlock(new Block('keshav2'));

// new blockChain().validateBlock('0').then((res) =>{
//     console.log(res);
// });
// console.log(k);
db.createReadStream().on('data',function(data){
    console.log(data);
})
// db.del(6);
// db.del(7);
// console.log(new Block('Genisis Block');


module.exports={
    getBlock,
    blockchain,
    getBlockHeight
}