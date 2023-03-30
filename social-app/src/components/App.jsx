// import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "../screens/Home";
import Settings from "../screens/Settings";
// import Post from "../screens/Post";
import NotFound from "../screens/NotFound";
import NavBar from "./NavBar";
import Messaging from "../screens/Messaging";
import Account from "../screens/Account";

const App = () => {
  return (
    <div className="App">
        <NavBar />
      <section>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          {/* <Route path="/post/:id" element={<Post/>} /> */}
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/account" element={<Account />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </section>
    </div>
  );
};

export default App;
