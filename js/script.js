$(function () {

  let locationHistory = [];
  let currentLocation = {};
  let locationInputEl = [];
  let latitudeMapInputEl = 0;
  let longitudeMapInputEl = 0;

  async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const myLatlng = { lat: 35.2164, lng: -80.954 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: myLatlng,
    });
    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: myLatlng,
    });

    navigator.geolocation.getCurrentPosition(function (location) {
      $("#current-location").button().on("click", function () {
        document.querySelector('#latitude').value = location.coords.latitude;
        document.querySelector('#longitude').value = location.coords.longitude;
      });

    });



    infoWindow.open(map);
    map.addListener("click", (mapsMouseEvent) => {
      infoWindow.close();
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
      );
      infoWindow.open(map);

      let newClickLat = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
      console.log(newClickLat);

      let locationData = newClickLat.match(/-?\d+/g);
      let latitudeData = locationData[0] + '.' + locationData[1];
      let longitudeData = locationData[2] + '.' + locationData[3];
      latitudeMapInputEl = latitudeData;
      longitudeMapInputEl = longitudeData;

      let clickLocation = {
        lat: latitudeData,
        lng: longitudeData,
      }
      locationHistory.push(clickLocation);
      currentLocation = clickLocation;

      document.querySelector('#latitude').value = latitudeMapInputEl;
      document.querySelector('#longitude').value = longitudeMapInputEl;
    });
  }

  initMap();

  var dialog, form,

    latitude = $("#latitude"),
    longitude = $("#longitude"),
    date = $("#date"),
    allFields = $([]).add(latitude).add(longitude).add(date);


  function addLocation() {
    let filledInput = true;

    let locationEntry = {
      latitude: $('#latitude').val(),
      longitude: $('#longitude').val(),
      date: $('#date').val(),
    };

    if (($('#latitude').val() === "") || ($('#longitude').val() === "") || ($('#date').val() === "")) {
      alert("Please make sure all fields are filled in.");
      filledInput = false;
    }
    else {
      filledInput = true;
    }

    $('#latitude').value = '';
    $('longitude').value = '';
    $('#date').value = '';

    if (filledInput) {
      localStorage.setItem('locationInfo', JSON.stringify(locationEntry));
      locationInputEl.push(locationEntry);
      dialog.dialog("close");
      location.href = "phases.html"
    }
  }

  dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      "Pick Location": addLocation,
      Cancel: function () {
        dialog.dialog("close");
      }
    },
    close: function () {
      form[0].reset();
      allFields.removeClass("ui-state-error");
    }
  });

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    addLocation();
  });

  $("#pick-location").button().on("click", function () {
    dialog.dialog("open");
  });
});
