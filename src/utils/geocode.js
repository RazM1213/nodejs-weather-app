const request = require('request')

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoicmF6bWF0emxpYWgiLCJhIjoiY2wxM2x2d3E4MDZpbjNjcWFscGNlenJjeCJ9.a5qOvmu_HFSgLqCaOq8cpw&limit=1'

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to mapbox service!')
        } else if (body.features.length === 0) {
            callback('Query does not match any location')
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode