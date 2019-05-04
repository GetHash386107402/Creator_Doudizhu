import Global from './../Global'
cc.Class({
    extends: cc.Component,

    properties: {
        gameingUI:cc.Node,
        cardPrefab:cc.Prefab
    },

    onLoad () {
        Global.socket.onPushCard((data)=>{
            this.pushCard(data);
        });
    },
    pushCard(data){
        data.sort(function (a,b) {
           if (a.hasOwnProperty('value')&&b.hasOwnProperty('value')){
               return b.value - a.value;
           }
           if (a.hasOwnProperty('king')&& !b.hasOwnProperty('king')){
               return -1;
           }
           if (!a.hasOwnProperty('king')&& b.hasOwnProperty('king')) {
                return 1;
           }
           if (a.hasOwnProperty('king')&& b.hasOwnProperty('king')){
               return b.king - a.king;
           }
        });
        for (let i=0;i<data.length;i++){
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.gameingUI;
            card.scale = 0.8;
            card.x = card.width * 0.4 * (17-1) * - 0.5 + card.width * 0.4 * i;
            card.y = -250;
            card.getComponent('card').showCard(data[i]);
        }
    }
});
