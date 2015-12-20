var ipcRenderer = require('electron').ipcRenderer;
var request = require('superagent');
var fs = require('fs');

var header = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip,deflate,sdch',
    'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'music.163.com',
    'Referer': 'http://music.163.com/',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:39.0) Gecko/20100101 Firefox/39.0'
}

var config = {};
const path = {
    config: "./cache/config"
}

try{
    config = JSON.parse(fs.readFileSync(path.config));
}
catch(e){
    console.log("config not found");
}

var httpRequest = function (method, url, data, callback) {
    var req;
    if (method == 'post') {
        req = request.post(url).send(data);
    } else {
        req = request.get(url).query(data);
    }
    if (config.cookie) {req.set('Cookie', config.cookie);}
    req.set(header).timeout(10000).end(callback);
}

export function getNewRadio(data, callback) {
    var url = 'http://music.163.com/api/radio/get';
    httpRequest('get', url, null, function (err, res) {
        if (err) {
            callback({msg: '[radio]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200)callback({msg: '[radio]http code ' + doc.code, type: 1});
        else callback({radio: doc.data});
    });
}

export function userSonglist(data, callback) {
    // [uid],[offset],[limit],callback
    var uid = config.profile.userId;
    if (!uid) {
        callback({msg: '[userPlaylist]user do not login', type: 0});
        return;
    }

    var offset = 0;
    var limit = 500;
    var url = 'http://music.163.com/api/user/playlist/';
    var data = {
        "offset": offset,
        "limit": limit,
        "uid": uid
    }
    httpRequest('get', url, data, function (err, res) {
        if (err) {
            callback({msg: '[userPlaylist]http timeout', type: 1});
            return;
        }
        if (res.body.code != 200)callback({msg: '[userPlaylist]http code ' + data.code, type: 1});
        else {
            res.body.playlist[0].isFirst = true;
            callback({userSonglist: res.body.playlist});
        }
    });
}

export function songlistDetail(id, callback) {
    var url = 'http://music.163.com/api/playlist/detail';
    var data = {"id": id}
    //var that = this;
    httpRequest('get', url, data, function (err, res) {
        if (err)callback({msg: '[playlistDetail]http timeout', type: 1});
        else {
            if (res.body.code != 200)callback({msg: '[playlistDetail]http code ' + data.code, type: 1});
            else callback({currentSonglist: res.body.result, mode: "playList"});
            //else callback(transfer(res.body.result.tracks));
        }
    });
}

function transfer(results) {
    var songList = [];
    var idArray = [];
    var idMap = {};
    for (var i = 0; i < results.length; i++) {
        var r = results[i];
        idArray.push(r.id);
        idMap[r.id] = i;
        var o = {src: ''};
        o.id = r.id;
        o.title = r.name;
        o.album = r.album.name;
        o.artist = r.artists.map(function (v) {
            return v.name;
        }).join();
        songList.push(o);//modefy here!
    }
    var that = this;
    process.nextTick(function () {
        // >100时分批查询
        var num = Math.ceil(idArray.length / 100);
        for (var k = 0; k < num; k++) {
            var idTmp = idArray.slice(k * 100, Math.min((k + 1) * 100, idArray.length));
            songsDetail(idTmp, function (err, songs) {
                if (err) {
                    throw(err.msg);
                    return;
                }
                for (var i = 0; i < songs.length; i++) {
                    var index = idMap[songs[i].id];
                    songList[index].src = songs[i].mp3Url;
                    songList[index].album = songs[i].album;
                }
            });
        }
    });
    return songList;
}

function songsDetail(ids, callback) {
    var url = 'http://music.163.com/api/song/detail';
    httpRequest('get', url, {ids: '[' + ids.join() + ']'}, function (err, res) {
        if (err) {
            callback({msg: '[songsDetail]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200)callback({msg: '[songsDetail]http code ' + doc.code, type: 1});
        else callback(null, doc.songs);
    });
}

function getSongDetail(ids, callback){
    var url = 'http://music.163.com/api/song/detail';
    httpRequest('get', url, {ids: '[' + ids.join() + ']'}, function (err, res) {
        if (err) {
            callback({msg: '[songsDetail]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200)callback({msg: '[songsDetail]http code ' + doc.code, type: 1});
        else callback(doc.songs);
    });
}

function getLyric(id, callback){
    var url = 'http://music.163.com/api/song/media';
    httpRequest('get', url, {id: id}, function (err, res) {
        if (err) {
            callback({msg: '[songLyric]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200)callback({msg: '[songLyric]http code ' + doc.code, type: 1});
        else callback({lyric: doc});
    });
}

function getFMLyric(id, callback){
    var url = 'http://music.163.com/api/song/media';
    httpRequest('get', url, {id: id}, function (err, res) {
        if (err) {
            callback({msg: '[songLyric]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200)callback({msg: '[songLyric]http code ' + doc.code, type: 1});
        else callback({FMlyric: doc});
    });
}

export function getComments(data, callback) {
    if(!data.rid){return callback({msg: "params error"});}
    var url = 'http://music.163.com/weapi/v1/resource/comments/'+data.rid;
    var body = ipcRenderer.sendSync('encrypt', {"rid": data.rid, "offset": data.offset||0});
    httpRequest('post', url, body, function (err, res) {
        if (err) {
            callback({msg: '[comments]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200)callback({msg: '[comments]http code ' + doc.code, type: 1});
        else callback({comments: doc});
    });
}

export function getFMComments(data, callback) {
    if(!data.rid){return callback({msg: "params error"});}
    var url = 'http://music.163.com/weapi/v1/resource/comments/'+data.rid;
    var body = ipcRenderer.sendSync('encrypt', {"rid": data.rid, "offset": data.offset||0});
    httpRequest('post', url, body, function (err, res) {
        if (err) {
            callback({msg: '[comments]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200)callback({msg: '[comments]http code ' + doc.code, type: 1});
        else callback({FMcomments: doc});
    });
}

export function login(username, password, callback){
    //console.log(username);
    var body = ipcRenderer.sendSync('encode', username, password);
    httpRequest("post", body.url, body.body, function(err, res){
        config["cookie"] = res.header['set-cookie'];
        config["profile"] = res.body.profile;
        config["account"] = res.body.account;
        config["remember"] = true;
        console.log(res.header['set-cookie']);
        fs.writeFile(path.config, JSON.stringify(config, null, 4), {flag: "w+"}, function(err) {
            console.log(err);
        });
        callback(res.body);
    });
}

export function init(){
    var res;
    if(config.remember){
        res = {
            remember: true,
            profile: config.profile,
            account: config.account,
            playList: config.playList
        }
        console.log("api init");
        console.log(res);
    }
    else{
        res = {
            remember: false
        }
    }
    return res;
}

export function dispatch(method, data, callback){
    const map = {
        "getSongDetail": getSongDetail,
        "userSonglist": userSonglist,
        "songlistDetail": songlistDetail,
        "getNewRadio": getNewRadio,
        "maximize": maximize,
        "close": close,
        "minimize": minimize,
        "getLyric": getLyric,
        "getFMLyric": getFMLyric,
        "getComments": getComments,
        "getFMComments": getFMComments,
        "radioLike": radioLike,
        "radioTrash": radioTrash,
    }
    map[method](data, callback);
}

function radioLike(){

}

function radioTrash(){
    
}

function maximize(data, callback){
    callback(ipcRenderer.sendSync('maximize'));
}

function minimize(data, callback){
    callback(ipcRenderer.sendSync('minimize'));
}

function close(data, callback){
    callback(ipcRenderer.sendSync('close'));
}
