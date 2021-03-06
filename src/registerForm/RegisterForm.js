import React from "react";
import Header from "../components/Header";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Alert, Badge, Dropdown } from "react-bootstrap";
import { countries } from "./allCountries.js";
import doesInfoWork from "./doesInfoWork";
import "./RegisterForm.css";

/*
 * Second step to registration process
 * Lets user input rest of information
 * exported as it is used in other components, such as the profile page
 * outputs the text that you want displayed when it fails/works
 */
export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    // ensure JSON object first exists
    // if (!this.props.info) {
    //   window.location.href = "/submission";
    // }

    this.info = JSON.parse(this.props.info);
    this.state = {
      firstName: "",
      lastName: "",
      country: "",
      province: "",
      city: "",
      postalCode: "",
      address: "",
      phoneNum: "",

      countryColor: "#8d8d8d",
      failure: "",
    };

    // ensure JSON contains all the info
    // if (!this.info.email && !this.info.password) {
    //   window.location.href = "/submission";
    // }

    //binding the things that needs to use the this keyword
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleProvinceChange = this.handleProvinceChange.bind(this);
  }

  handleTextChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  handleCountryChange(e) {
    //seperate from handle text change as you need to use a dropdown menu
    //resets the province since chaning a country means the provinces will too
    this.setState({ country: e, province: "" });
  }

  handleProvinceChange(e) {
    //uses a dropdown so text change is different
    this.setState({ province: e });
  }

  async handleSubmit(e) {
    e.preventDefault();

    let toSend = this.state;

    let infoWorks = doesInfoWork(toSend);
    if (infoWorks !== "success") {
      this.setState({ failure: infoWorks });
      return;
    }

    // adding info that should exist
    toSend.email = this.info.email;
    toSend.password = this.info.password;

    await axios
      .post("http://localhost:3001/users/create", toSend)
      .then((res) => {
        //set token once we submit successfully
        window.sessionStorage.setItem("accessToken", res.data.accessToken);
        window.location.href = "/profile";
      })
      .catch((err) => {
        console.log("ERR");
        console.log(err.response.data.errors);
        console.log(
          "An error occured when creating the account. Please try again later."
        );
      });
  }

  render() {
    let countryDropdown = [];
    let provinceDropdown = [];
    let stateDropdown = [];
    let allCountries = [];
    for (let key in countries) {
      allCountries.push(countries[key]);
    }

    let allStates = [
      "Alabama",
      "Alaska",
      "American Samoa",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "District of Columbia",
      "Federated States of Micronesia",
      "Florida",
      "Georgia",
      "Guam",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Marshall Islands",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Northern Mariana Islands",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Palau",
      "Pennsylvania",
      "Puerto Rico",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virgin Island",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ];
    let allProvinces = [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Northwest Territories",
      "Nova Scotia",
      "Nunavut",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Yukon Territory",
    ];

    //items that you put inside the dropdown menu
    for (let i = 0; i < allCountries.length; i++) {
      countryDropdown.push(
        <Dropdown.Item eventKey={allCountries[i]}>
          {allCountries[i]}
        </Dropdown.Item>
      );
    }

    //for the united states dropdown for states
    for (let i = 0; i < allStates.length; i++) {
      stateDropdown.push(
        <Dropdown.Item eventKey={allStates[i]}>{allStates[i]}</Dropdown.Item>
      );
    }

    //for canada dropdown for provicnes
    for (let i = 0; i < allProvinces.length; i++) {
      provinceDropdown.push(
        <Dropdown.Item eventKey={allProvinces[i]}>
          {allProvinces[i]}
        </Dropdown.Item>
      );
    }

    //a textbox is shown when the country is not the US or Canada
    let provinceObj = (
      <div>
        <input
          placeholder="Province/State"
          type="text"
          id="province"
          onChange={this.handleTextChange}
          className="textbox"
        />
      </div>
    );

    if (this.state.country === "Canada") {
      provinceObj = (
        <Dropdown className="country-box" onSelect={this.handleProvinceChange}>
          <Dropdown.Toggle
            bsPrefix="country-button"
            style={{ color: this.state.province === "" ? "#8d8d8d" : "black" }}
          >
            {this.state.province === "" ? "Province" : this.state.province}
          </Dropdown.Toggle>
          <Dropdown.Menu
            style={{ overflowY: "scroll", maxHeight: "50vh", width: "100%" }}
          >
            {provinceDropdown}
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    if (this.state.country === "United States") {
      provinceObj = (
        <Dropdown className="country-box" onSelect={this.handleProvinceChange}>
          <Dropdown.Toggle
            bsPrefix="country-button"
            style={{ color: this.state.province === "" ? "#8d8d8d" : "black" }}
          >
            {this.state.province === "" ? "State" : this.state.province}
          </Dropdown.Toggle>
          <Dropdown.Menu
            style={{ overflowY: "scroll", maxHeight: "50vh", width: "100%" }}
          >
            {stateDropdown}
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return (
      <div>
        <Header btn="Login" href="/submission" />

        <form onSubmit={this.handleSubmit} className="form-area center">
          <h1>
            <b>Add Contact Info</b>
          </h1>

          <input
            placeholder="First Name"
            type="text"
            id="firstName"
            onChange={this.handleTextChange}
            className="textbox"
          />
          <br />
          <input
            placeholder="Last Name"
            type="text"
            id="lastName"
            onChange={this.handleTextChange}
            className="textbox"
          />
          <br />
          <br />

          <Dropdown className="country-box" onSelect={this.handleCountryChange}>
            <Dropdown.Toggle
              bsPrefix="country-button"
              style={{ color: this.state.country === "" ? "#8d8d8d" : "black" }}
            >
              {this.state.country === "" ? "Country" : this.state.country}
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{ overflowY: "scroll", maxHeight: "50vh", width: "100%" }}
            >
              {countryDropdown}
            </Dropdown.Menu>
          </Dropdown>

          {provinceObj}

          <input
            placeholder="City"
            type="text"
            id="city"
            onChange={this.handleTextChange}
            className="textbox"
          />
          <input
            placeholder="Postal/Zip Code"
            type="text"
            id="postalCode"
            onChange={this.handleTextChange}
            className="textbox"
          />
          <br />

          <input
            placeholder="Address"
            type="text"
            id="address"
            onChange={this.handleTextChange}
            className="textbox"
          />
          <br />

          <input
            placeholder="Phone Number"
            type="text"
            id="phoneNum"
            onChange={this.handleTextChange}
            className="textbox"
          />
          <br />

          <Alert
            show={this.state.failure !== ""}
            variant="danger"
            style={{ marginTop: "1vh" }}
          >
            <Badge bg="" pill className="alert-badge">
              !
            </Badge>
            {" " + this.state.failure}
          </Alert>

          <div className="right-align">
            {/* This is using the pre-made button Components from Bootstrap */}
            <Button
              type="submit"
              variant="danger"
              onClick={this.handleSubmit}
              className="login-button"
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
