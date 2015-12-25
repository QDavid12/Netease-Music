import React from 'react';

var api = require('../Api');
var action = require('../Action');
var alert = require('./alert').alert;
import { Link } from 'react-router';

let Songlist = React.createClass({
  getInitialState: function() {
    console.log("songlist init");
    this.id = this.props.params.id;
    console.log(this.id);
    return {
      query: this.props.query,
      list: false
    }
  },
  load: function(){
    api.songlistDetail(this.id, function(list){
      this.setState({list: list});
    }.bind(this));
  },
  componentDidMount: function(){
    this.load();
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.params.id!=this.id){
      console.log("new List");
      console.log(nextProps.query);
      this.id = nextProps.params.id;
      this.load();
      this.setState({query: nextProps.query});
    }
  },
  play: function(e){
    var id = e.target.id;
    var songlist = (this.state.list.tracks);
    var song;
    for(var x=0;x<songlist.length;x++){
      if(songlist[x].id==id){
        song = songlist[x];
        break;
      }
    }
    action.dispatch("addAndPlay", song);
  },
  add: function(){
    alert("收藏暂不可用");
  },
  share: function(){
    alert("分享暂不可用");
  },
  downloadAll: function(){
    alert("下载暂不可用");
  },
  playAll: function(){
    action.dispatch("changePlayList", this.state.list.tracks);
  },
  addToPlaylist: function(){
    action.addToPlaylist(this.state.list.tracks);
  },
  like: function(e){
    var id = e.target.id;
    console.log(id in this.props.likelist);
    action.like({like: !(id in this.props.likelist), id: id});
  },
  download: function(e){
    var id = e.target.id;
    if(id in this.props.downloadingList) return alert("已经在下载中啦");
    if(id in this.props.downloadedList) return alert("已经下载过啦");
    for(var i in this.state.list.tracks){
      if(this.state.list.tracks[i].id==id){
        action.download(this.state.list.tracks[i]);
        break;
      }
    }
  },
  render: function(){
    console.log("songlist render");
    var songlist = this.props.query;
    songlist.tags = songlist.tags||[];
    songlist.description = songlist.description||"...";
    var list = (<tr><td style={{width: "100%", textAlign: "center"}}><i className="rotate glyphicon glyphicon-refresh"></i></td></tr>);
    if(this.state.list!=false){
      if(this.state.list.id==this.props.params.id){
        songlist = this.state.list;
        list = [];
        songlist.tracks.map(function(song, key){
          var artists = [];
          var percent = "";
          if(song.id in this.props.downloadingList){
            percent = this.props.downloadingList[song.id].percent||0+"%";
          }
          for(var i=0;i<song.artists.length;i++){
            var artist = song.artists[i];
            artists.push(
              <span key={artist.id+i}>
                <span>{(i==0?"":", ")}</span>
                <Link to={"/artist/"+artist.id} query={artist}>
                  {song.artists[i].name}
                </Link>
              </span>
            );
          }
          //time part
          var duration = parseInt(song.duration)/1000;
          var dmin = parseInt(duration/60);
          var dsecond = parseInt(duration-dmin*60);
          duration = (dmin>9?dmin.toString():"0"+dmin) + ":" + (dsecond>9?dsecond.toString():"0"+dsecond)
          list.push(
            <tr className={"song tr"+key%2} key={song.id}>
              <td className="number">{key<9?"0"+(key+1):(key+1)}</td>
              <td className="controls">
                <i id={song.id} onClick={this.like} className={"glyphicon glyphicon-heart"+(song.id in this.props.likelist?"":"-empty")}></i>
                <i id={song.id} onClick={this.download} className={"glyphicon glyphicon-"+(song.id in this.props.downloadedList?"ok":"download-alt")}></i>
                {percent}
              </td>
              <td className="name" onClick={this.play} id={song.id}>{song.name}</td>
              <td className="artists">{artists}</td>
              <td className="album"><Link to={"/album/"+song.album.id} query={song.album}>{song.album.name}</Link></td>
              <td className="duration">{duration}</td>
            </tr>
          )
        }.bind(this));
      }
    }
    return (
      <div className="main-content-container songlist">
        <div className="info-container">
          <div className="cover"><img className="reflect" src={songlist.coverImgUrl}/></div>
          <div className="info">
            <div className="songlabel">歌单</div>
            <div className="name">{songlist.name}</div>
            <div className="creator">
              <Link to={"/user/"+songlist.creator.id} query={songlist.creator}>
              <img className="avatar" src={songlist.creator.avatarUrl}/>
              <span className="nickname">{songlist.creator.nickname}</span>
              </Link>
              <span className="time">{new Date(parseInt(songlist.createTime)).toLocaleDateString()}创建</span>
            </div>
            <div className="buttons">
              <button className="play" onClick={this.playAll}>
                <i className="glyphicon glyphicon-play-circle"></i>
                播放全部
              </button>
              <button className="plus" onClick={this.addToPlaylist}>
                <i className="glyphicon glyphicon-plus"></i>
              </button>
              <button className="add" onClick={this.add}>
                <i className={"glyphicon glyphicon-folder-"+(songlist.subscribed=="true"?"close":"open")}></i>
                收藏({songlist.subscribedCount})
              </button>
              <button className="share" onClick={this.share}>
                <i className="glyphicon glyphicon-share"></i>
                分享({songlist.shareCount||0})
              </button>
              <button className="downloadAll" onClick={this.downloadAll}>
                <i className="glyphicon glyphicon-download-alt"></i>
                下载全部
              </button>
            </div>
            <div className="tags downpart">
              <span className="title">标签：</span>
              <span>
              {
                songlist.tags.length==0?"暂无标签":
                songlist.tags.map(function(tag, key){
                  var t = key==0?"":" / ";
                  return(
                    <span key={tag}>
                      {t}
                      <span className="tag">{tag}</span>
                    </span>
                  )
                })
              }
              </span>
            </div>
            <div className="description downpart">
              <span className="title">简介：</span>
              <span>
              {(songlist.description==null)?"暂无简介":songlist.description}
              </span>
            </div>
          </div>
        </div>
        <div className="tracklist">
          <table className="tracks">
            <thead>
              <tr>
                <th className="number"></th>
                <th className="controls">操作</th>
                <th className="name">音乐标题</th>
                <th className="artists">歌手</th>
                <th className="album">专辑</th>
                <th className="duration">时长</th>
              </tr>
            </thead>
            <tbody>
              { list }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
});

export default Songlist;
