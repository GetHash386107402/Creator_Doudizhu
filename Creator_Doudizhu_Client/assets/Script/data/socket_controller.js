import EventListener from './../utility/event_listener'
const SocketController = function () {
    let that = {};
    let _socket = io.connect(defines.severUrl);
    let _callBackMap = {};
    let _callBackIndex = 0;
    let _event = EventListener({});
    // _socket.on('connect',(data)=>{
    //     console.log('连接成功' + JSON.stringify(data));
    // });

    _socket.on('notify',(data)=>{
        console.log('notify data =' + JSON.stringify(data));
        let callBackIndex = data.callBackIndex;
        if (_callBackMap.hasOwnProperty(callBackIndex)){
            let cb = _callBackMap[callBackIndex];
            if (data.err){
                cb(data.err);
            }else {
                cb(null,data.data);
            }
        }else {
            let type = data.type;
            _event.fire(type,data.data);
        }
    });
    that.init = function(){

    };

    const notify = function (type,data,callBackIndex) {
      _socket.emit('notify',{type:type,data:data,callBackIndex:callBackIndex});
    };

    const request = function(type,data,cb){
        _callBackIndex ++;
        _callBackMap[_callBackIndex] = cb;
        notify(type,data,_callBackIndex);
    };

    that.requestVisitorLogin = function (data , cb) {
        request('visitor_login',data,cb);
    };

    that.requestCreateRoom = function (data,cb) {
        request('create_room',data,cb);
    };
    that.requestJoinRoom = function (data,cb) {
        request('join_room',data,cb);
    };
    that.requestEnterRoomScene = function (cb) {
        request('enter_room_scene',{},cb);
    };
    that.requestStartGame = function(cb){
        request('start_game',{},cb);
    };

    that.notifyReady = function(){
        notify("ready",{},null);
    };


    that.onPlayerJoinRoom = function (cb) {
        _event.on("player_join_room",cb);
    };
    that.onPlayerReady = function(cb){
        _event.on("player_ready",cb);
    };
    that.onGameStart = function (cb) {
        _event.on("game_start",cb);
    };
    that.onChangeRoomManger = function (cb) {
        _event.on("change_room_manger",cb);
    }
    return that;
};
export default  SocketController;