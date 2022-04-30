import React, {Component} from "react";
import RangeSlider from "./RangeSlider";
import axios from "axios";

// Notify user about saved settings
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authHeader from "./services/authheader";

// CONSTANTS
const baseURL = "http://localhost:8080"


// In this class, the user can change the settings for breaktime, max and min temperature.
class Settings extends Component {

    constructor() {
        super();
        this.state = {
            minTemp: 20,
            maxTemp: 37,
            breakTime: 7,
        }
    }

    async componentWillMount() {
        // Get all the settings saved for the user i.e. break time, max and min temperature, store it in state and display it in the settings
        await axios.get(baseURL+"/session/values/",{headers: authHeader()}).then((res) =>{
            let data = res.data
            console.log("Settings data from backend:",data)
            this.setState(data)
        })
    }

    // This function will be sent to the child class RangeSlider to get the new changed minmax temperatures which will be saved in the state
    handleChangeTemp = (newValue) => {
        this.setState({
            minTemp: newValue[0],
            maxTemp: newValue[1],
        })
        console.log(this.state)
    };

    // Gets the input of the user for the minutes of the next break
    onInputchange = event => {
        event.preventDefault()
        console.log("event:",event.target.name)
        this.setState({
            [event.target.name]: event.target.value
        });
        console.log("on input change:",this.state)
    }

    // Send the updated settings to the backend
    sendUpdatedSettings = async (e)=>{
        e.preventDefault()

        let updated_settings = {
            minTemp: this.state.minTemp,
            maxTemp: this.state.maxTemp,
            breakTime: this.state.breakTime,
        }

        console.log("This data will be sent to the backend: ", updated_settings)

        // Send the new saved settings to the backend
        await axios.post(baseURL+'/session/values/', updated_settings, { headers: authHeader() })
            .then(resp => {
                console.log("create Session respond:", resp)
                if (resp.status !== 200) {
                    throw new Error(`Request failed: ${resp.status}`);
                }
            })
            .catch(err => {
                console.log(err.response);
            })
        toast.success('You have saved your settings successfully!');
    }

    render()
    {
        return (
            <div className={"backgroundStudySession"}>
                <div className={"elem"}>                <ToastContainer autoClose={false} limit={1} position="top-center"/>
                <h1>Settings</h1>
                <h2>Minimum and Maximum Temperature:</h2>
                <div >
                    <p>Select the desired interval for your temperature in your room and get alarmed when it gets lower or higher:</p>
                    <p>Current minimum and maximum temperature: {this.state.minTemp} Celsius | {this.state.maxTemp} Celsius</p>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 20 }}>
                        <RangeSlider
                            handleChangeTemp = {this.handleChangeTemp}
                            maxTemp = {this.state.maxTemp}
                            minTemp = {this.state.minTemp}
                        >
                        </RangeSlider>
                    </div>
                    <h2>Break After X Minutes:</h2>
                    <p>After how many minutes should you be reminded to take a break</p>
                    <input
                        type="number"
                        min={0}
                        max={1440}
                        placeholder= {this.state.breakTime}//"in minutes"
                        name="breakTime"
                        onChange={this.onInputchange}
                        value={this.state.breakTime}
                        required
                    />
                </div>
               <div style={{
                   margin: 40 }}>
                   <button className={"button"} onClick={this.sendUpdatedSettings}>Save Settings</button>
               </div>
                </div>
            </div>
        )
    }
}

export default Settings;