import React from 'react';
var api = require('../Api');
var action = require('../Action');
var alert = require('./alert').alert;

let Toolbar = React.createClass({
  control: function(e){
    var method = e.target.id;
    action.dispatch(method);
  },  
  render() {
    return(
        <div className="tool red">
            <div className="circle pink" id="close" onClick={this.control}></div>
            <div className="circle orange" id="minimize" onClick={this.control}></div>
            <div className="circle green" id="maximize" onClick={this.control}></div>
            <i className="zoom glyphicon glyphicon-credit-card"></i>
        </div>
    );
  }
});

export default Toolbar;