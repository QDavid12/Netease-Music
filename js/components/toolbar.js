import React from 'react';

let Toolbar = React.createClass({

  render() {
    return(
        <div className="tool red">
            <div className="circle pink"></div>
            <div className="circle orange"></div>
            <div className="circle green"></div>
            <i className="zoom glyphicon glyphicon-credit-card"></i>
        </div>
    );
  }
});

export default Toolbar;