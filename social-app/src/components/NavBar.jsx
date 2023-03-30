import { NavLink, Link } from "react-router-dom";
import { FiSettings } from 'react-icons/fi';
import { BiMessageSquareDetail } from 'react-icons/bi';
import '../index.css';

function NavBar() {
    return (
        <nav className="navBar">
            <Link to="/" className="logo"><img src="logo.png" alt="Logo" /></Link>
            <Link to="/settings" ><FiSettings size={30}/></Link>
            <Link to="/messaging" ><BiMessageSquareDetail size={30}/></Link>
            {/* <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Accueil </NavLink>
            <NavLink to="settings"  className={({isActive}) => isActive ? "active" : ""} >Settings </NavLink> */}
        </nav>
    );
  }
  
  export default NavBar;
  