
cc.Class({
    extends: cc.Component,
    properties: {
        cardsSpriteAtlas: cc.SpriteAtlas,
        valueNode:cc.Node,
        shapeNode:cc.Node,
        kingNode:cc.Node
    },

    onLoad () {
        this.node.children.active = false;
    },
    initWithData(){

    },
    showCard(card){
        const cardValue ={
            "12":1, //A
            "13":2, //2
            "1":3, //3
            "2":4,
            "3":5,
            "4":6,
            "5":7,
            "6":8,
            "7":9,
            "8":10,
            "9":11, //J
            "10":12,//Q
            "11":13//K
        };
        const cardShape ={
            "1":1,
            "2":2,
            "3":3,
            "4":4
        };
        const Kings ={
          "1":14,
            "2":15
        };
        let spriteValueKeys = "";
        let spriteShapeKeys = "";
        let spriteKingKeys = "";
        // this.node.getComponent(cc.Sprite).spriteFrame
        this.node.getComponent(cc.Sprite).spriteFrame = this.cardsSpriteAtlas.getSpriteFrame('large_card_bgx');
        if (card.shape){
            this.valueNode.active = true;
            this.shapeNode.active = true;
            if (card.shape === 1||card.shape===3){
                spriteValueKeys = 'LargeCard_commom_shuzi_hei_'+ cardValue[card.value];
            }else {
                spriteValueKeys = 'LargeCard_commom_shuzi_hong_'+ cardValue[card.value];
            }
            spriteShapeKeys = 'LargeCard_huase_'+ cardShape[card.shape];
            this.valueNode.getComponent(cc.Sprite).spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(spriteValueKeys);
            this.shapeNode.getComponent(cc.Sprite).spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(spriteShapeKeys);
        } else {
            this.kingNode.active = true;
            spriteKingKeys = 'LargeCard_king_' + Kings[card.king];
            this.kingNode.getComponent(cc.Sprite).spriteFrame = this.cardsSpriteAtlas.getSpriteFrame(spriteKingKeys);
        }
    }
});
