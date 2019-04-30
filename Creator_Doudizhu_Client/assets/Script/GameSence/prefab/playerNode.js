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
        }
    },

    onLoad () {
        this.readyIcon.active = false;
        this.offLineIcon.active = false;
        this.node.on("game_starting",()=>{
            this.readyIcon.active = false;
        })

    },
    initWithData(data){
        this.accountID = data.accountID;
        this.idLabel.string = data.accountID;
        this.nickNameLabel.string = data.nickName;
        this.goldLabel.string = data.goldCount;
        cc.loader.load({url:data.avatarUrl,type:'jpg'},(err,tex)=> {
            let oldWidth = this.headImage.node.width;
            this.headImage.spriteFrame = new cc.SpriteFrame(tex);
            let newWidth = this.headImage.node.width;
            this.headImage.node.scale = oldWidth/newWidth;
        });
        this.node.on("player_ready",(event)=>{
            let detail = event.detail;
            if (detail === this.accountID){
                this.readyIcon.node.active = true;

            }
        });
    }

    // update (dt) {},
});
