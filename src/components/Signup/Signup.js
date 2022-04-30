import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import style from "./Signup.css"
import AuthService from "../services/Authservice";
import {Link} from "react-router-dom";

//to make fields required
const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

//verify username
const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

//verify password
const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            email: "",
            password: "",
            successful: false,
            message: ""
        };
    }

    //change username in state
    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    //change password in state
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    //when clicking on signup
    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                this.state.username,
                this.state.password
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });

                    //login right after signup
                    AuthService.login(this.state.username, this.state.password).then(
                        () => {
                            this.props.history.push("/studysession");
                            window.location.reload();
                        },
                        error => {
                            const resMessage =
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString();

                            this.setState({
                                loading: false,
                                message: resMessage
                            });
                        }
                    );
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    render() {
        return (
            <div className={"textArea1"}>
                <div className={"textArea2"}>
                    <div className="col-md-12">
                         <div className="card card-container">
                             <h1 className={"LoginTitle"}>Signup</h1>

                            <Form
                                onSubmit={this.handleRegister}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                {!this.state.successful && (
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="username">Username</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="username"
                                                value={this.state.username}
                                                onChange={this.onChangeUsername}
                                                validations={[required, vusername]}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <Input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.onChangePassword}
                                                validations={[required, vpassword]}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <button className="button">Sign Up</button>
                                        </div>
                                    </div>
                                )}

                                {this.state.message && (
                                    <div className="form-group">
                                        <div
                                            className={
                                                this.state.successful
                                                    ? "alert alert-success"
                                                    : "alert alert-danger"
                                            }
                                            role="alert"
                                        >
                                            {this.state.message}
                                        </div>
                                    </div>
                                )}
                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
                            </Form>
                             <p className="mt-2"> Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
