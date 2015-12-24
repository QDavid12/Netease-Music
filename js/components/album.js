import React from 'react';
var api = require('../Api');
var action = require('../Action');
var alert = require('./alert').alert;

let Album = React.createClass({
    render: function(){
        return(
        <div className="main-content-container">
            <div>album</div>
            <div>{this.props.params.id}</div>
            <div>{this.props.query.name}</div>
        </div>
        )
    }
})

export default Album;