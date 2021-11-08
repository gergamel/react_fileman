import React from 'react';
import {
  Container,
  Form,
  Row,
  Col,
  Stack,
  Modal,
  Button
} from 'react-bootstrap'

class File extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showFile: false, divClass: "ms-2 border"};
  }

  render() {
    const showFile = this.state.showFile;
    const divClass = this.state.divClass;
    const {Digest, ContentType, Size, Name, Category } = this.props;
    let fileObject;

    if (showFile) {
      fileObject = <Stack className="ms-2 border">
        <object data={"http://localhost:5000/file/contents/"+Digest} type={ContentType} style={{width:"100%",height:"100vh"}}>
        </object>
      </Stack>;
    } else {
      fileObject = <div/>
    }
    
    return (
      /* "Arrow functions" or "() =>" read think link to learn more:
       * https://frontarm.com/james-k-nelson/when-to-use-arrow-functions/
       */
      <Stack className="ms-2 border"
        onClick={() => showFile ? this.setState({showFile: false}): this.setState({showFile: true})}
        onMouseOver={() => this.setState({divClass: "ms-2 bg-warning border"})}
        onMouseOut={() => this.setState({divClass: "ms-2 border"})}>
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

// class FileUpload extends React.Component {
//   render() {
//     if (this.props.)
//     return (
//     );
//   }
// }

class FileUploadModal extends React.Component {
  render() {
    const url = URL.createObjectURL(this.props.file);

    return (
      <Modal show={true} fullscreen={true}>
        <Modal.Header>
          <Modal.Title>New File Upload</Modal.Title>
          <Button onClick={this.props.onUpload} variant="success" className="ms-auto">Upload</Button>
          <Button onClick={this.props.onCancel} variant="danger" className="ms-2">Cancel</Button>
        </Modal.Header>
        <Modal.Body>
          <Stack className="ms-2 border">
            <Stack className="ms-2" direction="horizontal">
              <div className="fw-bold me-1">{this.props.file.name}</div>
              <div className="ms-auto">{this.props.file.size} Bytes</div>
            </Stack>
            <Stack className="ms-2" direction="horizontal">
              {/* <span className="badge bg-primary me-1">{Category}</span> */}
              <span className="badge bg-info me-1">{this.props.file.type}</span>
              {/* <span className="badge bg-secondary me-1">{Digest}</span> */}
            </Stack>
            <Stack className="ms-2 border">
              <object data={url} type={this.props.file.type} style={{width:"100%",height:"100vh"}}>
              </object>
            </Stack>
          </Stack>
        </Modal.Body>
      </Modal>
    );
  }
}

class FileUploadInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { file: null };
  }

  updateInput(){
    const selectedFile = document.getElementById('fileInput').files[0];
    this.setState({ file: selectedFile });
  };

  handleUpload() {
    this.props.handleUpload(this.state.file);
    this.setState({ file: null });
  }

  handleCancel() {
    this.setState({ file: null });
  }
  
  render() {
    return (
      <Container me-auto>
        { this.state.file && 
          <FileUploadModal 
            file={this.state.file}
            onUpload={() => this.handleUpload()}
            onCancel={() => this.handleCancel()}
          />
        }
        <Form formMethod="post" formEncType="multipart/form-data">
          <Form.Group as={Row} className="m-3">
            <Form.Label column sm="2">Upload a New File</Form.Label>
            <Col>
              <Form.Control
                type="file"
                id="fileInput"
                onChange={() => this.updateInput()}
              />
            </Col>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}

class FileList extends React.Component {
  constructor(props) {
    super(props);
    const API = 'http://localhost:5000/api/files';
    this.state = {loading: true, files: []};
    this.handleUpload = this.handleUpload.bind(this);

    fetch(API)
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((data) => {
        console.log(data);
        this.setState({loading: false, files: data});
    });
  }

  handleUpload(f) {
    // const selectedFile = document.getElementById('fileInput').files[0];
    // var formData = new FormData();
    // formData.append("file", selectedFile);
    // this.setState({loading: true});
    // fetch("http://localhost:5000/api/upload", {method:"POST",body:formData})
    //   .then((response) => {
    //       console.log(response);
    //       return response.json();
    //   })
    //   .then((data) => {
    //       console.log(data);
    //       this.setState({loading: false, files: this.state.files.concat([data])});
    //   });
    // event.preventDefault();
    var formData = new FormData();
    formData.append("file", f);
    this.setState({loading: true});
    fetch("http://localhost:5000/api/upload", {method:"POST",body:formData})
      .then((response) => {
          console.log(response);
          return response.json();
      })
      .then((data) => {
          console.log(data);
          this.setState({loading: false, files: [data].concat(this.state.files)});
      });
  }

  render() {
    // useEffect(() => {
    //   const getAPI = () => {
    //     // Change this endpoint to whatever local or online address you have
    //     // Local PostgreSQL Database
    //     const API = 'http://localhost:5000/api/files';
    //   };
    //   getAPI();
    // }, []);
    // const [apiData, setApiData] = useState([]);
    // const [loading, setLoading] = useState(true);
    return (
        <Container>
        {this.state.loading === true ? (
          <Container>
            <h1>Loading...</h1>
          </Container>
        ) : (
          <Container>
            <Stack direction="horizontal">
              <h2>Files</h2>
              <FileUploadInput
                handleUpload={f => this.handleUpload(f)}
                me-auto
              />
            </Stack>
            <Stack className="mt-2" gap={1}>
              {this.state.files.map((file) => {
                return (
                    <File
                      key={file[0]}
                      Digest={file[0]}
                      ContentType={file[1]}
                      Size={file[2]}
                      Name={file[3]}
                      Category={file[5]}
                    />
                  );
              })}
              {/* <Stack className="ms-2 border">
                <Form formMethod="post" formEncType="multipart/form-data">
                  <Form.Group as={Row} className="m-3">
                    <Form.Label column sm="2">Upload a New File</Form.Label>
                    <Col>
                      <Form.Control type="file" id="fileInput" onChange={this.handleSubmit}/>
                    </Col>
                  </Form.Group>
                </Form>
              </Stack> */}
            </Stack>
          </Container>
        )}
      </Container>
    );
  };
}

export default FileList;
