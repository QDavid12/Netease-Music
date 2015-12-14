var store = require('./Store');
var api = require('./Api');

export function login(username, password){
    api.login(username, password, function(data){
        console.log("login success");
        store.setState({
            isLogin: true,
            profile: data.profile,
            bindings: data.bindings,
            account: data.account,
            profileBox: false
        });
    });
}
