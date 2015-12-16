var store = require('./Store');
var api = require('./Api');

const methods = {
    "addToPlaylist": addToPlaylist,
    "changePlayList": changePlayList,
    "changeNum": changeNum,
    "play": play,
    "pause": pause,
    "last": last,
    "next": next,
    "didRestart": didRestart,
    "getNewRadio": getNewRadio,
    "playRadio": playRadio
}

function playRadio(id){
    store.setState({
        radioNum: id, 
        play: true, 
        restart: true,
        radio: true
    });
}

function changeNum(num){
    store.setState({
        num: num,
        play: true,
        restart: true,
        radio: false
    })
}

function play(){
    store.setState({play: true});
}

function pause(){
    store.setState({play: false});
}

function last(){
    var radio = store.getState("radio");
    if(radio){
        var num = store.getState("radioNum");
        store.setState({radioNum: num-1, play: true, restart: true});
    }
    else{
        var num = store.getState("num");
        store.setState({num: num-1, play: true, restart: true});
    }
}

function next(){
    var radio = store.getState("radio");
    if(radio){
        var num = store.getState("radioNum");
        store.setState({radioNum: num+1, play: true, restart: true});
    }
    else{
        var num = store.getState("num");
        store.setState({num: num+1, play: true, restart: true});
    }
}

function didRestart(){
    store.setState({restart: false});
}

export function dispatch(method, data){
    if(method in methods){
        methods[method](data);
    }
    else{
        api.dispatch(method, data, function(data){
            console.log(method);
            console.log(data);
            store.setState(data);
        });
    }
}

export function login(username, password){
    api.login(username, password, function(data){
        console.log("login success");
        console.log(data);
        store.setState({
            isLogin: true,
            profile: data.profile,
            account: data.account,
            profileBox: false
        });
    });
}

export function init(){
    var data = api.init();
    if(data.remember){
        console.log("remember");
        console.log(data);
        store.setStore({
            isLogin: true,
            profile: data.profile,
            account: data.account,
            profileBox: false,
            playList: data.playList
        });
    }
    else{
        console.log("not login");
        store.setStore({
            isLogin: false,
            profileBox: false
        })
    }
}


function addToPlaylist(list){
    console.log("addToPlaylist");
    var newList = [];
    var oldList = store.getState("playList");
    for(var i=0;i<oldList.length;i++) newList.push(oldList[i]);
    for(var i=0;i<list.length;i++) newList.push(list[i]);
    console.log(newList);
    store.setState({
        playList: newList,
        num: oldList.length,
        play: true,
        restart: true,
        radio: false
    });
}

function changePlayList(list){
    console.log("changePlayList");
    store.setState({
        playList: list,
        num: 0,
        play: true,
        restart: true,
        radio: false
    });
}

function getNewRadio(data){
    console.log("getNewRadio");
    var oldRadio = store.getState("radioList");
    api.dispatch("getNewRadio", [], function(data){
        console.log(data);
        for(var x in data.radio){
            oldRadio.push(data.radio[x]);
        }
        store.setState({radioList: oldRadio});
    });
}