var ipcRenderer = require('electron').ipcRenderer;
var request = require('superagent');

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

module.exports = {
    login: function(data, callback){
        var body = ipcRenderer.sendSync('login', data);
        var req = request.post(body.url).send(body.body);
        req.set(header).timeout(10000).end(function(err, resp){
            callback(resp.body);
        });
    }
}
