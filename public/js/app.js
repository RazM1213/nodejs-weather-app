// Selecting relevant elements:
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

// messageOne.textContent = 'From JS'

// Add event for the action of submmitting the form - press enter or click search
weatherForm.addEventListener('submit', (e) => {
    // Prevent page from refreshing
    e.preventDefault()

    // constant for the search value 
    const location = search.value

    // Loading message right before fetch...
    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''
    
    // fetch is used to get a response from a certain url, then to use it to do
    // certain things. In this case we fech the weather for the desired location
    // and dump the data to the console.
    // Errors are handled 
    fetch('http://localhost:3000/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = data.location
                messageTwo.textContent = data.forecast
            }
        })
    })
})