require('dotenv').config()
 const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/",(req,res)=>{
  return res.send("Server is running well...")
})

app.post('/getWeather', async (req, res) => {
  const { cities } = req.body;

  if (!cities || !Array.isArray(cities)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const weatherData = await getWeatherData(cities);
    res.json({ weather: weatherData });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function getWeatherData(cities) {
  const apiKey = process.env.API_KEY; // Replace with your actual API key
  const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  const weatherPromises = cities.map(async (city) => {
    const response = await axios.get(`${baseUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const temperature = response.data.main.temp;
    return { [city]: `${temperature}C` };
  });

  return Promise.all(weatherPromises).then((weatherResults) => {
    return Object.assign({}, ...weatherResults);
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
