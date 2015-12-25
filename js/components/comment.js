import React from 'react';
var api = require('../Api');

let Comment = React.createClass({
    getInitialState: function(){
        return{
            comments: false
        }
    },
    load: function(id){
        api.getComments({rid: id}, function(data){
            this.setState({comments: data.comments});
        }.bind(this));
    },  
    componentDidMount: function(){
        this.load(this.props.id);
    },
    componentWillReceiveProps: function(nextProps){
        if(nextProps.id!=this.props.id){
            this.load(this.props.id);
        }
    },
    shouldComponentUpdate: function(nextProps, nextState){
        return !(nextProps.id==this.props.id&&nextState.comments==this.state.comments);
    },
    comments: function(p){
        var a = [];
        for(var i=0;i<p.length;i++){
            var x = p[i];
            var t = new Date(x.time).toLocaleString();
            a.push(
                <div className="comment" key={i+t.toString()}>
                    <img className="avatar" src={x.user.avatarUrl}/>
                    <div className="content-container">
                        <span className="nickname" id={x.user.userId}>{x.user.nickname}</span>
                        <span className="content"> :{x.content}</span>
                        <span className="time">({t})</span>
                    </div>
                    <span className={x.liked?"like liked":"like"}>
                        <i className="glyphicon glyphicon-thumbs-up"></i>
                        ({x.likedCount})
                    </span>
                    <span className="reply">回复</span>
                </div>
            );
        }
        return a;
    },
    render() {
        var comments="拼命加载中...";
        console.log("comments render");
        console.log(this.state.comments);
        if(this.state.comments){
            comments = [];
            comments.push(<div key="title0" className="title"><span className="big">听友评论</span>(已有{this.state.comments.total}条评论)</div>);
            if(this.state.comments.hotComments!=undefined){
                comments.push(<div key="sub-title0" className="sub-title">精彩评论</div>);
                comments.push(this.comments(this.state.comments.hotComments));
            }
            if(this.state.comments.comments!=undefined){
                comments.push(<div key="sub-title1" className="sub-title">最新评论</div>);
                comments.push(this.comments(this.state.comments.comments));
            }
        }
        return(
            <div className="comment-container">
              {comments}
            </div>
        );
    }
});

export default Comment;