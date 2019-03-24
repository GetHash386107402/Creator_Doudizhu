import Global from './../Global'
cc.Class({
    extends: cc.Component,

    properties: {
        nickName:{
            default:null,
            type:cc.Label
        },
        userID:{
            default:null,
            type:cc.Label
        },
        JB_Count:{
            default:null,
            type:cc.Label
        },
        headImage:{
            default:null,
            type:cc.Sprite
        },
        createRoomPrefab:{
            default:null,
            type:cc.Prefab
        },
        joinRoomPrefab:{
            default:null,
            type:cc.Prefab
        }
    },

    onLoad(){
      this.nickName.string = Global.playerData.nickName;
      this.userID.string = Global.playerData.accountID;
      this.JB_Count.string = Global.playerData.goldCount;
      cc.loader.load({url:Global.playerData.avatarUrl,type:'jpg'},(err,tex)=> {
          let oldWidth = this.headImage.node.width;
          this.headImage.spriteFrame = new cc.SpriteFrame(tex);
          let newWidth = this.headImage.node.width;
          this.headImage.node.scale = oldWidth/newWidth;
      });
    },

    start () {

    },

   onButtonClick(event,customData){
        switch (customData) {
            case 'create_DDZ':
                let createRoomPanel = cc.instantiate(this.createRoomPrefab);
                createRoomPanel.parent = this.node;
                break;
            case 'join_room':
                let joinRoomPanel = cc.instantiate(this.joinRoomPrefab);
                joinRoomPanel.parent = this.node;
                break;
            default:
                break;
        }
   }
});
