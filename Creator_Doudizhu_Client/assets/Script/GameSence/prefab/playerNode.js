 import Global from "../../Global";

cc.Class({
    extends: cc.Component,

    properties: {
        headImage:{
            default:null,
            type:cc.Sprite
        },
        idLabel:{
            default:null,
            type:cc.Label
        },
        nickNameLabel:{
            default:null,
            type:cc.Label
        },
        goldLabel:{
            default:null,
            type:cc.Label
        },
        readyIcon:{
            default:null,
            type:cc.Node
        },
        offLineIcon:{
            default:null,
            type:cc.Node
        },
        cardsNode:{
            default:null,
            type:cc.Node
        },
        cardPrefab:{
            default:null,
            type:cc.Prefab
        },
        tipsLabel:{
            default:null,
            type:cc.Label
        },
        infoStateNode:{
            default:null,
            type:cc.Node
        },
        timeLabel:{
            default:null,
            type:cc.Label
        },
        robIconSp:{
            default:null,
            type:cc.Sprite
        },
        robIcon:{
            default:null,
            type:cc.SpriteFrame
        },
        noRobIcon:{
            default:null,
            type:cc.SpriteFrame
        },
        masterIcon:{
            default:null,
            type:cc.Node
        },
        noRobIconLabel:{
            default:null,
            type:cc.Label
        },

    },

    onLoad () {
        this.cardList = [];
        this.readyIcon.active = false;
        this.offLineIcon.active = false;
        this.node.on("game_starting",()=>{
            this.readyIcon.active = false;
        });
        this.node.on("push_card",()=>{
            if (this.accountID !== Global.playerData.accountID){
                this.pushCard();
            }
        });
        this.node.on("can_rob_master",(event)=>{
            let detail = event.detail;
            if (detail === this.accountID && detail !== Global.playerData.accountID){
                this.infoStateNode.active = true;
                this.tipsLabel.string = "正在抢地主";
                this.timeLabel.string = "5";
            }
        });
        this.node.on("rob_state",(event)=>{
            let detail = event.detail;
            if (detail.accountID === this.accountID){
                this.infoStateNode.active = false;
                switch (detail.value) {
                    case "robOk":
                        this.robIconSp.node.active = true;
                        // this.noRobIconLabel.sting = "抢了";
                        this.robIconSp.spriteFrame = this.robIcon;
                        break;
                    case "robNoOk":
                        this.robIconSp.node.active = true;
                        // this.noRobIconLabel.sting = "B抢了";
                        this.robIconSp.spriteFrame = this.noRobIcon;
                        break;
                    default:
                        break;
                }
            }
        });
        this.node.on("change_master",(event)=>{
            let detail = event.detail;
            this.robIconSp.node.active = false;
            if (detail === this.accountID){
                this.masterIcon.active = true;
                this.masterIcon.scale = 0.6;
                this.masterIcon.runAction(cc.scaleTo(0.3,1).easing(cc.easeBackOut()));
            }
        });
    },
    initWithData(data,seatIndex){
        this.accountID = data.accountID;
        this.idLabel.string = data.accountID;
        this.nickNameLabel.string = data.nickName;
        this.goldLabel.string = data.goldCount;
        this.seatIndex = seatIndex;
        cc.loader.load({url:data.avatarUrl,type:'jpg'},(err,tex)=> {
            let oldWidth = this.headImage.node.width;
            this.headImage.spriteFrame = new cc.SpriteFrame(tex);
            let newWidth = this.headImage.node.width;
            this.headImage.node.scale = oldWidth/newWidth;
        });
        this.node.on("player_ready",(event)=>{
            let detail = event.detail;
            if (detail === this.accountID){
                this.readyIcon.active = true;
            }
        });
        if (this.seatIndex === 1){
            this.cardsNode.x *=-1;
        }
    },
    pushCard(){
        this.cardsNode.active = true;
        for (let i=0;i<17;i++){
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.cardsNode
            let height = card.height;
            card.scale = 0.3;
            card.y = (17-1)* 0.5 * height * 0.3 *0.4 - height * 0.3 *0.4 * i;
            this.cardList.push(card);
        }
    }

    // update (dt) {},
});
