function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var mymap = L.map("map", {
    maxZoom: 18,
  }).setView([12.964508505099051, 77.71364106957832], 25);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(mymap);

  var satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "© Esri",
    }
  );

  var baseLayers = {
    Map: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }),
    Satellite: satelliteLayer,
  };

  L.control.layers(baseLayers).addTo(mymap);

  // Function to handle the submission of start and end locations
  window.submitLocations = function () {
    var startpoint = document.getElementById("start").value;
    var endpoint = document.getElementById("end").value;
    const map_id = generateUUID();
    // Create an object to hold the data
    var data = {
      id: map_id,
      startpoint: startpoint,
      endpoint: endpoint,
    };
    console.log(data);

    // Make a POST request
    fetch("/odata/v4/coordinate/coordinates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Data saved successfully:", result);

        fetchAndDrawPolylines();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Function to fetch start and end points for each column and draw polylines with markers
  function fetchAndDrawPolylines() {
    // Clear existing layers on the map
    mymap.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        mymap.removeLayer(layer);
      }
    });

    // Fetch start and end points from the server
    fetch("/odata/v4/coordinate/coordinates")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Leaflet icons for markers
        var greenIcon = new L.Icon({
          iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        var redIcon = new L.Icon({
          iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Iterate over the data and draw polylines with markers for each column
        data.value.forEach((coordinate) => {
          console.log("ID:", coordinate.id);
          console.log("Startpoint:", coordinate.startpoint);
          console.log("Endpoint:", coordinate.endpoint);

          // Parse latitude and longitude values from the strings
          var startpoint = coordinate.startpoint.split(",").map(Number);
          var endpoint = coordinate.endpoint.split(",").map(Number);

          // Draw start and end markers
          var startMarker = L.marker(startpoint, {
            icon: greenIcon,
          }).addTo(mymap);
          var endMarker = L.marker(endpoint, { icon: redIcon }).addTo(mymap);

          // Draw polyline on the map
          var polyline = L.polyline([startpoint, endpoint], {
            color: "blue",
          }).addTo(mymap);

          // Add click event to polyline to display details
          polyline.addEventListener("click", function () {
            fetch("/odata/v4/polyline/getinfo")
              .then((response) => response.json())
              .then((data) => {
                data.value.forEach((point) => {
                  if (point.coordinate_id === coordinate.id) {
                    console.log(point);
                    // bindPopup to show pipe line data when we clikc on that specific line
                    polyline.bindPopup(
                      `<b>Pipe Info</b><br>ID: ${point.id}<br>Name: ${point.name}<br>Length: ${point.length}<br>Coordinate ID: ${point.coordinate_id}`
                    );
                  }
                });
              });
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // Call fetchAndDrawPolylines when the page loads
  fetchAndDrawPolylines();
});
