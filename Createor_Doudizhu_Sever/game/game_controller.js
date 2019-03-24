const Player = require('./player');
const Room = require('./room');
const defines = require('./../defines');
let _playerList = [];
let _roomList = [];

exports.createPlayer = function (data,socket,callBackIndex) {
    let player = Player(data,socket,callBackIndex,this);
    _playerList.push(player);
};

exports.createRoom = function (data,player,cb) {
    //检测金币是否充足
    let needCostGold = defines.createRoomConfig[data.rate];
    if (player.goldCount<needCostGold){
        if (cb){
            cb('gold not enough');
        }
        return
    }
    let room = Room(data,player);
    _roomList.push(room);
    if (cb){
        cb(null,room.roomID);
    }
};
exports.joinRoom = function (data,player,cb) {
    for (let i = 0;i < _roomList.length;i++){
        if (_roomList[i].roomID === data){
            let  room = _roomList[i];
            room.joinPlayer(player);
            if (cb){
                cb(null, {
                    room: room,
                    data: {bottom: room.bottom, rate: room.rate}
                });
            }
            return;
        }
    }
    if (cb){
        cb('no have this room '+ data);
    }
};