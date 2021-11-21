// Had lots of trouble with this, dotenv is sold as the solution, but doesn't work, turns out
// the answer is in the docs: https://create-react-app.dev/docs/adding-custom-environment-variables/
console.log(process.env);

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(<App/>, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
