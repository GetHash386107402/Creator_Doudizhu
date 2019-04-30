import Global from './../Global'
cc.Class({
    extends: cc.Component,

    properties: {
        gameingUI:cc.Node,
        cardPrefab:cc.Prefab
    },

    onLoad () {
        Global.socket.onPushCard((data)=>{
            this.pushCard();
        });
    },
    pushCard(){
        for (let i=0;i<17;i++){
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.gameingUI;
            card.position = cc.p(card.width * (17-1) * -0.5 + card.width * i,0);
        }
    }
});
