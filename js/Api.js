var ipcRenderer = require('electron').ipcRenderer;
var request = require('superagent');
var requests = require('request');
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
/*    if (!fs.existsSync(path.config)) {
        fs.mkdirSync(path.config);
    }*/
}
// init some config and timer
path.music = config.music||"./music/"
var connected = true

function saveConfig(){
    var data = JSON.stringify(config);
    console.log(data.length);
/*    fs.writeFile(path.config, data, {flag: "w+"}, function(err){
        console.log("save success");
    });*/
    var pace = 1600;
    var times = parseInt(data.length/pace)+1;
    console.log(times);
    for(var i=0;i<times;i++){
        fs.writeFileSync(path.config, data.substr(pace*i, pace), {flag: i==0?"w+":"a"});
    }
    /*var fileWriteStream = fs.createWriteStream(path.config, {flag: "w+"});
    fileWriteStream.write();
    fileWriteStream.end();*/
    //ipcRenderer.sendSync('saveConfig', data, path.config);
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

export function getDonwnloadedList(){
    return config.downloadedList;
}

export function download(song, callback, endcall){
    var dir = config.music||"./music/";
    var id = song.hMusic.dfsId;
    //id = "6039617371462119";
    console.log(id);
    var url = ipcRenderer.sendSync('getUrl', id);
    console.log(url);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var filename = song.name + "-" + song.artists[0].name + ".mp3";
    //requests(url).pipe(fs.createWriteStream(filename));
    var pass = 0;
    var total = 0;
    var percent = 0;
    var writeStream = fs.createWriteStream(dir+filename);
    requests(url)
        .on('response', function(res) {
            console.log(res.statusCode) // 200
            total = parseInt(res.headers["content-length"]);
            console.log(total); 

          })
        .on('data', function(chunk){
            //console.log(chunk.length);
            pass += chunk.length;
            percent = ((pass/total)*100).toFixed(2);
            console.log(percent+"%");
            if(callback) callback(song.id, pass, total);
        })
        .on('end', function(){
            writeStream.end();
            config.downloadedList[song.id] = filename;
            console.log("config");
            console.log(config);
            saveConfig();
            if(endcall) endcall(config.downloadedList);
        })
        .pipe(writeStream);
}

export function getNewRadio(callback) {
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

export function userSonglist(callback) {
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
            //res.body.playlist[0].isFirst = true;
            if(callback) callback(res.body.playlist);
            localStorage.setItem("userSonglist", JSON.stringify(res.body.playlist))
        }
    });
}

export function likelist(id, callback) {
    var url = 'http://music.163.com/weapi/v3/playlist/detail';
    var data = {"id": id}
    data = ipcRenderer.sendSync('encrypt', data);
    httpRequest('post', url, data, function (err, res) {
        if (err)callback({msg: '[playlistDetail]http timeout', type: 1});
        else {
            var likelist = {};
            var data = JSON.parse(res.text).playlist.trackIds;
            for(var x in data){
                likelist[data[x].id] = 1;
            }
            callback(likelist);
            config.likelist = likelist;
            saveConfig();
            //else callback(transfer(res.body.result.tracks));
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

/*export function songlistDetail(id, callback) {
    var url = 'http://music.163.com/weapi/v3/playlist/detail';
    var data = {"id": id}
    data = ipcRenderer.sendSync('encrypt', data);
    httpRequest('post', url, data, function (err, res) {
        if (err)callback({msg: '[playlistDetail]http timeout', type: 1});
        else {
            callback({currentSonglist: JSON.parse(res.text).playlist, mode: "playList"});
            //else callback(transfer(res.body.result.tracks));
        }
    });
}*/


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

function getComments(data, callback) {
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

function getFMComments(data, callback) {
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

export function like(data, callback){
    var url = 'http://music.163.com/api/radio/like';
    var params = {
        like: data.like.toString()||"true",
        trackId: data.id,
        alg: data.alg||"itembased",
        time: 25
    }
    httpRequest('get', url, params, function (err, res) {
        if (err) {
            callback({msg: '[songsDetail]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code == 502) {return callback(doc);}
        if (doc.code != 200) {return callback({msg: '[like]http code ' + doc.code, type: 1});}
        else {return callback(doc);}
    });
}

export function trash(data, callback){
    var url = 'http://music.163.com/api/radio/trash/add';
    var params = {
        songId: data.id,
        alg: data.alg||"itembased",
        time: 25
    }
    httpRequest('get', url, params, function (err, res) {
        if (err) {
            callback({msg: '[trash]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200) {return callback(doc);}
        else {return callback(doc);}
    });
}

export function getTrash(data, callback){
    var url = 'http://music.163.com/api/trash/add';
    var params = {
        limit: data.limit||100,
        total: data.total||true,
        offset: data.offset||0
    }
    httpRequest('get', url, params, function (err, res) {
        if (err) {
            callback({msg: '[getTrash]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200) {return callback(doc);}
        else {return callback(doc);}
    });
}

export function songlistFunc(data, callback) {
    var url = 'http://music.163.com/weapi/playlist/manipulate/tracks';
    var data = {
        "trackIds": data.trackIds,
        "pid": data.pid,
        "op": data.op||"add"
    }
    data = ipcRenderer.sendSync('encrypt', data);
    httpRequest('post', url, data, function (err, res) {
        if (err) {
            callback({msg: '[songsDetail]http error ' + err, type: 1});
            return;
        }
        var doc = JSON.parse(res.text);
        if (doc.code != 200)callback(doc);
        else callback(doc);
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
        config["userSonglist"] = [];
        config["downloadedList"] = {};
        config["likelist"] = [];
        console.log(res.header['set-cookie']);
        saveConfig();
        /*fs.writeFile(path.config, JSON.stringify(config, null, 0), {flag: "w+"}, function(err) {
            console.log(err);
        });*/
        callback(res.body);
    });
}

export function getUrl(song){
    if(song.id in config.downloadedList){
        //console.log(config.downloadedList);
        return path.music+config.downloadedList[song.id];
    }
    return ipcRenderer.sendSync('getUrl', song.hMusic.dfsId);
}

export function getImgUrl(id){
    return ipcRenderer.sendSync('getImgUrl', id);
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
        "like": like,
        "trash": trash
    }
    map[method](data, callback);
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
