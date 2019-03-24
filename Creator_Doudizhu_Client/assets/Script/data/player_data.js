const getRandomStr =function (count) {
    let str = '';
    for (let i = 0; i < count ; i++){
        str += Math.floor(Math.random()*10);
    }
    return str;
};
const PlayerData =function () {
    let that = {};
    // {
    //     uniqueID: '20000',
    //     accountID: '1000',
    //     nickName: '小米各部门',
    //     avatarUrl: 'http://p2.so.qhimgs1.com/bdr/_240_/t0171aeaef278a6317e.jpg'
    // }
    that.uniqueID = '1' + getRandomStr(6);
    that.accountID = '2' + getRandomStr(6);
    that.nickName = '小罗'+ getRandomStr(2);
    that.avatarUrl = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3251029328,2490819195&fm=27&gp=0.jpg';
    that.goldCount = 0;
    return that;
};
export  default PlayerData;