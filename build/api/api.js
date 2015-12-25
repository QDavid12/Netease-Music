var crypto = require('./Crypto');

module.exports = {
    encode: function(username, password, callback){
        console.log(username);
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
        var res = {
            body: encBody,
            url: url
        };
        callback(res);
    }
}