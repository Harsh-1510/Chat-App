import React from "react";
import './App.css'
import MainContainer from "./Components/MainContainer";
import Login from "./Components/Login";
import Welcome from "./Components/Welcome";
import ChatArea from "./Components/ChatArea";
import Groups from "./Components/Groups";
import { Route, Routes } from "react-router-dom";
import CreateGroups from "./Components/CreateGroups";
import Users from "./Components/Users";



function App() {
    return (
    <div className="App">
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="app" element={<MainContainer/>}>
        <Route path="welcome" element={<Welcome/>}></Route>
        <Route path="chat/:id" element={<ChatArea/>}></Route>
        <Route path="users" element={<Users/>}></Route>
        <Route path="groups" element={<Groups/>}></Route>
        <Route path="create-groups" element={<CreateGroups/>}></Route>
      </Route>
    </Routes>
      {/* <Login  />   */}
      {/* <MainContainer/> */}
    </div>
    );
}

export default App;
