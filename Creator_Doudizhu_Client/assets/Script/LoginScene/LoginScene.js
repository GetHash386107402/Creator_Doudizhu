import Global from './../Global'

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.log("fdasffdafdsa");
        // let socket = io("http://localhost:3000");
        // socket.on('welcome',(data)=>{
        //    console.log('welcome  = '+ data);
        // });
        Global.socket.init();
        Global.eventListener.on('test',(data)=>{
            console.log('test success '+ data);
        });
        Global.eventListener.fire('test','ok');
    },

    onButtonClick(event , customData){
        switch (customData) {
            case 'visitor_login':
                console.log('a visitor login');
                Global.socket.requestVisitorLogin({
                    uniqueID: Global.playerData.uniqueID,
                    accountID: Global.playerData.accountID,
                    nickName: Global.playerData.nickName,
                    avatarUrl: Global.playerData.avatarUrl
                },(err , result)=>{
                    if (err){
                        console.log('err cbbb =' + err);
                    } else {
                        console.log('result = '+ JSON.stringify(result));
                        Global.playerData.goldCount = result.goldCount;
                        cc.director.loadScene('HallSence');
                    }

                });
                break;
            default:
                break;
        }
    }
    // update (dt) {},
});
