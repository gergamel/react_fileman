import React from "react";
import PropTypes from "prop-types";
import {
  Stack,
} from "react-bootstrap";

class File extends React.Component {
    constructor(props) {
      super(props);
      this.state = {showFile: false, divClass: "border"};
    }
  
    render() {
      const showFile = this.state.showFile;
      const divClass = this.state.divClass;
      const {Digest, ContentType, Size, Name, Category, url} = this.props;
      let fileObject;
  
      if (showFile) {
        fileObject = <Stack className="border">
          <object data={url} type={ContentType} style={{width:"100%",height:"100vh"}}>
          </object>
        </Stack>;
      } else {
        fileObject = <div/>;
      }
      
      return (
        /* "Arrow functions" or "() =>" read think link to learn more:
         * https://frontarm.com/james-k-nelson/when-to-use-arrow-functions/
         */
        <Stack className="border"
          onClick={() => showFile ? this.setState({showFile: false}): this.setState({showFile: true})}
          onMouseOver={() => this.setState({divClass: "bg-warning border"})}
          onMouseOut={() => this.setState({divClass: "border"})}>
          <Stack className={divClass}>
            <Stack className="ms-2" direction="horizontal">
              <div className="fw-bold me-1">{Name}</div>
              <div className="ms-auto">{Size} Bytes</div>
            </Stack>
            <Stack className="ms-2" direction="horizontal">
              <span className="badge bg-primary me-1">{Category}</span>
              <span className="badge bg-info me-1">{ContentType}</span>
              <span className="badge bg-secondary me-1">{Digest}</span>
            </Stack>
          </Stack>
          {fileObject}
        </Stack>
      );
    }
  }
  File.propTypes = {
    Digest: PropTypes.string.isRequired,
    ContentType: PropTypes.string.isRequired,
    Size: PropTypes.number.isRequired,
    Name: PropTypes.string.isRequired,
    Category: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  };

  export default File;