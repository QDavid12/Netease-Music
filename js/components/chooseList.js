import React from 'react';

let ChooseList = React.createClass({
    returnValue: function(e){
      var id = e.target.id;
      this.props.returnValue(id);
    },
    render: function(){
        var userList = [];
        console.log("chooseList render");
        console.log(this.props.uid);
        for(var i in this.props.userSonglist){
          if(this.props.userSonglist[i].userId==this.props.uid){
            userList.push(this.props.userSonglist[i]);
          }
        }
        return (
          <div className="listChoose">
            <div className="title">添加到歌单<i className="glyphicon glyphicon-remove" id="close" onClick={this.returnValue}></i></div>
            <div className="content">
              {
                userList.map(function(list){
                  return(
                    <div key={list.id} id={list.id} className="item" onClick={this.returnValue}>
                      <img src={list.coverImgUrl}/>
                      <span className="name">{list.name}</span>
                      <span className="count">{list.trackCount}首</span>
                    </div>
                  )
                }.bind(this))
              }
            </div>
          </div>
        )
    }
});

export default ChooseList;