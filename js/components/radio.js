import React from 'react';

let Radio = React.createClass({
  getInitialState: function(){
    console.log("radio init");
    console.log(this.props.radioList.length);
    if(this.props.radioList.length==0){
      this.props.action("getNewRadio", {});
    }
    return {

    }
  },
  componentDidUpdate: function(){
    console.log("Radio update");
    console.log(this.props.radioList);
  },
  play: function(e){
    var id = parseInt(e.target.id.split("-")[1]);
    //console.log("playRadio "+id);
    this.props.action('playRadio', id);
  },
  render() {
    var i=-1;
    var buttonClass = "playButton glyphicon glyphicon-"+(this.props.play&&this.props.radio?"pause":"play");
    var thisSong = this.props.radioList[this.props.radioNum];
    console.log(thisSong);
    return(
        <div className="main-content-container radio-container">
          <div className="top">
            {
              this.props.radioList.map(function(song){
                i+=1;
                var button = (i==this.props.radioNum)?<i className={buttonClass} onClick={this.play} id={"radio-" + i}></i>:"";
                return (
                  <div key={song.id} className={(i==this.props.radioNum)?"radioCover active":"radioCover"}>
                    <img src={song.album.picUrl} />
                    {button}
                  </div>
                )
              }.bind(this))
            }
            <div className="info-container">
              <div className="name overflow">{thisSong.name}</div>
              <div className="album overflow">{thisSong.album.name}</div>
              <div className="artists overflow">{thisSong.artists[0].name}</div>
            </div>
          </div>
        </div>
    );
  }
});

export default Radio;