import React from 'react';

let Toolbar = React.createClass({
  control: function(e){
    var method = e.target.id;
    this.props.action(method, "");
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