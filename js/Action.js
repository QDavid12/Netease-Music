var store = require('./Store');
var api = require('./Api');

const methods = {
    "addAndPlay": addAndPlay,
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

var online = true;

export function toggleMode(){
    var next = store.getState("next");
    next = next+1>2?0:next+1;
    store.setState({next: next});
}

export function switchOnlineMode(status){
    api.switchOnlineMode(status);
    store.setState({online: status});
}

export function getUserState(){
    api.userSonglist(function(data){
        //console.log(data);
        store.setState({userSonglist: data});
        likelist(data[0].id);
    })
    if(online){
        getNewRadio();
    }
    store.setState({downloadedList: api.getDownloadedList()});
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

export function likelist(id){
    var lid = id||store.getState("userSonglist")[0].id;
    api.likelist(lid, function(data){
        console.log("likelist refresh");
        store.setState({likelist: data});
    })
}

//download part
setInterval(function(){
    var downloadingList = api.getDownloadingList();
    var downloadedList = api.getDownloadedList();
    console.log(downloadingList.length);
    if(downloadingList.length!=0){
        updateDownload(downloadedList, downloadingList);
    }
}, 1000);

function updateDownload(downloadedList, downloadingList){
    var downloading = {}
    for(var i in downloadingList){
        downloading[downloadingList[i].id] = downloadingList[i]
    }
    store.setState({
        downloadingList: downloading,
        downloadedList: downloadedList
    });
}

function downloadStart(downloadedList, downloadingList){
    updateDownload(downloadedList, downloadingList);
}

function downloadUpdate(downloadedList, downloadingList){
    //updateDownload(downloadedList, downloadingList);
}

function downloadEnd(downloadedList, downloadingList){
    updateDownload(downloadedList, downloadingList);
}

export function download(songs){
    if((songs instanceof Object)&&!(songs instanceof Array)) songs = [songs];
    console.log(songs[0].name);
    var queue = [];
    var downloadingList = store.getState("downloadingList");
    var downloadedList = store.getState("downloadedList");
    for(var i in songs){
        var song = songs[i];
        if(song.id in downloadingList||song.id in downloadedList) continue;
        else{
            queue.push(song);
        }
    }
    api.addToDownloadingList(queue);
}

//getUrl

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
        var num = generate(-1);
        store.setState({num: num, play: true, restart: true});
    }
}

function generate(pace){
    var num = store.getState("num");
    var playlist = store.getState("playList");
    var next = store.getState("next");
    next = next || 0;
    var res;
    switch(next){
        case 0:{
            res = num+pace;
            if(res<0) res = playlist.length-1;
            if(res>=playlist.length) res = 0;
        }
            break;
        case 1:{
            res = parseInt(Math.random()*(playlist.length));
            if(res==num) res = parseInt(Math.random()*(playlist.length));
            if(res==playlist.length) res = res-1;
        }
            break;
        case 2:{
            res = num;
        }
            break;
    }
    return res;
}

function next(){
    var radio = store.getState("radio");
    if(radio){
        var num = store.getState("radioNum");
        store.setState({radioNum: num+1, play: true, restart: true});
    }
    else{
        var num = generate(1);
        store.setState({num: num, play: true, restart: true});
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
    var data = api.init(downloadStart, downloadUpdate, downloadEnd);
    online = window.navigator.onLine;
    api.switchOnlineMode(online);
    if(data.remember){
        console.log("remember");
        console.log(data);
        store.setStore({
            isLogin: true,
            profile: data.profile,
            account: data.account,
            profileBox: false,
            playList: data.playList,
            online: window.navigator.onLine
        });
    }
    else{
        console.log("not login");
        store.setStore({
            isLogin: false,
            profileBox: false,
            online: window.navigator.onLine
        })
    }
}

export function addToPlaylist(list){
    console.log("addToPlaylist");
    var playList = store.getState("playList");
    var newList = [];
    for(var i=0;i<playList.length;i++) newList.push(playList[i]);
    for(var i=0;i<list.length;i++) newList.push(list[i]);
    store.setState({
        playList: newList,
        restart: false
    });
}

function isExist(id){
    var oldList = store.getState("playList");
    for(var x in oldList){
        if(id==oldList[x].id) return x; 
    }
    return false;
}

export function addAndPlay(song){
    console.log("addAndPlay");
    var num = store.getState("num");
    var oldList = store.getState("playList");
    //var x = isExist(song.id);
    var newList = [];
    for(var i=0;i<oldList.length;i++) {
        newList.push(oldList[i]);
        if(i==num){
            newList.push(song);
        }
    }
    num = num + 1;
    if(oldList.length==0){newList=[song];num=0;}
    store.setState({
        playList: newList,
        num: num,
        play: true,
        restart: true,
        radio: false
    });
}

export function changePlayList(list){
    console.log("changePlayList");
    store.setState({
        playList: list,
        num: 0,
        play: true,
        restart: true,
        radio: false
    });
}

export function getNewRadio(data){
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