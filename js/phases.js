const appId = 'dde7350d-cc80-4a05-abd8-f9b38d47f0f4';
const appSecret = '6509d5ba73f09bc90884cbdde850b5884167e2fe0c7ce02e8aa60592ee8b80b15e606316c02a21ef04206d048aeccffffd5b937004c199111720042b90a62990ffa480ac7aab0102d31a9a253d3d0e87b4c0667756791ad88428fe4b4074915269205c39d493bee8ded062334449e870';
const backButtonEl = document.querySelector('#back');

function readFromLocalStorage () {
    let localData = JSON.parse(localStorage.getItem('locationInfo'));
    if (!localData) {
        localData = {
            latitude: 35.2164,
            longitude: -80.954,
        }
        localStorage.setItem('locationInfo', JSON.stringify(localData));
    }
    return localData;
}
readFromLocalStorage();
const storedLocation = JSON.parse(localStorage.getItem('locationInfo'));

let latitudeData = Number(storedLocation.latitude);
let longitudeData = Number(storedLocation.longitude);
let dateData = storedLocation.date

document.querySelector('#date-input').value = dateData;
document.querySelector('#date').value = dateData;
document.querySelector('#latitude').value = latitudeData;
document.querySelector('#longitude').value = longitudeData;

async function getMoonPhases() {
    const url = 'https://api.astronomyapi.com/api/v2/studio/moon-phase';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(`${appId}:${appSecret}`)}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayMoonPhases(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function getMoonPhaseImage() {
    const dateInput = document.getElementById('date-input').value;
    if (!dateInput) {
        alert('Please select a date.');
        return;
    }

    const url = 'https://api.astronomyapi.com/api/v2/studio/moon-phase';
    const body = {
        format: "png",
        style: {
            moonStyle: "sketch",
            backgroundStyle: "stars",
            backgroundColor: "white",
            headingColor: "white",
            textColor: "white"
        },
        observer: {
            latitude: parseFloat(latitudeData),
            longitude: parseFloat(longitudeData),
            date: dateInput,
        },
        view: {
            type: "portrait-simple",
            orientation: "south-up"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`${appId}:${appSecret}`)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayMoonPhaseImage(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
//added this
async function getComparisonMoonPhaseImage() {
    const dateCompareInput = document.getElementById('date-compare').value;
    if (!dateCompareInput) {
        alert('Please select a date.');
        return;
    }

    const url = 'https://api.astronomyapi.com/api/v2/studio/moon-phase';
    const body = {
        format: "png",
        style: {
            moonStyle: "sketch",
            backgroundStyle: "stars",
            backgroundColor: "white",
            headingColor: "white",
            textColor: "white"
        },
        observer: {
            latitude: parseFloat(latitudeData),
            longitude: parseFloat(longitudeData),
            date: dateCompareInput,
        },
        view: {
            type: "portrait-simple",
            orientation: "south-up"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`${appId}:${appSecret}`)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayCompareMoonPhase(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function displayMoonPhases(data) {
    const phases = data.data.phenomena.next;
    const moonPhaseContainer = document.getElementById('moon-phases-list');

    phases.forEach(phase => {
        const phaseElement = document.createElement('div');
        phaseElement.innerHTML = `
            <p><strong>${phase.name}</strong></p>
            <p>Date: ${new Date(phase.date).toDateString()}</p>
            <p>Phase: ${phase.phase}</p>
        `;
        moonPhaseContainer.appendChild(phaseElement);
    });
}

function displayMoonPhaseImage(data) {
    const imageUrl = data.data.imageUrl;
    const moonPhaseImageContainer = document.getElementById('moon-phase-image');

    moonPhaseImageContainer.innerHTML = '';
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Moon Phase Image';
    moonPhaseImageContainer.appendChild(imgElement);
}

function displayCompareMoonPhase(data) {
    const imageUrl = data.data.imageUrl;
    const moonPhaseImageContainer = document.getElementById('compare-moon-phase-image');

    moonPhaseImageContainer.innerHTML = '';
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'Moon Phase Image';
    moonPhaseImageContainer.appendChild(imgElement);
}

backButtonEl.addEventListener("click", function (event) {
    location.href = "index.html";
})

async function generateStarChart(date, latitude, longitude, style = 'default') {
    console.log(latitude, longitude)
    console.log(date)
    const url = 'https://api.astronomyapi.com/api/v2/studio/star-chart';

    const requestBody = {
        'style': 'navy',
        'observer': {
            // "latitude": 33.775867,
            // "longitude": -84.39733,
            'latitude': latitude,
            'longitude': longitude,
            'date': date,
        },
        'view': {
            'type': "area",
            'parameters': {
                'position': {
                    'equatorial': {
                        'rightAscension': 14.83,
                        'declination': -15.23,
                    }
                },
                "zoom": 2
            }
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(`${appId}:${appSecret}`)}`,
            'Content-Type': 'application/json'
        },
         body:JSON.stringify(requestBody)
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data.data.imageUrl;
    } else {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message}`);
    }


}
document.getElementById('star-chart-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);

    try {
        const url = await generateStarChart(date, latitude, longitude);
        document.getElementById('star-chart-result').innerHTML = `<h2>Star Chart</h2><img src="${url}" alt="Star Chart">`;
    } catch (error) {
        document.getElementById('star-chart-result').innerHTML = `<p>Error: ${error.message}</p>`;
    }
});
// Usage example

