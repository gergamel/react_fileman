import { React } from "react";
import { useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Tab, Tabs } from "react-bootstrap";
//import Accordian from "react-bootstrap/Accordion";
//import Toast from "react-bootstrap/Toast";

import SearchInput from "./components/SearchInput";
import FileList from "./components/FileList";
import "./App.css";

function App() {
  const [key, setKey] = useState("files");
  return (
    <Container fluid>
      <Navbar bg="light">
        <Container fluid>
          <Navbar.Brand href="#home">File Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Menu" id="basic-nav-dropdown">
                <NavDropdown.Item href="#files">Files</NavDropdown.Item>
                <NavDropdown.Item href="#activity">Activity</NavDropdown.Item>
              </NavDropdown>
              <SearchInput />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="files" title="Files">
          <FileList />
        </Tab>
        <Tab eventKey="activity" title="Activity">
          <Container>TBD</Container>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
