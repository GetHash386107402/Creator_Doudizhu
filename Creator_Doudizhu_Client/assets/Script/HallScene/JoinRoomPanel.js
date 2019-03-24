import Global from './../Global'
cc.Class({
    extends:cc.Component,
    properties:{
        roomIDLabel:{
            default:null,
            type:cc.Node
        }
    },
    onLoad(){
      this.LabelList = this.roomIDLabel.children;
      this.roomIDstr = '';
    },
    onButtonClick(event,customData){

        if (1 === customData.length) {
            this.roomIDstr += customData;
            if (this.roomIDstr.length === 6) {
                Global.socket.requestJoinRoom(this.roomIDstr,(err,data)=>{
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
            if (this.roomIDstr.length > 6) {
                this.roomIDstr = this.roomIDstr.substring(0, this.roomIDstr.length - 1);
            }
        }
        switch (customData) {
            case 'close':
                this.node.destroy();
                break;
            case 'clear':
                this.roomIDstr = '';
                break;
            case 'back':
                this.roomIDstr = this.roomIDstr.substring(0,this.roomIDstr.length-1);
                break;
            default:
                break;
        }
    },
    update(){
        for (let i = 0;i < this.LabelList.length;i++){
            this.LabelList[i].getComponent(cc.Label).string = '';
        }
        for (let i = 0;i < this.roomIDstr.length;i++){
            this.LabelList[i].getComponent(cc.Label).string = this.roomIDstr[i];
        }
    }
});