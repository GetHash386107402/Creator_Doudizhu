const mysql = require('mysql');
let client = undefined;
const query = function(sql , cb){
    client.getConnection((err , connection)=>{
       if (err){
           console.log('get connection = '+ err);
           if (cb){
               cb(err);
           }
       }else {
           connection.query(sql , (connErr , connResult)=>{
               if (connErr){
                   console.log(sql + connErr);
                   if (cb){
                       cb(connErr);
                   }
               } else {
                   if (cb){
                       cb(null , connResult);
                   }
               }
           });
       }
    });
};

exports.getPlayerInfoWithUniqueID = function (key , cb) {
    let sql = 'select *from t_account where  unique_id ='+ key +';';
    query( sql , cb);
};

exports.getPlayerInfoWithAccountID = function (key , cb) {
    let sql = 'select *from t_account where  account_id ='+ key +';';
    query( sql , cb);
};
exports.createPlayerInfo = function(uniqueID,accountID,nickName,goldCount,avatarUrl){
    // {
//     'unique_id'   :      '10000',
//     'account_id' :       '1000',
//     'nick_name'  :      '小木木',
//     'gold_count' :      5,
//     'avatar_url'   :       'http://p0.so.qhimgs1.com/bdr/_240_/t0176287694c85731f4.jpg'
// }
    let sql = 'insert into t_account(unique_id,account_id,nick_name,gold_count,avatar_url) values('
        +"'"+uniqueID+"'"+","
        +"'"+accountID+"'"+","
        +"'"+nickName+"'"+","
        +goldCount+","
        +"'"+avatarUrl+"'"+");";
    query(sql ,(err ,data)=>{
       if (err){
           console.log(' create player info = ' + err);
       }  else {
           console.log('create player info = ' + JSON.stringify(data));
       }
    });
} ;
exports.connect = function (config) {
        client = mysql.createPool(config);
};

