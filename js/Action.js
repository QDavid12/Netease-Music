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

export function getUserState(){
    api.userSonglist(function(data){
        store.setState({userSonglist: data});
        likelist();
    })
    getNewRadio();
    store.setState({downloadedList: api.getDonwnloadedList()});
}

export function songlistFunc(data, callback){
    api.songlistFunc(data, function(res){
        likelist();
        callback(res);
    })
}

export function like(data, callback){
    api.like(data, function(res){
        likelist();
        if(callback) callback(res);
    })
}

export function likelist(){
    var lid = store.getState("userSonglist")[0].id;
    api.likelist(lid, function(data){
        console.log("likelist refresh");
        store.setState({likelist: data});
    })
}

function downloadUpdate(id, pass, total){
    console.log("song "+id+" percent: "+((pass/total)*100).toFixed(2)+"%");
}

export function download(song){
    api.download(song, downloadUpdate, function(downloadedList){
        store.setState({downloadedList: downloadedList});
    });
}

/*export function isLiked(id, callback){
    var lid = store.getState("userSonglist")[0].id;
    api.likelist(lid, function(data){
        console.log("likelist refresh");
        for(var x in data){
            if(data[x].id==id) return callback(true);
        }
        callback(false);
    })
}*/

export function getUrl(id){
    return api.getUrl(id);
}

function playRadio(id){
    var play = store.getState("play");
    var radio = store.getState("radio");
    var radioNum = store.getState("radioNum");
    if(!radio){
        return store.setState({
            radioNum: id||radioNum, 
            play: true, 
            restart: true,
            radio: true
        });
    }
    else{
        return store.setState({
            play: !play
        })
    }
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
    api.getNewRadio(function(data){
        console.log(data);
        for(var x in data.radio){
            oldRadio.push(data.radio[x]);
        }
        store.setState({radioList: oldRadio});
    });
}