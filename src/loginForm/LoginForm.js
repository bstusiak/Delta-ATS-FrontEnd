import React from "react";
import "./LoginForm.css";
import Header from "../components/Header";
import {
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Badge,
} from "react-bootstrap";
import axios from "axios";

/*
 * Login/first step for registration.
 * Asks for user to enter email and password.
 */
class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    // Failure text change to the type of failure
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      isLogin: true,
      failure: "",
      errorType: -1,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
  }

  // Is run when user types in textbox
  handleChange(e) {
    let toChange = e.target.id;
    this.setState({
      [toChange]: e.target.value,
    });
  }

  async handleLogin(e) {
    e.preventDefault();

    //failure is the message that is displayed on fail
    //errorType is which textfield is highlighted when you fail
    if (!this.state.email) {
      this.setState({ failure: "Please enter an email", errorType: 1 });
      return;
    }

    if (!this.state.password) {
      this.setState({ failure: "Please enter a password", errorType: 2 });
      return;
    }

    //test if email and password match up in server
    let self = this;
    await axios
      .post("http://localhost:3001/users/authenticate", this.state)
      .then((res) => {
        if (res.data.length > 0) {
          //if it works, set our accessToken
          window.sessionStorage.setItem("accessToken", res.data.accessToken);
          window.location.href = "/profile";
        } else {
          self.setState({
            failure: "Invalid email or password",
            errorType: -1,
          });
        }
      })
      .catch((err) => {
        self.setState({
          failure: "Couldn't contact server, please try again later",
          errorType: 0,
        });
      });
  }

  handleContinue(e) {
    e.preventDefault();
    //test email, check if it has a @ and a .
    if (
      this.state.email.indexOf("@") === -1 ||
      this.state.email.indexOf(".") === -1
    ) {
      this.setState({
        failure: "Please enter a valid email",
        errorType: 1,
      });
      return;
    }

    //test if passwords match
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        failure: "Passwords are not matching",
        errorType: 3,
      });
      return;
    }

    //password checks
    if (this.state.password.length < 8) {
      this.setState({
        failure: "Password must be at least 8 characters",
        errorType: 2,
      });
      return;
    }

    if (this.state.password.toLowerCase() === this.state.password) {
      this.setState({
        failure: "Password must contain at least 1 capital letter",
        errorType: 2,
      });
      return;
    }

    if (!/\d/.test(this.state.password)) {
      this.setState({
        failure: "Password must contain at least 1 number",
        errorType: 2,
      });
      return;
    }

    //test if it is a valid email, one that is not already in use
    let self = this;
    axios
      .post("http://localhost:3001/users/checkValidEmail", this.state)
      .then((res) => {
        if (res.data[0].exists === false) {
          //change window to contact info registration, store the email and password
          this.props.callbackEmailPassword(this.state);
          window.location.href = "/submission/register";
        } else {
          self.setState({
            failure: "Email already in use",
            errorType: 1,
          });
        }
      })
      .catch((res) => {
        self.setState({
          failure: "Couldn't contact server, please try again later",
          errorType: 0,
        });
      });
  }

  render() {
    const handleToggle = (value) => {
      this.setState({ isLogin: value, errorType: -1 });
    };
    return (
      <div>
        <Header />

        <form
          onSubmit={this.state.isLogin ? this.handleLogin : this.handleContinue}
          className="form-area center"
        >
          <ToggleButtonGroup
            type="radio"
            name="options"
            value={this.state.isLogin}
            className="options"
            onChange={handleToggle}
          >
            <ToggleButton
              id="option1"
              className="options"
              variant="outline-danger"
              size="xxl"
              value={true}
            >
              Login
            </ToggleButton>
            <ToggleButton
              id="option2"
              className="options"
              variant="outline-danger"
              size="xxl"
              value={false}
            >
              Register
            </ToggleButton>
          </ToggleButtonGroup>

          <Alert show={this.state.errorType >= 0} variant="danger">
            <Badge bg="" pill className="alert-badge">
              !
            </Badge>
            {" " + this.state.failure}
          </Alert>

          <input
            placeholder="Email"
            type="text"
            size="100px"
            maxlength="320"
            onChange={this.handleChange}
            className={`textbox ${
              this.state.errorType === 1 ? "red-border" : ""
            }`}
            id="email"
          />
          <br />

          <input
            placeholder="Password"
            type="password"
            maxlength="100"
            onChange={this.handleChange}
            className={`textbox ${
              this.state.errorType >= 2 ? "red-border" : ""
            }`}
            id="password"
          />
          <br />

          {!this.state.isLogin && (
            <div className="confirmPass">
              <input
                placeholder="Confirm Password"
                type="password"
                maxlength="100"
                onChange={this.handleChange}
                className={`textbox ${
                  this.state.errorType === 3 ? "red-border" : ""
                }`}
                id="confirmPassword"
              />
              <br />
            </div>
          )}

          <div className="right-align">
            {this.state.isLogin && (
              <a href="https://www.google.com/">Forgot My Password</a>
            )}
            <br />

            {/* This is using the pre-made button Components from Bootstrap */}

            <Button
              type="submit"
              variant="danger"
              onClick={
                this.state.isLogin ? this.handleLogin : this.handleContinue
              }
              className="login-button right-align"
            >
              {this.state.isLogin ? "Log in" : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm;
