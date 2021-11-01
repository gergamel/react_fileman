//import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'
//import Accordian from 'react-bootstrap/Accordion';
//import Toast from 'react-bootstrap/Toast';
import './App.css';

class File extends React.Component {
  render() {
    return (
      <Stack className="ms-2 border">
        <Stack className="ms-2" direction="horizontal">
          <div className="fw-bold me-1">{this.props.Name}</div>
          <div className="ms-auto">{this.props.Size} Bytes</div>
        </Stack>
        <Stack className="ms-2" direction="horizontal">
          <span class="badge bg-primary me-1">{this.props.Category}</span>
          <span class="badge bg-info me-1">{this.props.ContentType}</span>
          <span class="badge bg-secondary me-1">{this.props.Digest}</span>
        </Stack>
      </Stack>
    );
  }
}

function App() {
  useEffect(() => {
    const getAPI = () => {
      // Change this endpoint to whatever local or online address you have
      // Local PostgreSQL Database
      const API = 'http://localhost:5000/api/files';

      fetch(API)
          .then((response) => {
              console.log(response);
              return response.json();
          })
          .then((data) => {
              console.log(data);
              setLoading(false);
              setApiData(data);
          });
    };
    getAPI();
  }, []);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  return (
    <Container>
      <h1>Files</h1>
      {loading === true ? (
          <div>
              <h1>Loading...</h1>
          </div>
      ) : (
        <Stack className="mt-2" gap={1}>
          {apiData.map((file) => {
            return (
                <File
                  key={file[0]}
                  Digest={file[0]}
                  ContentType={file[1]}
                  Size={file[2]}
                  Name={file[3]}
                  Created={file[4]}
                  Category={file[5]}
                />
              );
          })}
        </Stack>
    )}
  </Container>
  );
};

export default App;
