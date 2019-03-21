const level = require('level');
const DB = './DB';
const db = level(DB);

function addData(key,value){
    db.put(key,value,function(err){
        if(err)
        {
            console.log(err+'123');
        }
    });
}

function getData(key){
    db.get(key,function(err,res){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(JSON.parse(res));
        }
    })
}

function addDataToLevelDB(value){
    let i=0;
    db.createReadStream().on('data',(data) => {
        console.log(JSON.parse(data));
        i++;
    }).on('error',(error) => {
        console.log(error);
    }).on('close',() => {
        // console.log(i);
        addData(i,value);
    })
}

// (function theLoop (i) {
//     setTimeout(function () {
//       addDataToLevelDB(`Testing data ${i}`);
//       if (--i) theLoop(i);
//     }, 100);
//   })(10);

var obj={
    hash:"fddavfsgvsbf",
    height:0
}

var obj1={
    hash:"fddavfsgvvsasbf",
    height:1
}

// addData(0,JSON.stringify(obj));

// addData(1,JSON.stringify(obj1));

// addDataToLevelDB(JSON.stringify(obj1));
getData(2);

db.createReadStream().on('data',function(data){
    console.log(JSON.parse(data.value));
})