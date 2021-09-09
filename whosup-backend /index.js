require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());


const port = process.env.PORT || 4000;
const key = process.env.GOOGLE_API_KEY;

app.post("/", (req, res) => {
  let location = req.body.location;
  let radius = req.body.radius;
  let zip = req.body.zip;
  (async function setLocation() {
    if (zip && !location) {
        location = await zipTranslate(zip)
        location = location.lat + ',' + location.lng
     } else {
        location = location.latitude + ',' + location.longitude
     }
  })()
  .then(() => {
    getPlaces(location, radius)
    .then(places => {
      sendData(places)
      .then((feedback) => {
        res.send(feedback)
      })
  })
  .catch(console.error)
})
});

app.listen(port, () => {
  console.log("Magic running on port " + port);
});

async function sendData(places) {
    let feedback = [];
    for (let i = 0; i < places.length; i++) {
        const data = await placeDeets(places[i])
        try {
            if (data.opening_hours.open_now == true) {
                feedback.push(data)
            }
        } catch (error) {
            console.log(data)
        }
    }
    return feedback
}

async function placeDeets(placeID) {
  let feedback;
  let config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=opening_hours,name,formatted_phone_number,formatted_address&key=${key}`,
    headers: {},
  };

  await axios(config)
    .then(function (response) {
      feedback = response.data.result
    })
    .catch(function (error) {
      console.log(error);
    });
    return feedback
}

async function getPlaces(location, radius) {
  let feedback;

  let config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=restaurant&opening_hours/open_now=true&business_status=operational&key=${key}`,
    headers: {},
  };

  await axios(config)
    .then(function (response) {
        feedback = response.data.results.map(result => result.place_id);
    })
    .catch(function (error) {
      console.log(error);
    });
    
    return feedback
}

async function zipTranslate(zip) {
  let feedback;

  let config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${key}`,
    headers: {},
  };

  await axios(config)
    .then(function (response) {
        feedback = response.data.results[0].geometry.location
    })
    .catch(function (error) {
      console.log(error);
    });
    
    return feedback
}



