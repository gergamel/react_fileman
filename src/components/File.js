import React from "react";
import PropTypes from "prop-types";
import {
  Stack,
} from "react-bootstrap";

/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
 function humanFileSize(bytes, dp=1) {
  const thresh = 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + " " + units[u];
}

class File extends React.Component {
    constructor(props) {
      super(props);
      this.state = {showFile: false, divClass: "border"};
    }
  
    render() {
      const showFile = this.state.showFile;
      const divClass = this.state.divClass;
      const {ContentType, Size, Name, Category, url} = this.props;
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
          <Stack className={divClass} style={{fontSize: 14}}>
            <div className="d-block">{Name}</div>
            {/* <div className="none d-lg-block" style={{fontSize: 10}}><span className="badge bg-secondary">{Digest}</span></div> */}
            <div className="d-flex" display="flex">
              <div><span className="badge bg-primary me-1">{Category}</span></div>
              <div><span className="badge bg-info me-1">{ContentType}</span></div>
              <div className="d-inline ms-auto">{humanFileSize(Size)}</div>
            </div>
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


/*
File Icons...
"aac.png"
"aiff.png"
"ai.png"
"avi.png"
"_blank.png"
"bmp.png"
"c.png"
"cpp.png"
"css.png"
"csv.png"
"dat.png"
"dmg.png"
"doc.png"
"dotx.png"
"dwg.png"
"dxf.png"
"eps.png"
"exe.png"
"flv.png"
"gif.png"
"h.png"
"hpp.png"
"html.png"
"ics.png"
"iso.png"
"java.png"
"jpg.png"
"js.png"
"key.png"
"less.png"
"mid.png"
"mp3.png"
"mp4.png"
"mpg.png"
"odf.png"
"ods.png"
"odt.png"
"otp.png"
"ots.png"
"ott.png"
"_page.png"
"pdf.png"
"php.png"
"png.png"
"ppt.png"
"psd.png"
"py.png"
"qt.png"
"rar.png"
"rb.png"
"rtf.png"
"sass.png"
"scss.png"
"sql.png"
"tga.png"
"tgz.png"
"tiff.png"
"txt.png"
"wav.png"
"xls.png"
"xlsx.png"
"xml.png"
"yml.png"
"zip.png"
*/