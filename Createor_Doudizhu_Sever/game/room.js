const defines = require('./../defines');
const getRandomStr = function(count){
  let str = '';
  for (let i = 0; i< count;i++){
      str += Math.floor(Math.random()*10);
  }
  return str;
};
module.exports = function (spec,player) {
    let that = {};
    that.roomID = getRandomStr(6);
    let config = defines.createRoomConfig[spec.rate];
    let _bottom = config.bottom;
    let _rate = config.rate;
    let _roomManager = player;
    let _playerList = [];

    that.joinPlayer = function (player) {
        _playerList.push(player);
    };
    that.playerEnterRoomScene = function(player,cb){
        let playerData = [];
        for (let i=0;i<_playerList.length;i++){
            playerData.push({
                nickName: _playerList[i].nickName,
                accountID: _playerList[i].accountID,
                avatarUrl: _playerList[i].avatarUrl,
                goldCount: _playerList[i].goldCount,
                seatIndex: _playerList[i].seatIndex
            });
        }
        let Index = 0;
        if (cb){
            cb({
                seatIndex:Index,
                playerData: playerData
            });
        }
    };
    Object.defineProperty(that,'bottom',{
       get(){
           return _bottom;
       }
        // set(value){
        //     _bottom =value;
        // }
    });
    Object.defineProperty(that,'rate',{
        get(){
            return _rate;
        }
        // set(value){
        //     _bottom =value;
        // }
    });
    return that;
};