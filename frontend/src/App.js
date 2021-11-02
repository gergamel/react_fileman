//import logo from './logo.svg';
import React from 'react';
import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//import Accordian from 'react-bootstrap/Accordion';
//import Toast from 'react-bootstrap/Toast';
import './App.css';

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

class App extends React.Component {
  constructor(props) {
    super(props);
    const API = 'http://localhost:5000/api/files';
    this.state = {loading: true, files: []};
    this.handleSubmit = this.handleSubmit.bind(this);
    fetch(API)
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((data) => {
        console.log(data);
        //setLoading(false);
        this.setState({loading: false, files: data});
    });
  }

  handleSubmit(event) {
    const selectedFile = document.getElementById('fileInput').files[0];
    //new FileUpload(selectedFile);
    var formData = new FormData();
    formData.append("file", selectedFile);
    this.setState({loading: true});
    fetch("http://localhost:5000/api/upload", {method:"POST",body:formData})
      .then((response) => {
          console.log(response);
          return response.json();
      })
      .then((data) => {
          console.log(data);
          this.setState({loading: false, files: this.state.files.concat([data])});
          //this.state.files.append(data);
          //setLoading(false);
          //setApiData(data);
      });
    event.preventDefault();
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
        <h1>Files</h1>
        {this.state.loading === true ? (
            <div>
                <h1>Loading...</h1>
            </div>
        ) : (
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
            <Stack className="ms-2 border">
              <Form formMethod="post" formEncType="multipart/form-data">
                <Form.Group as={Row} className="m-3">
                  <Form.Label column sm="2">Upload a New File</Form.Label>
                  <Col>
                    <Form.Control type="file" id="fileInput" onChange={this.handleSubmit}/>
                  </Col>
                </Form.Group>
              </Form>
            </Stack>
          </Stack>
      )}
    </Container>
    );
  };
}

export default App;
