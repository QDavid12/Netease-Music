import React from 'react';

let Index = React.createClass({
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
            <div className="title">主页</div>
        </div>
    );
  }
});

export default Index;
