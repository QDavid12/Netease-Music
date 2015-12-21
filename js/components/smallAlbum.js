import React from 'react';

let SmallAlbum = React.createClass({
    render: function(){
        var song = this.props.song;
        return(
            <div className="small-album grey">
              <div className="cover" onClick={this.props.toggleSong}>
                <div className="resize"><i className="glyphicon glyphicon-resize-full"></i></div>
                <img src={song.album.picUrl} />
              </div>
              <div className="info">
                <a href="#" className="name overflow"><span>{song.name}</span></a>
                <a href="#" className="artist overflow"><span>{song.artists[0].name}</span></a>
              </div>
              <div className="tools">
                <i className="glyphicon glyphicon-share"></i>
                <i className={"glyphicon glyphicon-heart"+(this.props.liked?"":"-empty")}></i>
              </div>
            </div>
        )
    }
})

export default SmallAlbum;