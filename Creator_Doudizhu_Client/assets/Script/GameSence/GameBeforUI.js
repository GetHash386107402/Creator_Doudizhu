import Global from './../Global'
cc.Class({
    extends: cc.Component,

    properties: {
        readyButton:cc.Node,
        gameStartButton:cc.Node,
        gameBeforUI:cc.Node
    },
    onLoad () {
        this.node.on("init",()=>{
            if (Global.playerData.roomMangerID === Global.playerData.accountID){
                this.readyButton.active = false;
                this.gameStartButton.active = true;
            }else {
                this.readyButton.active = true;
                this.gameStartButton.active = false;
            }
        });
        Global.socket.onGameStart(()=>{
            this.gameBeforUI.active = false;
        });
        Global.socket.onChangeRoomManger((data)=>{
            Global.playerData.roomMangerID = data;
            if (Global.playerData.accountID === data){
                this.readyButton.active = false;
                this.gameStartButton.active = true;
            }

        });
    },
    onButtonClick(event,customData){
        switch (customData) {
            case 'ready':
                Global.socket.notifyReady();
                console.log('ready');
                break;
            case 'gameStart':
                console.log('gameStart');
                Global.socket.requestStartGame((err,data)=>{

                });
                break;
            default:
                break;
        }
    },


    // update (dt) {},
});
