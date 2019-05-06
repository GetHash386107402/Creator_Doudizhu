const defines = require('./../defines');
const croupier = require('./croupier');
//给房间添加状态机
const RoomState = {
    Invalide: -1,
    WaittingReaty: 1,
    StartGame: 2,
    PushCard: 3,
    RobMaster:4,
    ShouBottomCard:5

};
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
    let _croupier = croupier();
    let _lostPlayer = undefined;
    let _robMasterPlayerList = [];
    let _master = undefined;
    let _threeCardsList =[];

    // let cards = _croupier.getThreeCard();
    // for (let i=0;i<cards.length;i++){
    //     for (let j=0;j<cards[i].length;j++){
    //         let card = cards[i][j];
    //     }
    // }
    let _state = RoomState.Invalide;
    //状态机切换
    const setState = function(state){
        if (state === _state){
            return;
        }
        switch (state) {
            case RoomState.WaittingReaty:
                break;
            case RoomState.StartGame:
                for (let i=0;i<_playerList.length;i++){
                    _playerList[i].sendGameStart();
                }
                setState(RoomState.PushCard);
                break;
            case RoomState.PushCard:
                _threeCardsList = _croupier.getThreeCard();
                for (let i = 0;i<_playerList.length;i++){
                    _playerList[i].sendPushCard(_threeCardsList[i]);
                }
                setState(RoomState.RobMaster);
                break;
            case RoomState.RobMaster:
                _robMasterPlayerList = [];
                if (_lostPlayer === undefined){
                    for (let i=_playerList.length-1;i>=0;i--){
                        _robMasterPlayerList.push(_playerList[i]);
                    }
                }
                turnPlayerRobMaster();
                break;
            case RoomState.ShouBottomCard:
                for (let i = 0;i<_playerList.length;i++){
                    _playerList[i].sendShowBottomCard(_threeCardsList[3]);
                }
                break;
            default:
                break;
        }
        _state = state;
    }
    setState(RoomState.WaittingReaty);
    //玩家加入
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
                roomMangerID:_roomManager.accountID
            });
        }
    };
    that.playerRobStateMaster = function (player,value) {
        if (value === 'robOk'){
            _master = player;
        } else if (value === 'robNoOk'){

        }
        for (let i=0;i<_playerList.length;i++){
            _playerList[i].sendPlayerRobStateMaster(player.accountID,value);
        }
        turnPlayerRobMaster();
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
    const turnPlayerRobMaster = function () {
        if (_robMasterPlayerList.length === 0){
            changeMaster();
            return;
        }
        let player = _robMasterPlayerList.pop();
        if (_robMasterPlayerList.length === 0 && _master === undefined){
                _master = player;
                changeMaster();
                return;
        }
        for (let i =0 ; i<_playerList.length;i++) {
            _playerList[i].sendPlayerCanRobMaster(player.accountID);
        }
    };
    const changeMaster = function(){
        for (let i =0 ; i<_playerList.length;i++) {
            _playerList[i].sendChangeMaster(_master);
        }
        setState(RoomState.ShouBottomCard);
    };
    // const gameStart = function(){
    //   for (let i=0;i<_playerList.length;i++){
    //       _playerList[i].sendGameStart();
    //   }
    // };
    that.playerOffline = function(player){
        for (let i=0;i<_playerList.length;i++){
            if (_playerList[i].accountID === player.accountID){
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
        // gameStart();
        setState(RoomState.StartGame);
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