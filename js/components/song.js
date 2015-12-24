import React from 'react';
import Lyric from './lyric.js';
import Comment from './comment.js';
import ChooseList from './chooseList.js';

var alert = require('./alert').alert;
var action = require('../Action');

let Song = React.createClass({
  getInitialState: function(){
    console.log("Song init");
    this.props.action("getLyric", this.props.song.id);
    return {
      song: this.props.song
    }
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.song.id!=this.state.song.id){
      console.log("new song");
      this.setState({song: nextProps.song});
      this.props.action("getLyric", nextProps.song.id);
    }
  },
  returnValue: function(res){
    this.props.returnValue(res);
  },
  download: function(){
    //console.log(alert);
    if(this.props.downloaded){
      return alert("已经下载过啦");
    }
    if(this.props.downloading) return alert("已经在下载中啦");
    alert("已添加到下载列表");
    action.download(this.state.song);
  },
  share: function(){
    alert("分享暂时不可用哦");
  },
  render() {
    var chooseList = "";
    if(this.props.chooseList){
      chooseList = <ChooseList returnValue={this.returnValue} uid={this.props.account.id} userSonglist={this.props.userSonglist}/>
    }
    return(
        <div className="song-container">
          <div className="background blur" style={{backgroundImage: "url("+this.props.song.album.blurPicUrl+")"}}></div>
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
                <div className={"item"+(this.props.downloaded?" downloaded":"")} onClick={this.download}><i className="glyphicon glyphicon-download-alt"></i>下载</div>
                <div className="item" onClick={this.share}><i className="glyphicon glyphicon-share"></i>分享</div>
              </div>
            </div> 
            <div className="bottom">   
              <div className="song-comment">
                  <Comment id={this.props.song.commentThreadId} />
              </div>
            </div>
          </div>
          {chooseList}
        </div>
    );
  }
});

export default Song;