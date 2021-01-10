import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateRoom from "./CreateRoom/CreateRoom";
import JoinRoom from "./JoinRoom/JoinRoom";
import Header from "./Header/Header";
import Home from "./Home/Home";
import Lobby from "./Lobby/Lobby";

import "./index.css";
// import Home from "./Home/Home";
// import ChatRoom from "./ChatRoom/ChatRoom";

function App() {
  // if(!localStorage.getItem('userName'))
  // {
  //   return (
  //     <Router>
  //     <Switch>
  //       <Route exact path="/" component={Lobby} />
  //       {/* <Route exact path="/:roomId" component={ChatRoom} /> */}
  //     </Switch>
  //   </Router>
  //   );
  // }
  return (
    <>
    <Router>
      <Header/>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/create" component={CreateRoom} />
        <Route exact path="/join" component={JoinRoom} />
        <Route exact path="/:roomId" component={Lobby} />
      </Switch>
    </Router>
    </>
  );
}

export default App;
