import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Join from "./component/Join";
import Login from "./component/Login";
import Home from "./component/Home";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="join" element={<Join />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
