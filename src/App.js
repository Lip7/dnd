import './App.css';
import {BrowserRouter, Redirect, Route, Router, Switch} from "react-router-dom";
import Settings from './components/Settings.js'
import Nav from "./components/NavBar/Nav";
import StudySession from "./components/StudySession";
import Folders from "./components/Login/Folders";
import Signup from "./components/Signup/Signup"
import AuthVerify from "./components/common/auth-verify";
import Authservice from "./components/services/Authservice";
import {Component} from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Gazer from "./components/Login/Gazer";


class App extends Component{
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this)
        this.state ={
            currentUser: undefined,
            xoffset: 1000,
            yoffset: 1000,
            delta: 10,
        }
    }



    //logout if token expired
    logOut() {
        Authservice.logout();
        this.setState({
            currentUser: undefined,
        });
    }

    render(){

        return (
            <div className="App">

                <div className={"back"}>
                    <BrowserRouter>
                        <Nav />
                        <div className={"background"}>

                        <Switch>
                            <ProtectedRoute exact path="/studysession" component={StudySession}/>
                            <Route exact path="/gazer" component={Gazer}/>
                            <Route exact path="/folders" component={Folders}/>
                            <Route exact path="/signup" component={Signup}/>
                            <ProtectedRoute exact path="/settings" component={Settings}/>
                            <ProtectedRoute path="*" component={StudySession}/>
                            <Route path="*" component={Folders}/>
                        </Switch>

                        <AuthVerify logOut={this.logOut}/>

                        </div>
                    </BrowserRouter>
                </div>
            </div>
        );
    }

}

export default App;
