const fs = require("fs");


function jsonWrighter(filePath, data = null, cb) {
    fs.readFile(filePath, "utf-8", (err, fileData) =>{
        if (err) {
            return cb && cb(err)
        }
        const Data = JSON.parse(fileData);
        if (data){
            Data.push(data)
            fs.writeFile(filePath, JSON.stringify(Data, null, 2), err =>{
                if (err){
                    return cb && cb(err)
                } else {
                    return cb && cb(null)
                }
            })
        }else {
            return cb && cb(null, Data)
        }
       
        
    })
}
const dataIn = null
jsonWrighter("bellman.json", dataIn, (err, data) => {
    if (err){
        console.log(err);
    }
    if (data) {
        console.log(data[Math.floor(Math.random()*data.length)])
    }
})

