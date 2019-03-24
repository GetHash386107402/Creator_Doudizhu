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
        }
    },

    start () {

    },
    initWithData(data){
        this.idLabel.string = data.accountID;
        this.nickNameLabel.string = data.nickName;
        this.goldLabel.string = data.goldCount;
        cc.loader.load({url:data.avatarUrl,type:'jpg'},(err,tex)=> {
            let oldWidth = this.headImage.node.width;
            this.headImage.spriteFrame = new cc.SpriteFrame(tex);
            let newWidth = this.headImage.node.width;
            this.headImage.node.scale = oldWidth/newWidth;
        });
    }

    // update (dt) {},
});
