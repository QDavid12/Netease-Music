import React from 'react';
import Lyric from './lyric.js';
import Comment from './comment.js';
import ChooseList from './chooseList.js';

let Song = React.createClass({
  getInitialState: function(){
    console.log("Song init");
    this.props.action("getLyric", this.props.song.id);
    this.props.action("getComments", {"rid": "R_SO_4_"+this.props.song.id});
    return {
      song: this.props.song
    }
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.song.id!=this.state.song.id){
      console.log("new song");
      this.setState({song: nextProps.song});
      this.props.action("getLyric", nextProps.song.id);
      this.props.action("getComments", {"rid": "R_SO_4_"+nextProps.song.id});
    }
  },
  returnValue: function(res){
    this.props.returnValue(res);
  },
  download: function(){
    alert("download not work now");
  },
  share: function(){
    alert("share not work now");
  },
  render() {
    //console.log("Song render");
    //console.log(this.props.song);
    var chooseList = "";
    if(this.props.chooseList){
      chooseList = <ChooseList returnValue={this.returnValue} uid={this.props.account.id} userSonglist={this.props.userSonglist}/>
    }
    return(
        <div className="song-container">
          <div className="background blur" style={{backgroundImage: "url(http://music.163.com/api/img/blur/"+this.props.song.album.pic+")"}}></div>
          <div className="toggle" onClick={this.props.toggleSong}>
            <i className="glyphicon glyphicon-resize-small"></i>
          </div>
          <div className="content">
            <div className="top">
              <div className="song-niddle">
              </div>
              <div className="song-cover" ref="cover" style={{animationPlayState: this.props.play?"running":"paused"}}>
                <img src={this.props.song.album.picUrl}/>
              </div>
              <div className="song-lyric">
                  <Lyric lyric={this.props.lyric} song={this.props.song} play={this.props.play} time={this.props.time}/>
              </div>
              <div className="song-tools">
                <div className="item" onClick={this.props.like}><i className={"glyphicon glyphicon-heart"+(this.props.liked?"":"-empty")}></i>喜欢</div>
                <div className="item" onClick={this.props.plus}><i className="glyphicon glyphicon-plus-sign"></i>收藏</div>
                <div className="item" onClick={this.download}><i className="glyphicon glyphicon-download-alt"></i>下载</div>
                <div className="item" onClick={this.share}><i className="glyphicon glyphicon-share"></i>分享</div>
              </div>
            </div> 
            <div className="bottom">   
              <div className="song-comment">
                  <Comment comments={this.props.comments} id={"R_SO_4_"+this.props.song.id} />
              </div>
            </div>
          </div>
          {chooseList}
        </div>
    );
  }
});

export default Song;