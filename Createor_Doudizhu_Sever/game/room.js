const defines = require('./../defines');
const getRandomStr = function(count){
  let str = '';
  for (let i = 0; i< count;i++){
      str += Math.floor(Math.random()*10);
  }
  return str;
};
const getSeatIndex = function(playerList){
    let z = 0;
    if(playerList.length===0){
        return z;
    }
    for (let i=0;i<playerList.length;i++){
        if (z !== playerList[i].seatIndex){
            return z;
        }
        z++;
    }
    console.log("z = " + z);
    return z;
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
        player.seatIndex = getSeatIndex(_playerList);
        console.log("dfdfdfdfdfdfdfdfdfd"+JSON.parse(getSeatIndex(_playerList)));
        console.log("dfdfdfdfdfdfdfdfdfd"+JSON.parse(player.seatIndex));
        for (let i=0;i<_playerList.length;i++) {
            _playerList[i].sendPlayerJoinRoom({
                nickName: player.nickName,
                accountID: player.accountID,
                avatarUrl: player.avatarUrl,
                goldCount: player.goldCount,
                seatIndex: player.seatIndex
            });
        }
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
        // let Index = getSeatIndex(_playerList);
        if (cb){
            cb({
                seatIndex:player.seatIndex,
                playerData: playerData,
                roomID:that.roomID,
                houseManganerID:_roomManager.accountID
            });
        }
    };
    const changeRoomManger = function(){
        if (_playerList.length === 0){
            return;
        }
        _roomManager = _playerList[0];
        for (let i = 0;i < _playerList.length;i++){
            _playerList[i].sendChangeRoomManger(_roomManager.accountID);
        }
    };
    const gameStart = function(){
      for (let i=0;i<_playerList.length;i++){
          _playerList[i].sendGameStart();
      }
    };
    that.playerOffline = function(player){
        for (let i=0;i<_playerList.length;i++){
            if (_playerList[i].accountID === palyer.accountID){
                _playerList.splice(i,1);
                if (player.accountID === _roomManager.accountID){
                    changeRoomManger();
                }
            }
        }
    };
    that.playerReady = function(player){
        for (let i = 0;i<_playerList.length;i++){
            _playerList[i].sendPlayerReady(player.accountID);
        }
    };
    that.roomMangerSartGame = function(player,cb){
        if (_playerList.length !== defines.roomFullPlayerCount){
            if (cb){
                cb("playerNumber is not enough");
            }
            return;
        }
        for (let i = 0;i<_playerList.length;i++){
            if (_playerList[i].accountID !== _roomManager.accountID){
                if (_playerList[i].isReady === false){
                    if (cb){
                        cb("player is not ready");
                    }
                    return;
                }
            }
        }
        if (cb){
            cb(null,"success");
        }
        gameStart();
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