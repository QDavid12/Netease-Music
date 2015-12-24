import React from 'react';
var api = require('../Api');
var action = require('../Action');
var alert = require('./alert').alert;

let User = React.createClass({
    render: function(){
        return(
        <div className="main-content-container">
            <div>user</div>
            <div>{this.props.params.id}</div>
            <div>{this.props.query.nickname}</div>
        </div>
        )
    }
})

export default User;