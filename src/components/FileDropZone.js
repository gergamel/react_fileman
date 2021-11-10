import React, { Component } from "react";
import PropTypes from "prop-types";

class FileDropZone extends Component {
  constructor(props) {
    super(props);
    this.state = { drag: false };
    this.dropRef = React.createRef();
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragIn = this.handleDragIn.bind(this);
    this.handleDragOut = this.handleDragOut.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragIn(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({drag: true});
    }
  }

  handleDragOut(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({drag: false});
    }
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({drag: false});
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  }

  componentDidMount() {
    let div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }

  render() {
    let divStyle;
    if (this.state.dragging) {
      divStyle = {border: "dashed grey 4px", backgroundColor: "rgba(255,255,255,.8)"};
    } else {
      divStyle = null;
    }
    return (
      <div tabIndex="0" className="dropzone" ref={this.dropRef} display="inline-block" style={divStyle}>
        {this.props.children}
      </div>
      // <div
      //   style={{display: "inline-block", position: "relative"}}
      //   ref={this.dropRef}
      // >
      //   {this.state.dragging &&
      //     <div 
      //       style={{
      //         border: "dashed grey 4px",
      //         backgroundColor: "rgba(255,255,255,.8)",
      //         position: "absolute",
      //         top: 0,
      //         bottom: 0,
      //         left: 0, 
      //         right: 0,
      //         zIndex: 9999
      //       }}
      //     > ||
      //     <div 
      //       style={{
      //         position: "absolute",
      //         top: "50%",
      //         right: 0,
      //         left: 0,
      //         textAlign: "center",
      //         color: "grey",
      //         fontSize: 36
      //       }}
      //     >
      //       <input multiple="" type="file" autoComplete="false" tabIndex="-1" style="display: none;" />
      //       <div>drop here :)</div>
      //     </div>
      //   }
      //   {this.props.children}
      // </div>
    );
  }
}
FileDropZone.propTypes = {
  handleDrop: PropTypes.func,
  children: PropTypes.object,
};

export default FileDropZone;