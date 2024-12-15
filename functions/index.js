const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors");

const API_KEY = "8b7987216c302daf037de6642cdb16a4";

const corsMiddleware = cors({ origin: true });

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


const tesseract = require("tesseract.js");

exports.processImage = functions.https.onRequest(async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl;
    if (!imageUrl) {
      return res.status(400).send("Missing imageUrl in request body.");
    }

    const result = await tesseract.recognize(imageUrl, "eng", {
      logger: (info) => console.log(info),
    });

    res.status(200).send({
      text: result.data.text,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Failed to process image.");
  }
});

