import { NavLink, Link } from "react-router-dom";
import { FiSettings } from 'react-icons/fi';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { VscAccount } from 'react-icons/vsc';
import '../index.css';

import SignIn from '../screens/Messaging';

import { auth } from "../screens/Messaging";
import { useAuthState } from "react-firebase-hooks/auth";

function NavBar() {
    const [user] = useAuthState(auth);

    return (
        <nav className="navBar">
            <Link to="/" className="logo"><img src="logo.png" alt="Logo" /></Link>
            <Link to="/settings" className="m-4"><FiSettings size={30}/></Link>
            <Link to="/messaging" className="m-4"><BiMessageSquareDetail size={30}/></Link>
            <span className="m-4">{user ? <Link to="/account"><VscAccount size={30}/></Link> : <SignIn />}</span>
            {/* <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Accueil </NavLink>
            <NavLink to="settings"  className={({isActive}) => isActive ? "active" : ""} >Settings </NavLink> */}
        </nav>
    );
  }
  
  export default NavBar;
  