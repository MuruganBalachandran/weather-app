const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require("express");
const hbs = require("hbs");

const app = express();

// region Paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
// endregion

// region Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
// Register partials    
hbs.registerPartials(partialsPath);

// Handlebars helper to compare values for active nav links
hbs.registerHelper("ifEquals", (arg1, arg2, options) => {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
// endregion

// region Serve static directory
app.use(express.static(publicDirectoryPath));
// endregion

// region Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Murugan B",
    currentPage: "weather",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Murugan B",
    currentPage: "about",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Murugan B",
    helpText: "This is some helpful text.",
    currentPage: "help",
  });
});

app.get("/weather", async (req, res) => {
  const address = req.query.address;

  if (!address) {
    return res.send({
      error: "You must provide address",
    });
  }

const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_KEY}&query=${encodeURIComponent(address)}`;

  try {
    const fetchResponse = await fetch(url);
    const data = await fetchResponse?.json();

    if (data?.error) {
      return res.send({
        error: "Unable to find location. Try another search.",
      });
    }

    const current = data?.current;
    const location = data?.location;

    res.send({
      location: {
        name: location?.name,
        region: location?.region,
        country: location?.country,
        localtime: location?.localtime,
      },
      weather: {
        description: current?.weather_descriptions[0],
        icon: current?.weather_icons[0],
        temperature: current?.temperature,
        feelslike: current?.feelslike,
        humidity: current?.humidity,
        windSpeed: current?.wind_speed,
        windDir: current?.wind_dir,
        visibility: current?.visibility,
        uvIndex: current?.uv_index,
        isDay: current?.is_day,
      },
      address,
    });
  } catch (error) {
    res.send({
      error: "Unable to connect to weather service.",
    });
  }
});

// app.get('/products',(req,res)=>{
//     if(!req.query.search){
//         return res.send({
//             error:"You must provide search term"
//         })
//     }
//     console.log(req.query.search)
//     res.send({
//         products:[]
//     })
// })

//  404 for help articles
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Murugan B",
    errorMessage: "Help article not found.",
  });
});

//  404 for all other pages
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Murugan B",
    errorMessage: "Page not found.",
  });
});
// endregion

// region Start server
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
// endregion


url