import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import './Nav.css';
import Authservice from "../services/Authservice";

class Nav extends Component{

    constructor() {
        super();
        this.state={
            user: undefined,
        }
    }

    //get current user
    componentDidMount() {
        this.setState({user: localStorage.getItem('user')})
    }

    //logout when clicking on logout button
    logout = () =>{
        Authservice.logout();
        this.setState({user: undefined});

    }

    render(){
       let user =localStorage.getItem("user")

        return(
            <nav className={"NavbarItems"}>
                <Link to="/studysession" style={{ textDecoration: 'none', justifyContent:'center' }}><h1 className={" navbar-logo"}>MMI </h1></Link>

                <div className={'nav-menu'}>
                    {user!=undefined?<Link to={"/studysession"}>
                        <button className={"button"}>
                            Study session
                        </button>
                    </Link>:""}
                    {user!=undefined?<Link to="/settings">
                        <button className={"button"}>
                            Settings
                        </button>
                    </Link>:""}
                    {user!=undefined? <Link to="/login">
                        <button className={"button"} onClick={this.logout}>
                            Logout
                        </button>
                    </Link>:<Link to="/login">
                        <button className={"button"}>
                            Login
                        </button>
                    </Link>}
                    {user==undefined?<Link to="/signup">
                        <button className={"button"}>
                            Signup
                        </button>
                    </Link>:""}


                </div>
            </nav>
        )
    }


}

export default Nav;