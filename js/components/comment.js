import React from 'react';

let Comment = React.createClass({
  render() {
    return(
        <div className="comment-container">
          {this.props.id}
        </div>
    );
  }
});

export default Comment;