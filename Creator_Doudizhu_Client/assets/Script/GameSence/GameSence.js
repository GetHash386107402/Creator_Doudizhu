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
        roomIDLabel:{
            default:null,
            type:cc.Label
        },
        playerNodePrefab:{
            default:null,
            type:cc.Prefab
        },
        playerPosNode:{
            default:null,
            type:cc.Node
        }
    },


    onLoad () {
        this.playerNodeList = [];
        this.bottomLabel.string = '底：'+Global.playerData.bottom;
        this.rateLabel.string = '倍数：'+Global.playerData.rate;
        Global.socket.requestEnterRoomScene((err,data)=>{
            if (err){
                console.log("err = " + err );
            }else {
                console.log('enter room scene = ' + JSON.stringify(data));
                let seatIndex = data.seatIndex;
                this.playerPosList = [];
                let playerData = data.playerData;
                this.initPlayerPos(seatIndex);
                let roomID = data.roomID;
                this.roomIDLabel.string = '房间号：'+ roomID;
                Global.playerData.roomMangerID = data.roomMangerID;
                for (let i = 0;i<playerData.length;i++){
                    this.addPlayerNode(playerData[i]);
                }
            }
            this.node.emit("init");
        });
        Global.socket.onPlayerJoinRoom((data)=>{
            this.addPlayerNode(data);
        });
        Global.socket.onPlayerReady((data)=>{
            for (let i=0;i<this.playerNodeList.length;i++){
                this.playerNodeList[i].emit("player_ready",data);
            }
        });
    },
    initPlayerPos(seatIndex){
        let children = this.playerPosNode.children;
        switch (seatIndex) {
            case 0:
                this.playerPosList[0] = children[0].position;
                this.playerPosList[1] = children[1].position;
                this.playerPosList[2] = children[2].position;
                break;
            case 1:
                this.playerPosList[1] = children[0].position;
                this.playerPosList[2] = children[1].position;
                this.playerPosList[0] = children[2].position;
                break;
            case 2:
                this.playerPosList[2] = children[0].position;
                this.playerPosList[0] = children[1].position;
                this.playerPosList[1] = children[2].position;
                break;
            default:
                break;
        }
        // for (let i = 0;i<children.length;i++){
        //     let posIndex = (i+seatIndex)%3;
        //     this.playerPosList[posIndex] = children[i].position;
        // }
    },
    addPlayerNode(data){
        let playerNode = cc.instantiate(this.playerNodePrefab);
        playerNode.parent = this.node;
        playerNode.getComponent('playerNode').initWithData(data);
        playerNode.position = this.playerPosList[data.seatIndex];
        this.playerNodeList.push(playerNode);
    }

});
