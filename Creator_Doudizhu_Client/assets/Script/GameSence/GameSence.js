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
        Global.socket.onGameStart(()=>{
            for (let i=0;i<this.playerNodeList.length;i++){
                this.playerNodeList[i].emit("game_starting");
            }
        });
        Global.socket.onPushCard(()=>{
            for (let i=0;i<this.playerNodeList.length;i++){
                this.playerNodeList[i].emit("push_card");
            }
        });
        Global.socket.onCanRobMaster((data)=>{
            for (let i = 0 ; i<this.playerNodeList.length ; i++){
                this.playerNodeList[i].emit("can_rob_master",data);
            }
        });
        Global.socket.onPlayerRobState ((data)=>{
            for (let i = 0 ; i<this.playerNodeList.length ; i++){
                this.playerNodeList[i].emit("rob_state",data);
            }
        });
        Global.socket.onChangeMaster((data)=>{
            for (let i = 0 ; i<this.playerNodeList.length ; i++){
                this.playerNodeList[i].emit("change_master",data);
            }
        });
    },
    initPlayerPos(seatIndex){
        let children = this.playerPosNode.children;
        switch (seatIndex) {
            case 0:
                this.playerPosList[0] = 0;
                this.playerPosList[1] = 1;
                this.playerPosList[2] = 2;
                break;
            case 1:
                this.playerPosList[1] = 0;
                this.playerPosList[2] = 1;
                this.playerPosList[0] = 2;
                break;
            case 2:
                this.playerPosList[2] = 0;
                this.playerPosList[0] = 1;
                this.playerPosList[1] = 2;
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
        playerNode.getComponent('playerNode').initWithData(data,this.playerPosList[data.seatIndex]);
        playerNode.position = this.playerPosNode.children[this.playerPosList[data.seatIndex]].position;
        this.playerNodeList.push(playerNode);
    }

});
