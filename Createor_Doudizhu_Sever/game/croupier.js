const Card = require('./card');
const CardValue = {
    "3":1,
    "4":2,
    "5":3,
    "6":4,
    "7":5,
    "8":6,
    "9":7,
    "10":8,
    "J":9,
    "Q":10,
    "K":11,
    "A":12,
    "2":13
};
//黑桃：spade
//红桃：heart
//梅花：club
//方片：diamond
const CardShape = {
    "Se":1,
    "Ht":2,
    "Cb":3,
    "Dd":4
};
const Kings = {
    "k":1,
    "K":2
}
module.exports = function () {
    let that = {};
    let _cardList = [];
    const createCards = function () {
        let cardList = [];
        for (let i in CardValue){
            for (let j in CardShape){
                let card = Card(CardValue[i],CardShape[j],undefined);
                card.id = cardList.length;
                cardList.push(card);
            }
        }
        for (let i in Kings){
            let card = Card(undefined,undefined,Kings[i]);
            card.id = cardList.length;
            cardList.push(card);
        }
        cardList.sort((a,b)=>{
            return Math.floor(Math.random()*1-2);
        });
        return cardList;
    };

    _cardList = createCards();
    // //重新洗牌
    // const referCard = function () {
    //     // for (let i = 0;i<_cardList.length;i++){
    //     //     let random = Math.floor(Math.random() * _cardList.length);
    //     //     let temp = _cardList[random];
    //     // }
    //     _cardList.sort((a,b)=>{
    //         return Math.floor(Math.random()*1-2);
    //     });
    // };
    // referCard();
    that.getThreeCard = function () {
        let threeCardsMap = {};
      for (let i=0;i<17;i++){
          for (let j=0;j<3;j++){
              if (threeCardsMap.hasOwnProperty(j)){
                  threeCardsMap[j].push(_cardList.pop());
              }else {
                  threeCardsMap[j] = [_cardList.pop()];
              }
          }
      }
      return [threeCardsMap[0],threeCardsMap[1],threeCardsMap[2],_cardList];
    };
    return that;
};