//import logo from './logo.svg';
import React from 'react';
import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
//import Accordian from 'react-bootstrap/Accordion';
//import Toast from 'react-bootstrap/Toast';
import './App.css';

/*
Keen to try create something like the GitLab search box, where you get
field/category like filter options presented as you type in the drop-down and you
can select them and they appear in the input like a multi-select...

Keep reading this...
https://opensource.appbase.io/reactive-manual/search-components/categorysearch.html
*/
function SearchBox() {
  return (
      <Form className="d-flex">
        <FormControl
          input-sm
          placeholder="Search for anything..."
          aria-label="Search"
          aria-describedby="searchText"
        />
      </Form>);
}

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
        this.setState({loading: false, files: data});
    });
  }

  handleSubmit(event) {
    const selectedFile = document.getElementById('fileInput').files[0];
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
        <Navbar bg="light">
          <Container fluid>
            <Navbar.Brand href="#home">File Manager</Navbar.Brand>
            <Navbar.Collapse>
              { SearchBox() }
            </Navbar.Collapse>
            {/* <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }}>
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown> 
              </Nav>
            </Navbar.Collapse>*/}
          </Container>
        </Navbar>
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
