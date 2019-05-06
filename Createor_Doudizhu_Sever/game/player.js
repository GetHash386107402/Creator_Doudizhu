// const Player = function (spec) {
//     let that = {};
//     console.log('create new player' + JSON.stringify(spec));
//     return that;
// };
module.exports = function (spec,socket,cbIndex,gameController) {
    let that = {};

    let _socket = socket;
    console.log('create new player' + JSON.stringify(spec));
    let _nickName = spec.nick_name;
    let _accountID = spec.account_id;
    let _avatarUrl = spec.avatar_url;
    let _goldCount = spec.gold_count;
    let _seatIndex = 0;
    that.cards = [];
    that.isReady = false;
    let _room = undefined;
    const notify = function(type,data,callBackIndex){
      _socket.emit('notify',{
          type:type,
          data:data,
          callBackIndex:callBackIndex
      });
    };
    notify('login',{
        goldCount:_goldCount
    },cbIndex);
    _socket.on("disconnect",()=>{
        if (_room) {
            console.log("玩家掉线");
            _room.playerOffline(that);
        }
    });
    _socket.on('notify',(notifyData)=>{
        let type = notifyData.type;
        let callBackIndex = notifyData.callBackIndex;
        switch (type) {
            case 'create_room':
                gameController.createRoom(notifyData.data,that,(err,data)=>{
                    if (err){
                        console.log('err = '+ err);
                        notify('create_room',{err:err},callBackIndex);
                    }else {
                        console.log('data = ' + JSON.stringify(data));
                        notify('create_room',{data:data},callBackIndex);
                    }
                });
                break;
            case 'join_room':
                console.log('join room data = ' + JSON.stringify(notifyData.data));
                gameController.joinRoom(notifyData.data,that,(err,data)=>{
                    if (err){
                        console.log('err = '+ err);
                        notify('join_room',{err:err},callBackIndex);
                    }else {
                        _room = data.room;
                        console.log('data = ' + JSON.stringify(data));
                        notify('join_room',{data:data.data},callBackIndex);
                    }
                });
                break;
            case 'enter_room_scene':
                if (_room){
                    _room.playerEnterRoomScene(that,(data)=>{
                        _seatIndex = data.seatIndex;
                        notify('enter_room_scene',data,callBackIndex);
                    });
                }
                break;
            case 'ready':
                that.isReady = true;
                if (_room){
                    _room.playerReady(that);
                }
                break;
            case 'start_game':
                if (_room){
                    _room.roomMangerSartGame(that,(err,data)=>{
                        if (err){
                            notify("start_game",{err:err},callBackIndex);
                        }else {
                            notify("start_game",{data:data},callBackIndex);
                        }
                    });
                }
                break;
            case 'rob_state':
                if (_room){
                    _room.playerRobStateMaster(that,notifyData.data);
                }
                break;
            default:
                break;
        }
    });
    that.sendPlayerJoinRoom = function(data){
        notify("player_join_room",data,null);
    };
    that.sendPlayerReady = function(data){
        notify("player_ready",data,null);
    };
    that.sendGameStart = function(){
        notify("game_start",{},null);
    };
     that.sendChangeRoomManger = function(data){
        notify("change_room_manger",data,null);
    };
    that.sendPushCard = function(cards){
        that.cards = cards;
        notify("push_card",cards,null);
    };
    that.sendPlayerCanRobMaster = function(data){
        notify("can_rob_master",data,null);
    };
    that.sendPlayerRobStateMaster = function(accountID,value){
        notify("player_rob_state",{accountID:accountID,value:value},null);
    };
    that.sendChangeMaster = function(player){
        notify("change_master",player.accountID);
    };
    that.sendShowBottomCard = function(data){
        notify("show_bottom_card",data);
    };

    Object.defineProperty(that,'nickName',{
       get(){
           return _nickName
       }
    });
    Object.defineProperty(that,'accountID',{
        get(){
            return _accountID
        }
    });
    Object.defineProperty(that,'avatarUrl',{
        get(){
            return _avatarUrl
        }
    });
    Object.defineProperty(that,'goldCount',{
        get(){
            return _goldCount
        }
    });
    Object.defineProperty(that,'seatIndex',{
        get(){
            return _seatIndex
        },
        set(seatIndex){
            _seatIndex = seatIndex;
        }
    });

    return that;
};