import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//used to get the expiration time
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

//check everytime going to another route if token is not expired
//if token is expired, logout
class AuthVerify extends Component {
    constructor(props) {
        super(props);

        props.history.listen(() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                 const decodedJwt = parseJwt(user.access_token);

                 //logout if current time is bigger than token expiration time
                 if (decodedJwt.exp*1000<Date.now()) {
                    props.logOut();
                }
            }
        });
    }

    render() {
        return <div></div>;
    }
}

export default withRouter(AuthVerify);