import Global from './../Global'
cc.Class({
    extends: cc.Component,

    properties: {
        gameingUI:cc.Node,
        cardPrefab:cc.Prefab,
        robUI:cc.Node
    },

    onLoad () {
        this.bottomCards = [];
        Global.socket.onPushCard((data)=>{
            this.pushCard(data);
        });
        Global.socket.onCanRobMaster((data)=>{
            if (data === Global.playerData.accountID){
                this.robUI.active = true;
            }
        });
        Global.socket.onShowBottomCard((data)=>{
            for (let i=0;i<data.length;i++){
                let card = this.bottomCards[i];
                card.getComponent('card').showCard(data[i]);
            }
        });
        // this.pushCard(data);
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
        for (let i=0; i<3;i++){
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.gameingUI;
            card.scale = 0.8;
            card.x = (card.width * 0.8 + 20)*(3-1)*-0.5 + (card.width * 0.8 + 20)*i;
            this.bottomCards.push(card);
        }
    },
    onButtonClick(event,customData){
        switch (customData) {
            case 'rob':
                Global.socket.notifyRobState("robOk");
                this.robUI.active = false;
                break;
            case 'no_rob':
                Global.socket.notifyRobState("robNoOk");
                this.robUI.active = false;
                break;
            default:
                break;
        }
    }
});
