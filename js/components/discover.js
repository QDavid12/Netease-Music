import React from 'react';

let Discover = React.createClass({
  getInitialState: function() {
    return {

    };
  },
  componentDidMount: function(){
    console.log("index");
  },
  render: function(){
    return(
        <div className="main-content-container">
            <div className="title">Discover</div>
        </div>
    );
  }
});

export default Discover;
