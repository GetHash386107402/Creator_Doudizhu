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
            default:
                break;
        }
    });

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
        }
    });

    return that;
};