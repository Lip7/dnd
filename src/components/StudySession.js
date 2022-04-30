import React, {Component} from "react";
import axios from "axios";
import './StudySession.css';
import AreaRechartComponent from "./AreaRechartComponent";
import ScrollToTop from "./ScrollToTop/ScrollToTop";

// Notify user with short messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authHeader from "./services/authheader";

const baseURL = "http://localhost:8080"


class StudySession extends Component {

    constructor() {
        super();

        // Update input title to state.currentTitle
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            inform_notifications_every_sec: 30000, // every x seconds check for notifications and inform the user
            session_ongoing: 0, // Boolean: is there a current session ongoing? then do not show delete button
            ongoing_session_id: "",
            currentTitle: "", // currentTitle to be set by the user -> will be pushed to the backend as session_name when creating a new session
            //How our sessions are structured:
            sessions: [
                {
                    session_id: 1, // Every session has an unique ID
                    session_name: "Name of Session", // Name of the session
                    session_start: "20.12.2021", // date and time the session started
                    session_end: "21.12.2021", // date and time the session stopped
                    session_breakTime: "21.12.2021", // date and time when the next break is
                    session_duration: 7, // date and time between start and end
                    session_stopped: 0 // true if the session was stopped, false if it is still ongoing
                }
            ],

            // Will be updated by the server and received from the backend with a get every x seconds
            list_of_notifications:{
                open_window: false,
                make_break: false,
                alarm_humidity_wrong: false,
                air_quality_wrong: false,
                alarm_temperature_cold: false,
                alarm_temperature_hot: false,
            },

            currentCO2: "",
            currentTemp: "",
            avgCO2:"example",
            avgTemp:"example",

            allSessionsTemp:[], //list of all temp measurements (all sessions)
            allSessionsCO2: [], //list of all co2 measurements (all sessions)
        }
    }


    async componentDidMount() {

        //get current measurements
        await this.getMeasurements()

        // Update notifications every x seconds
        await this.checkNotificationsHandler()
        this.mySecondInterval = setInterval(this.checkNotificationsHandler, this.state.inform_notifications_every_sec)

        // Get all sessions from backend
        await axios.get(baseURL+"/session/",{ headers: authHeader() }).then((res) =>{
            let data = res.data
            this.setState({sessions: data.reverse()})

            // check if a session is ongoing
            if(this.state.sessions.length > 0){
                if (this.state.sessions[this.state.sessions.length-1].session_stopped){
                    this.setState({
                        session_ongoing: 0,
                    })
                }
                else{
                    this.setState({
                        session_ongoing: 1,
                    })
                }
            }
        })
    }

    componentWillUnmount(){
        clearInterval(this.myInterval);
        clearInterval(this.mySecondInterval);
    }

    // Input user for title of a session
    handleChange(event) {
        event.preventDefault()
        this.setState({currentTitle: event.target.value});
    }

    // Creates Session and increments number of session and ongoing session will be true
    createSessionHandler = async (e)=>{

        //start interval for updating current measurements
        this.myInterval = setInterval(this.getMeasurements,10000)//every 10 seconds

        e.preventDefault()

        let new_session = {
            session_id: this.state.sessions.length,
            session_name: this.state.currentTitle,
            session_stopped: 0,
            //session_breakTime: 0,
        }

        // Send creation of session to backend and get the session_start of the backend
        console.log("This data will be sent to the backend: ", new_session)
        await axios.post(baseURL+'/session/', new_session, { headers: authHeader() })
             .then(resp => {
                 console.log("create Session respond:", resp)
                 new_session["session_start"] = resp["data"]["session_start"]
                 if (resp.status !== 200) {
                     throw new Error(`Request failed: ${resp.status}`);
                 }
             })
             .catch(err => {
                 console.log(err.response);
             })

        // Add the created session to the list of sessions
         let sessions = [new_session, ...this.state.sessions]

        // Change session ongoing to true
        await this.setState({
            session_ongoing: 1,
        })

        await this.setState({ongoing_session_id: new_session.session_id})
        await this.getMeasurements()
        await this.setState({sessions})
        console.log("State after created session: ",this.state)
    }

    // Stop the current session and get the session_end time from the backend and save it in the last session
    stopSessionHandler = async (e)=>{
        e.preventDefault()
        let sessions

        await axios.post(baseURL+'/session/stop/', {},{ headers: authHeader() })
            .then(resp => {
                 sessions = this.state.sessions.map(session => (
                    session.session_id===this.state.sessions.length-1 ? {...session, session_end: resp["data"]["session_end"], session_stopped: 1}: session

            ))
                console.log("sessions after stopped", this.state)
                if (resp.status !== 200) {
                    throw new Error(`Request failed: ${resp.status}`);
                }
            })
            .catch(err => {
                console.log(err.response);
            })

        //get measurements
        await this.getMeasurements()

        //get session with id
        let newSession = await this.getSessionById(sessions[0].session_id)
        sessions[0]=newSession
        await this.setState({
            session_ongoing: 0,
        })

        // Set new sessions
        await this.setState({ sessions });

        clearInterval(this.myInterval); //stop interval for updating current measurements
    }

    //get the session with the id
    getSessionById = async (id) => {
        let session = ""
        await axios.get(baseURL + /session/+id, {headers: authHeader()}).then((res) => {
            let data = res.data
            session = data
        })

        return session
    }

    getMeasurements = async () => {
        //get CO2 for all sessions and store it, so it can be used for area chart
        await axios.get(baseURL + "/CO2/",{ headers: authHeader() }).then((res) => {
            let data = res.data
            console.log("DATA CO2: ", data)

            //dictionary will then be stored in allSessionsCO2. As format for area chart
            let newDict = []

            //iterate over whole data to get key (id of session) and value (list of all CO2 measurements)
            Object.entries(data).length > 0 &&
            Object.entries(data).map(([key, value]) => {
                //array to store each dict of one session which is used for area chart: name and CO2
                let array = []
                //console.log(key, value)
                Object.entries(value).map(([index, oneMeasure]) => {
                    array.push(
                        {
                            name: "",
                            CO2: oneMeasure,
                        }
                    )
                })
                //add each session to the new dictionary
                newDict.push({
                    id: key,
                    measurements: array
                })
            })

            //set state to the new dictionary
            this.setState({allSessionsCO2: newDict})
        })

        //same as above but for temp: get temp for all sessions and store it, so it can be used for area chart
        await axios.get(baseURL + "/temp/",{ headers: authHeader() }).then((res) => {
            let data = res.data
            console.log("DATA TEMP", data)

            //dictionary will then be stored in allSessionsTemp. As format for area chart
            let newDict = []

            //iterate over whole data to get key (nid of session) and value (list of all temp measurements)
            Object.entries(data).length > 0 &&
            Object.entries(data).map(([key, value]) => {
                //array to store each dict of one session which is used for area chart: name and temp
                let array = []
                Object.entries(value).map(([index, oneMeasure]) => {
                    array.push(
                        {
                            name: "",
                            Temperature: oneMeasure,

                        }
                    )
                })
                //add each session to the new dictionary
                newDict.push({
                    id: key,
                    measurements: array
                })
            })

            //set state to the new dictionary
            this.setState({allSessionsTemp: newDict})

        })

    }

    // Deletes all sessions after clicking the delete button
    deleteSessionHandler = async (e) => {
        e.preventDefault()
        let sessions = []
        this.setState({sessions})
        axios.delete(baseURL + '/session/',{ headers: authHeader() })
            .then(resp => {
                if (resp.status !== 200) {
                    throw new Error(`Request failed: ${resp.status}`);
                }
            })
            .catch(err => {
                console.log(err.response);
            })
        await this.getMeasurements()

    }

    // Check all 30 seconds the state of notifications and informs the user with toast
    checkNotificationsHandler = async () => {

        // Get all notifications from backend
        await axios.get(baseURL+"/session/check/",{ headers: authHeader() }).then((res) =>{
            let data = res.data
            // Overwrite the notification values from the backend
            this.setState({list_of_notifications: data})
        })

        // Check notifications and alarm the user
        if (this.state.list_of_notifications.make_break){
            toast.warning('You need a break! ')
            const list_of_notifications = {...this.state.list_of_notifications, make_break: false}
            this.setState({list_of_notifications})
        }
        if (this.state.list_of_notifications.open_window){
            toast.warning('You need to open the window! ')
            const list_of_notifications = {...this.state.list_of_notifications, open_window: false}
            this.setState({list_of_notifications})
        }
        if (this.state.list_of_notifications.air_quality_wrong){
            toast.warning('You need to open the window since the air quality is bad! ')
            const list_of_notifications = {...this.state.list_of_notifications, air_quality_wrong: false}
            this.setState({list_of_notifications})
        }
        if (this.state.list_of_notifications.alarm_humidity_wrong){
            toast.warning('You need to open the window since the humidity is bad! ')
            const list_of_notifications = {...this.state.list_of_notifications, alarm_humidity_wrong: false}
            this.setState({list_of_notifications})
        }
        if (this.state.list_of_notifications.alarm_temperature_cold){
            toast.warning('It is colder than the limited set in settings! Turn on the heating! ')
            const list_of_notifications = {...this.state.list_of_notifications, alarm_temperature_cold: false}
            this.setState({list_of_notifications})
        }
        if (this.state.list_of_notifications.alarm_temperature_hot){
            toast.warning('It is colder than the limited set in settings! Turn off the heating or open the window! ')
            const list_of_notifications = {...this.state.list_of_notifications, alarm_temperature_hot: false}
            this.setState({list_of_notifications})
        }
    }


    render() {
        // List of all sessions completed
            let sessionsList = this.state.sessions.map(session => {
                if (session.session_stopped) {

                    //iterate to find temp measurements of the right id
                    let sessionMeasTemp = null
                    this.state.allSessionsTemp.map(entry => {
                        if (entry.id == session.session_id) {
                            sessionMeasTemp = entry.measurements
                        }
                    })

                    //iterate to find co2 measurements of the right id
                    let sessionMeasCO2 = null
                    this.state.allSessionsCO2.map(entry => {
                        if (entry.id == session.session_id) {
                            sessionMeasCO2 = entry.measurements
                            sessionMeasCO2 = entry.measurements
                        }
                    })

                       return (
                        <div key={session.session_id}>
                            <div className={"sessionElem"}>
                                <p><b>{session.session_name}</b> | <b>Session ID:</b> {session.session_id} </p> <p><b>Session
                                    Start:</b> {session.session_start} | <b>Session End:</b> {session.session_end}</p>
                                <p><b>Average Temperature: </b>{session.average_temp.toFixed(1)}° C | <b>Average CO<sub>2</sub>: </b>{session.average_co2.toFixed(1)} CO<sub>2</sub>e</p>
                                {/*| <b>Session Duartion:</b> {session.session_end - session.session_start)}</p>*/}
                                {sessionMeasTemp == null ? "" : <AreaRechartComponent type={"Temperature"}
                                                                                data={sessionMeasTemp}></AreaRechartComponent>}
                                {sessionMeasCO2 == null ? "" : <AreaRechartComponent type={"CO2"}
                                                                                  data={sessionMeasCO2}></AreaRechartComponent>}

                                {/* <AreaRechartComponent type={"CO2"}8148f3b4c0ed
                                                  data={this.state.allSessionsCO2[session.session_id][session.session_name]}></AreaRechartComponent>*/}
                            </div>
                        </div>

                    )
                }
            })
            // List of current active session
            let currentSession = this.state.sessions.map(session => {
                if (!session.session_stopped){

                    //iterate to find temp measurements of the right id
                    let sessionMeasTemp = []
                    this.state.allSessionsTemp.map(entry => {
                        if (entry.id == session.session_id) {
                            sessionMeasTemp = entry.measurements
                        }
                    })

                    //iterate to find co2 measurements of the right id
                    let sessionMeasCO2 = []
                    this.state.allSessionsCO2.map(entry => {
                        if (entry.id == session.session_id) {
                            sessionMeasCO2 = entry.measurements
                        }
                    })

                    //show ongoing session data
                    return (
                        <div key={session.session_id}>
                            <p><b>{session.session_name}</b> | <b>Session ID:</b> {session.session_id} </p> <p><b>Session
                                Start:</b> {session.session_start}</p>
                            {this.state.sessions.length!=0&&sessionMeasTemp.length!=0?<p><b>Current Temperature:</b> {sessionMeasTemp[sessionMeasTemp.length-1].Temperature}° C</p>:<p><b>Current Temp:</b> Not measured yet</p>}
                            {this.state.sessions.length!=0&&sessionMeasCO2.length!=0?<p><b>Current CO<sub>2</sub>:</b> {sessionMeasCO2[sessionMeasCO2.length-1].CO2} CO<sub>2</sub>e</p>:<p><b>Current CO<sub>2</sub>:</b> Not measured yet</p>}
                        </div>

                    )}
            })

            return (
             <div>
                 <ToastContainer autoClose={false} limit={1} position="top-center"/>
                    <div className={"backgroundStudySession"}>
                        <div className={"elem"}>
                            <h1>STUDY SESSION</h1>
                            <h2>Current study sessions: </h2>
                            {
                                <form>
                                    <label>
                                        <b>Name: </b>
                                        <input type="text" placeholder={"Enter an optional name"}
                                               onKeyPress={(e) => {
                                                   e.key === 'Enter' && e.preventDefault();
                                               }} value={this.state.currentTitle} onChange={this.handleChange}/>
                                    </label>
                                </form>
                            }
                            {this.state.session_ongoing !== 1 ?
                                <button className={"button"} onClick={this.createSessionHandler}>Create New Session</button>
                                : <button  className={"button"} onClick={this.stopSessionHandler}>Stop Session</button>}

                            {currentSession}
                            <p></p>

                            {(this.state.sessions.length > 0) && (this.state.sessions[this.state.sessions.length - 1].session_stopped !== 0) &&
                            <h2>Past study sessions: </h2>}
                            {(this.state.sessions.length > 0) && (!this.state.session_ongoing) && (this.state.sessions[this.state.sessions.length - 1].session_stopped !== 0) &&
                            <button  className={"button"}  onClick={this.deleteSessionHandler}>Delete all Sessions</button>}

                            {sessionsList}
                        </div>
                    </div>
                    <ScrollToTop></ScrollToTop>
                </div>

            )


    }
}


export default StudySession;