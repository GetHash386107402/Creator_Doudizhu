import Global from './../Global'
cc.Class({
    extends: cc.Component,

    properties: {
        bottomLabel:{
            default:null,
            type:cc.Label
        },
        rateLabel:{
            default:null,
            type:cc.Label
        },
        playerNodePrefab:{
            default:null,
            type:cc.Prefab
        }
    },


    onLoad () {
        this.bottomLabel.string = '底：'+Global.playerData.bottom;
        this.rateLabel.string = '倍数：'+Global.playerData.rate;
        Global.socket.requestEnterRoomScene((err,data)=>{
            if (err){
                console.log("err = " + err );
            }else {
                console.log('enter room scene = ' + JSON.stringify(data));
                let seatIndex = data.seatIndex;
                let playerData = data.playerData;
                for (let i = 0;i<playerData.length;i++){
                    this.addPlayerNode(playerData[i]);
                }
            }
        });
    },
    addPlayerNode(data){
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        playerNode.getComponent('playerNode').initWithData(data);
    }

});
