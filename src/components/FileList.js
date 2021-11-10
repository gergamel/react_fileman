import React from "react";
import PropTypes from "prop-types";
import {
  Container,
  Stack,
  Modal,
  Button,
  Form
} from "react-bootstrap";
import File from "./File";
import FileDropZone from "./FileDropZone";

//import FileDropZone from "./FileDropZone";
//<FileDropZone handleDrop={this.handleDrop}></FileDropZone>

// class FileUpload extends React.Component {
//   render() {
//     if (this.props.)
//     return (
//     );
//   }
// }

class FileUploadModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {files: [],};
    this.handleDrop = this.handleDrop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onUpload = this.onUpload.bind(this);
  }
  handleDrop(f) {
    this.setState({files: this.state.files.concat(f)});
    console.log(this.state.files);
  }
  handleSubmit(e) {
    //this.setState({files: this.state.files.concat(f)});
    this.handleDrop(e.target.files[0]);
  }
  onUpload() {
    //this.setState({files: this.state.files.concat(f)});
    //console.log(this.state.files);
    this.props.onUpload(this.state.files[0]);
  }
  render() {
    return (
      <Modal show={true} size="lg" centered>
        <Modal.Header>
          <Modal.Title>New File Upload</Modal.Title>
          <Button onClick={this.onUpload} variant="success" className="ms-auto">Upload</Button>
          <Button onClick={this.props.onCancel} variant="danger" className="ms-2">Cancel</Button>
        </Modal.Header>
        <Modal.Body>
          <FileDropZone handleDrop={this.handleDrop}>
            <Stack className="mt-2" gap={1}>
              {this.state.files.length > 0 ?
                this.state.files.map((f) =>
                  <File
                    key={0}
                    url={URL.createObjectURL(f)}
                    ContentType={f.type}
                    Size={f.size}
                    Name={f.name}
                  />
                )
                :
                <Stack className="ms-2 border">
                  <Form.Label>Drag and Drop or Click to Select a File</Form.Label>
                  <Form formMethod="post" formEncType="multipart/form-data">
                      <Form.Control type="file" id="fileInput" onChange={this.handleSubmit}/>
                  </Form>
                </Stack>
              }
            </Stack>
          </FileDropZone>
          {/* <Stack className="ms-2 border">
            <Stack className="ms-2" direction="horizontal">
              <div className="fw-bold me-1">{this.props.file.name}</div>
              <div className="ms-auto">{this.props.file.size} Bytes</div>
            </Stack>
            <Stack className="ms-2" direction="horizontal">
              {/* <span className="badge bg-primary me-1">{Category}</span> 
              <span className="badge bg-info me-1">{this.props.file.type}</span>
              {/* <span className="badge bg-secondary me-1">{Digest}</span>
            </Stack>
            {/* <Stack className="ms-2 border">
              <object data={url} type={this.props.file.type} style={{width:"100%",height:"100vh"}}>
              </object>
            </Stack>
          </Stack> */}
        </Modal.Body>
      </Modal>
    );
  }
}
FileUploadModal.propTypes = {
  file: PropTypes.object.isRequired,
  onUpload: PropTypes.func,
  onCancel: PropTypes.func,
};

// class NewFileButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { show: false, file: null };
//   }

//   handleClick(){
//     //const selectedFile = document.getElementById("fileInput").files[0];
//     //this.setState({ file: selectedFile });
//     this.setState({ show: true });
//   }

//   handleUpload() {
//     this.props.handleUpload(this.state.file);
//     this.setState({ file: null });
//   }

//   handleCancel() {
//     this.setState({ file: null });
//   }
  
//   render() {
//     return (
//       <Container me-auto>
//         { this.state.show && 
//           <FileUploadModal 
//             // file={this.state.file}
//             onUpload={() => this.handleUpload()}
//             onCancel={() => this.handleCancel()}
//           />
//         }
//         <Button variant="primary" className="ms-auto">New File...</Button>
//       </Container>
//     );
//   }
// }
// NewFileButton.propTypes = {
//   handleUpload: PropTypes.func,
// };

class FileList extends React.Component {
  constructor(props) {
    super(props);
    const API = "http://localhost:5000/api/files";
    this.state = {loading: true, showNewModal: false, files: []};
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

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
    // const selectedFile = document.getElementById("fileInput").files[0];
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
          this.setState({loading: false, showNewModal: false, files: [data].concat(this.state.files)});
      });
  }

  handleCancel(){
    this.setState({showNewModal: false});
  }

  render() {
    // useEffect(() => {
    //   const getAPI = () => {
    //     // Change this endpoint to whatever local or online address you have
    //     // Local PostgreSQL Database
    //     const API = "http://localhost:5000/api/files";
    //   };
    //   getAPI();
    // }, []);
    // const [apiData, setApiData] = useState([]);
    // const [loading, setLoading] = useState(true);
    return (
        <Container fluid>
        {this.state.loading === true ? (
          <Container fluid>
            <h1>Loading...</h1>
          </Container>
        ) : (
          <Container fluid>
            { this.state.showNewModal && 
              <FileUploadModal 
                // file={this.state.file}
                onUpload={this.handleUpload}
                onCancel={this.handleCancel}
              />
            }
            <Stack direction="horizontal">
              <h2>Files</h2>
              <Button variant="primary" className="ms-auto" onClick={() => this.setState({showNewModal:true})}>New File...</Button>
              {/* <FileUploadInput
                handleUpload={f => this.handleUpload(f)}
                me-auto
              /> */}
            </Stack>
            <Stack className="mt-2" gap={1}>
              {this.state.files.map((file) =>
                <File
                  key={file[0]}
                  Digest={file[0]}
                  url={"http://localhost:5000/file/contents/"+file[0]}
                  ContentType={file[1]}
                  Size={file[2]}
                  Name={file[3]}
                  Category={file[5]}
                />
              )}
            </Stack>
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
          </Container>
        )}
      </Container>
    );
  }
}

export default FileList;
