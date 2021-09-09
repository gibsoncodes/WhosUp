import { useState } from "react";
import axios from "axios";
import "./App.css";
import "./index.css";
import Restaurant from "./Restaurant";

function App() {
  let gotLocation = "inactive"
  const [formState, setFormState] = useState({
    radius: "1600",
    location: null,
    zip: "",
  });
  const [data, setData] = useState(null);

  function submitForm() {
      const timer = ms => new Promise(res => setTimeout(res, ms))

      async function load () {
        while (gotLocation === "pending") {
            if (formState.location) {
                gotLocation = "active"
            }
            await timer(1000)
         }
      }

      load()
      .then(() => {
        let payload = formState;
        axios.post("https://whosup-backend.herokuapp.com/", payload).then((res) => {
          setData(res.data);
        });
      })

  }

  function handleChange(event) {
    let val = event.target.value + 1600 * (event.target.value + 1);
    val = "" + val;
    setFormState({ ...formState, [event.target.id]: val });
  }
  function handleZip(event) {
    setFormState({ ...formState, [event.target.id]: event.target.value });
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(saveCoords);
      gotLocation = "pending"
    } else {
      alert("location services not supported please manually fill out field.");
    }
    function saveCoords(position) {
      const newState = formState;
      newState.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log(newState)
      setFormState(newState);
    }
  }

  return (
    <div className="App">
      <div className="header">
        <img className="logo" src="images/whosup.jpg" alt="logo"></img>
      </div>
      <div className="form">
        <div className="upper ">
          <div className="get-location">
            <div className="inner-loc">
              <div
                className="button_slide slide_down small-btn"
                onClick={getLocation}
              >
                Get Location
              </div>
              <h2 className="or">OR</h2>
              <input
                id="zip"
                onChange={handleZip}
                placeholder="Zip Code"
                maxLength="5"
                value={formState.zip}
              />
            </div>
          </div>
          <div className="get-radius">
            <label htmlFor="radius">Search Within</label>
            <select id="radius" onChange={handleChange}>
              <option value="0">1 mile</option>
              <option value="1">2 miles</option>
              <option value="2">3 miles</option>
              <option value="3">4 miles</option>
            </select>
          </div>
        </div>
        <div onClick={submitForm} className="button_slide slide_down">
          Who's Up!
        </div>
      </div>
      <div className="content">
        {data
          ? data.map((item) => <Restaurant key={item.name} place={item} />)
          : null}
      </div>
    </div>
  );
}

export default App;
