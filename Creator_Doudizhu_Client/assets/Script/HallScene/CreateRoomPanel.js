import Global from './../Global'
cc.Class({
    extends: cc.Component,

    properties: {

    },



    start () {

    },

   onButtonClick(event,customData){
        if (customData.indexOf('rate')!== -1){
            Global.socket.requestCreateRoom({rate:customData},(err,data)=>{
                if (err){
                    console.log('create rooom = '+ err);
                }else {
                    console.log('create room = ' + JSON.stringify(data));
                    let roomID = data.data;
                    Global.socket.requestJoinRoom(roomID,(err,data)=>{
                        if (err){
                            console.log('err = '+ err);
                        } else {
                            console.log('join room data = ' + JSON.stringify(data));
                            Global.playerData.bottom = data.data.bottom;
                            Global.playerData.rate = data.data.rate;
                            cc.director.loadScene('GameSence');
                        }
                    });
                }
            });
        }
       this.node.destroy();
   }
});
