import React from 'react';

let Artist = React.createClass({
  render() {
    return(
        <div className="main-content-container">
          {this.props.params.id}
        </div>
    );
  }
});

export default Artist;