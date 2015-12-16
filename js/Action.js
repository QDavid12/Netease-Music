var store = require('./Store');
var api = require('./Api');

const methods = {
    "addToPlaylist": addToPlaylist,
    "changePlayList": changePlayList,
    "getNewRadio": getNewRadio,
    "changeToRadioMode": changeToRadioMode
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
    var oldList = store.getState().playList;
    for(var i=0;i<oldList.length;i++) newList.push(oldList[i])
    for(var i=0;i<list.length;i++) newList.push(list[i])
    console.log(newList);
    store.setState({
        playList: newList,
        start: oldList.length,
        restart: true
    });
}

function changePlayList(list){
    console.log("changePlayList");
    store.setState({
        playList: list,
        start: 0,
        restart: true
    });
}

function getNewRadio(data){
    console.log("getNewRadio");
    var oldRadio = store.getState().radio;
    api.dispatch("getNewRadio", [], function(data){
        console.log(data);
        for(var x in data.radio){
            oldRadio.push(data.radio[x]);
        }
        store.setState({radio: oldRadio});
    });
}

function changeToRadioMode(data){
    console.log("changeToRadioMode");
    store.setState({
        mode: "radio"
    });
}