// import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from "../screens/Home";
import Settings from "../screens/Settings";
// import Post from "../screens/Post";
import NotFound from "../screens/NotFound";
import NavBar from "./NavBar";


const App = () => {
  return (
    <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          {/* <Route path="/post/:id" element={<Post/>} /> */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <footer></footer>
    </div>
  );
};

export default App;
