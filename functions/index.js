const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors"); // Import the cors library

const API_KEY = "8b7987216c302daf037de6642cdb16a4";

const corsMiddleware = cors({ origin: true }); // Allow all origins for now

exports.getWeather = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!lat || !lon) {
      res.status(400).send({ error: "Latitude and longitude are required" });
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error fetching weather data");
      }

      const data = await response.json();
      res.status(200).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Unable to fetch weather data" });
    }
  });
});
