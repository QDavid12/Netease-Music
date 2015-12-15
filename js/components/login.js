import React from 'react';

let Login = React.createClass({
  getInitialState: function() {
    return {

    };
  },
  submit: function(){
    var user = this.refs.user.value;
    var pass = this.refs.pass.value;
    this.props.login(user, pass);
  },
  render: function(){
    return(
      <div className="login-container">
        <div className="title">欢迎登陆</div>
        <input type="text" placeholder="用户名/邮箱/手机" defaultValue={this.state.user} ref="user" />
        <input type="password" placeholder="密码" defaultValue={this.state.pass} ref="pass" />
        <button onClick={this.submit}>登   陆</button>
      </div>
    );
  }
});

export default Login;
