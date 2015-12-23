import React from 'react';
var api = require('../Api');
var action = require('../Action');
var alert = require('./alert').alert;

let Download = React.createClass({
    getInitialState: function(){
      this.getDownloadedList(this.props.downloadedList);
      return{
        downloading: false,
        downloadedList: []
      }
    },
    componentWillReceiveProps: function(nextProps){
      if(nextProps.downloadedList.length!=this.props.downloadedList.length){
        console.log("new downloadedList");
        console.log(nextProps.downloadedList);
        this.getDownloadedList(nextProps.downloadedList);
      }
    },
    getDownloadedList: function(list){
      var ids = [];
      for(var x in list){
        ids.push(x);
      }
      api.getSongDetail(ids, function(songs){
        this.setState({downloadedList: songs});
      }.bind(this))
    },
    add: function(e){
      var id = e.target.id;
      var song = [];
      var songlist = (this.state.downloadedList);
      for(var x=0;x<songlist.length;x++){
        if(songlist[x].id==id){
          song = [songlist[x]];
          break;
        }
      }
      console.log("songlist out");
      this.props.action("addToPlaylist", song);
    },
    playAll: function(){
      this.props.action("changePlayList", this.state.downloadedList);
    },
    like: function(e){
      var id = e.target.id;
      console.log(id in this.props.likelist);
      action.like({like: !(id in this.props.likelist), id: id})
    },
    download: function(e){
      var id = e.target.id;
      if(id in this.props.downloadingList) return alert("已经在下载中啦");
      if(id in this.props.downloadedList) return alert("已经下载过啦");
      for(var i in this.state.downloadedList){
        if(this.props.currentSonglist.tracks[i].id==id){
          action.download(this.props.currentSonglist.tracks[i]);
          break;
        }
      }
    },
    toggle: function(e){
      this.setState({downloading: /downloading/.test(e.target.className)});
    },
    render: function(){
      console.log("download render");
        var list = [];
        var key = -1;
        if(this.state.downloading){
          for(var x in this.props.downloadingList){
            key += 1;
            var song = this.props.downloadingList[x];
            list.push(
              <tr className={"song tr"+key%2} key={song.id}>
                <td>{key<9?"0"+(key+1):(key+1)}</td>
                <td>{song.started}</td>
                <td>{song.percent}</td>
                <td>{song.name}</td>
                <td>{song.artists[0].name}</td>
                <td>{song.album.name}</td>
                <td>{song.duration}</td>
              </tr>
            )
          }
        }
        else{
          this.state.downloadedList.map(function(song, key){
            var artists = "";
            for(var i=0;i<song.artists.length;i++){artists+=(i==0?"":", ")+song.artists[i].name}
            list.push(
              <tr className={"song tr"+key%2} key={song.id}>
                <td className="number">{key<9?"0"+(key+1):(key+1)}</td>
                <td className="controls">
                  <i id={song.id} onClick={this.like} className={"glyphicon glyphicon-heart"+(song.id in this.props.likelist?"":"-empty")}></i>
                  <i id={song.id} onClick={this.download} className={"glyphicon glyphicon-"+(song.id in this.props.downloadedList?"ok":"download-alt")}></i>
                </td>
                <td className="name" onClick={this.add} id={song.id}>{song.name}</td>
                <td className="artists">{artists}</td>
                <td className="album">{song.album.name}</td>
                <td className="duration">{song.duration}</td>
              </tr>
            )
          }.bind(this));
        }
        return (
          <div className="main-content-container download">
            <div className="switch">
              <span className={"downloaded"+(this.state.downloading?"":" active")} onClick={this.toggle}>已下载</span>
              <span className={"downloading"+(!this.state.downloading?"":" active")} onClick={this.toggle}>正在下载</span>
            </div>
            <div className="buttons">
              buttons
            </div>
            <div className={this.state.downloading?"downloading":" songlist downloaded"}>
              <div className="tracklist">
                <table className="tracks">
                  <thead>
                    {
                      this.state.downloading?
                      ( 
                        <tr>
                          <th className="number"></th>
                          <th className="status"></th>
                          <th className="pace">进度</th>
                          <th className="name">音乐标题</th>
                          <th className="artists">歌手</th>
                          <th className="album">专辑</th>
                          <th className="duration">时长</th>
                        </tr>
                      ):
                      (
                        <tr>
                          <th className="number"></th>
                          <th className="controls">操作</th>
                          <th className="name">音乐标题</th>
                          <th className="artists">歌手</th>
                          <th className="album">专辑</th>
                          <th className="duration">时长</th>
                        </tr>
                      )
                    }
                  </thead>
                  <tbody>
                    { list }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
    }
});

export default Download;