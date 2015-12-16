import React from 'react';

let Radio = React.createClass({
  getInitialState: function(){
    console.log("radio init");
    console.log(this.props.radio.length);
    if(this.props.radio.length==0){
      this.props.action("getNewRadio", {});
    }
    return {

    }
  },
  componentDidUpdate: function(){
    console.log("Radio update");
    console.log(this.props.radio);
  },
  play: function(e){
    var id = parseInt(e.target.id.split("-")[1]);
    //console.log("playRadio "+id);    
    this.props.playRadio(id);
  },
  render() {
    var i=-1;
    return(
        <div className="main-content-container radio-container">
          {
            this.props.radio.map(function(song){
              i+=1;
              return (
                <div key={song.id}>
                  <span onClick={this.play} id={"radio-" + i}>{song.name}</span>
                </div>
              )
            }.bind(this))
          }
        </div>
    );
  }
});

export default Radio;