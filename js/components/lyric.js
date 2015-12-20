import React from 'react';
import $ from 'jquery';

let Lyric = React.createClass({
  getInitialState: function(){
    //console.log("song init");
    this.lyric = undefined;
    this.active = "";
    return{}
  },
  componentWillReceiveProps: function(nextProps){
    //console.log("lyric receive new props");
    //console.log(nextProps.song.id + " " + this.props.song.id);
    if(nextProps.lyric==this.props.lyric&&this.lyric!=undefined){
      //lyric not change
      return;
    }
    if(nextProps.lyric!=undefined){
      if(nextProps.lyric.lyric!=undefined){
        //update lyric
        $(this.refs.container).animate({scrollTop: 0}, 800);
        this.lyric = this.transfer(nextProps.lyric.lyric);
      }
      else{
        this.lyric = false;
      }
    }
  },
  componentDidUpdate: function(){
    //console.log("lyric update");
    if(this.lyric!=undefined&&this.lyric!=false){
      //console.log(this.props.time in this.lyric);
      if(this.props.time in this.lyric){
        this.active = this.props.time;
        console.log(this.refs[this.props.time].offsetTop);
        //this.refs.container.scrollTop = 120+this.refs[this.props.time].offsetTop;
        var top = -120+this.refs[this.props.time].offsetTop;
        $(this.refs.container).animate({scrollTop: top}, 300);
      }
    }
  },
  transfer: function(str){
    var array = str.split("[");
    var res = {};
    var ins;
    for(var x=1;x<array.length;x++){
      ins = array[x].split("]");
      res[ins[0].split(".")[0]] = ins[1];
    }
    return res;
  },
  renderLyric: function(){
    var a = [];
    for(var x in this.lyric){
      var className=(x==this.active?"active":"");
      a.push(
        <div key={x} className={className} ref={x}>{this.lyric[x]}</div>
      );
    }
    return a;
  },
  render() {
    var song = this.props.song;
    //console.log("lyric render");
    //console.log(this.props.lyric);
    var lyric;
    if(this.lyric==undefined){
      lyric = <div className="middle">loading...</div>
    }
    else if(this.lyric==false){
      lyric = <div className="middle">纯音乐QAQ</div>
    }
    else{
      lyric = this.renderLyric()
    }
    return(
        <div className="lyric-container">
          <div className="info">
            <div className="name overflow">{song.name}</div>
            <div className="album overflow">专辑：{song.album.name}</div>
            <div className="artists overflow">歌手：{song.artists[0].name}</div>
          </div>
          <div className="lyric" ref="container">
            <div className="lyric-scroll" ref="scroll">
              {lyric}
            </div>
          </div>
        </div>
    );
  }
});

export default Lyric;