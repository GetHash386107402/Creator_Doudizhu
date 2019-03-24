const socket = require('socket.io');
const app = socket(3000);
const myDB = require('./db');
const defines = require('./defines');
const gameController = require('./game/game_controller');

myDB.connect({
   "host":"127.0.0.1",
    "port":3306,
    "user":"root",
    "password":"zzf386107402",
    "database":"creator_doudizhu"
});
// myDB.createPlayerInfo( '10000', '1000','小木木',5, 'http://p0.so.qhimgs1.com/bdr/_240_/t0176287694c85731f4.jpg');
//
// myDB.getPlayerInfoWithAccountID('1000',(err,data)=>{
//    if (err){
//        console.log('get  player info = ' + err);
//    }  else {
//        console.log('data = ' + JSON.stringify(data));
//    }

// });
app.on ('connection',function (socket) {
    console.log('a user connection');
    socket.emit('connect',' connection success ');
    socket.on('notify',(notifyData)=>{
        console.log('notify = ' + JSON.stringify(notifyData));
        //测试代码
        // socket.emit('notify',{callBackIndex: data.callBackIndex,data:'login NBBB'});

        switch (notifyData.type) {
            case 'visitor_login':
                console.log('visitor login success OK');
                let uniqueID = notifyData.data.uniqueID;
                let callBackIndex = notifyData.callBackIndex;
                myDB.getPlayerInfoWithUniqueID(uniqueID,(err,data)=>{
                   if (err){
                       console.log('err = '+ err);
                   }else{
                       console.log('data = ' + JSON.stringify(data));
                       if (data.length == 0){
                           let loginData = notifyData.data;
                           myDB.createPlayerInfo(
                               loginData.uniqueID,
                               loginData.accountID,
                               loginData.nickName,
                               defines.defaultGoldCount,
                               loginData.avatarUrl
                               );
                           gameController.createPlayer({
                               "unique_id":notifyData.data.uniqueID,
                               "account_id":notifyData.data.accountID,
                               "nick_name":notifyData.data.nickName,
                               "gold_count":defines.defaultGoldCount,
                               "avatar_url":notifyData.data.avatarUrl
                           },socket,callBackIndex);
                       }else {
                           console.log('data = '+ JSON.stringify(data));
                           gameController.createPlayer(data[0],socket,callBackIndex);
                       }
                   }
                });
                break;
            default:
                break;
        }
    });
});