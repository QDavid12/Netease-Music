// api.js
var request = require('superagent');
var async = require('async');
var crypto = require('./Crypto');

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

var httpRequest = function (method, url, data, callback) {
    var ret;
    if (method == 'post') {
        ret = request.post(url).send(data);
    } else {
        ret = request.get(url).query(data);
    }
    //var cookie = fm.getCookie();
    var cookie = 0;
    if (cookie)ret.set('Cookie', cookie);
    ret.set(header).timeout(10000).end(callback);
}

module.exports = {
    login: function (username, password, callback) {
        var url, pattern = /^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/,
            body = {
                password: crypto.MD5(password),
                rememberLogin: 'true'
            };
        if (pattern.test(username)) {
            //phone
            body.phone = username;
            url = 'http://music.163.com/weapi/login/cellphone/';
        } else {
            //email
            body.username = username;
            url = 'http://music.163.com/weapi/login/';
        }

        var encBody = crypto.aesRsaEncrypt(JSON.stringify(body));
        httpRequest('post', url, encBody, function (err, res) {
            if (err) {
                callback({msg: '[login]http error ' + err, type: 1});
                return;
            }
            var data = JSON.parse(res.text);
            if (data.code != 200) {
                //error
                callback({msg: "[login]username or password incorrect", type: 0});
            } else {
                //fm.setCookie(res.header['set-cookie']);
                callback(data);
            }
        });
    },
    getNet: function (callback) {
        var that = this;
        this.userPlaylist(function (err, playlists) {
            if (err) {
                callback(err);
                return;
            }
            async.map(playlists, function (item, callback) {
                that.playlistDetail(item.id, function (err, songList) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    /*var pltm = new PltM({
                        name: item.name,
                        type: 'net',
                        songList: songList
                    });*/
                    callback(songList);
                });
            }, function (err, results) {
                if (err) {
                    callback(err);
                } else
                    callback(null, results);
            });
        })
    },
    userPlaylist: function () {
        // [uid],[offset],[limit],callback
        var argv = [].slice.call(arguments);
        var callback = argv.pop();
        /*var uid = fm.getUserID();*/
        /*if (!uid) {
            callback({msg: '[userPlaylist]user do not login', type: 0});
            return;
        }*/
        var uid = argv[0] || uid;

        var offset = argv[1] || 0;
        var limit = argv[2] || 100;
        var url = 'http://music.163.com/api/user/playlist/';
        var data = {
            "offset": offset,
            "limit": limit,
            "uid": "160281"//to be modified
        }
        httpRequest('get', url, data, function (err, res) {
            if (err) {
                callback({msg: '[userPlaylist]http timeout', type: 1});
                return;
            }
            if (res.body.code != 200)callback({msg: '[userPlaylist]http code ' + data.code, type: 1});
            else {
                callback(res.body.playlist);
            }
        });
    },
    playlistDetail: function (id, callback) {
        var url = 'http://music.163.com/api/playlist/detail';
        var data = {"id": id}
        var that = this;
        httpRequest('get', url, data, function (err, res) {
            if (err)callback({msg: '[playlistDetail]http timeout', type: 1});
            else {
                if (res.body.code != 200)callback({msg: '[playlistDetail]http code ' + data.code, type: 1});
                else callback(null, that.transfer(res.body.result.tracks));
            }
        });
    },
    transfer: function (results) {
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
            songList.push(new SongM(o));//modefy here!
        }
        var that = this;
        process.nextTick(function () {
            // >100时分批查询
            var num = Math.ceil(idArray.length / 100);
            for (var k = 0; k < num; k++) {
                var idTmp = idArray.slice(k * 100, Math.min((k + 1) * 100, idArray.length));
                that.songsDetail(idTmp, function (err, songs) {
                    if (err) {
                        throw(err.msg);
                        return;
                    }
                    for (var i = 0; i < songs.length; i++) {
                        var index = idMap[songs[i].id];
                        songList[index].src = songs[i].mp3Url;
                        songList[index].pic = songs[i].album.picUrl;
                    }
                });
            }
        });
        return songList;
    }
}