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

export function getSongDetail(ids, callback){
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
        "getSongDetail": getSongDetail
    }
    map[method](data, callback);
}
