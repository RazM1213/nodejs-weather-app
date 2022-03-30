const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Inititating the express application
const app = express()
const port = process.env.PORT || 3000 // The port that is set for the server: by heroku OR hard coded locally

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory for server 
app.use(express.static(publicDirectoryPath))

// Render a dynamic hbs page for each route:
// Root
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Raz Matzliah'
    })
})

// About 
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Raz Matzliah'
    })
})

// Help
app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Help Message is here!',
        title: 'Help',
        name: 'Raz Matzliah'
    })
})

// Configure what the user will get at a specific URL in the app
// Weather Page:
app.get('/weather', (req, res) => {
    // If there's no address provided
    if (!req.query.address) {
        res.send({
            error: 'Address must be provided'
        })
    }
    // If there is address provided 
    else {
        // geocode func may return error or data.
        // Those are the parameters we include in the callback func.
        geocode(req.query.address, (error, geocodeData) => {
            if (error) {
                return res.send({ error }) // By destructuring error will show as JSON 
            }

            // geocode func returned geocodeData which is now used to get forecastData
            // forecast func may return error or forecastData
            forecast(geocodeData.latitude, geocodeData.longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error })
                }

                // Finally, if all works well, the user should get this JSON object from the 
                // http endpoint API. 
                res.send({
                    forecast: forecastData,
                    location: geocodeData.location,
                    address: req.query.address
                })
            })
        })
    }
})

// Configuring req and res on the /products page
// By accessing req.query, we can use the request's credentials 
// to build some logic on it
app.get('/products', (req, res) => {
    // If the request does not contain a search term -
    if (!req.query.search) {
        res.send({
            error: 'You must provide a search term'
        })
    // If the request is sent as expected - 
    } else {
        console.log(req.query)
        res.send({
            products: []
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404page', {
        title: '404',
        name: 'Raz Matzliah', 
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404page', {
        title: '404',
        name: 'Raz Matzliah', 
        errorMessage: 'Page not found.'
    })
})

// Server set up:
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})