import React from 'react';

let Comment = React.createClass({
    comments: function(p){
        var a = [];
        for(var i=0;i<p.length;i++){
            var x = p[i];
            var t = new Date(x.time).toLocaleString();
            a.push(
                <div className="comment" key={x.commentId}>
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
        var comments="loading";
        if(this.props.comments!=undefined){
            comments = [];
            comments.push(<div className="title"><span className="big">听友评论</span>(已有{this.props.comments.total}条评论)</div>);
            if(this.props.comments.hotComments!=undefined){
                comments.push(<div className="sub-title">热门评论</div>);
                comments.push(this.comments(this.props.comments.hotComments));
            }
            if(this.props.comments.comments!=undefined){
                comments.push(<div className="sub-title">最新评论</div>);
                comments.push(this.comments(this.props.comments.comments));
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