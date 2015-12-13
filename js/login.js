import React from 'react';

let Login = React.createClass({
  getInitialState: function() {
    return {
      user: '18811351935',
      pass: '742693934'
    };
  },
  submit: function(){
    var user = this.refs.user.getDOMNode().value;
    var pass = this.refs.pass.getDOMNode().value;
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
