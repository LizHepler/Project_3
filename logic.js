console.log(window.location.pathname)
  // Create a map object.
  let myMap = L.map("map", {
    center: [33.412778, -111.943056],
    zoom: 12
  });

  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  dataLink = "https://data.tempe.gov/api/download/v1/items/2daeeafd2741494c8294ca415e5a793e/geojson?layers=0";

  d3.json(dataLink).then(function (data){

    console.log(data.features);

    createMap(myMap, data.features, 2017);

    d3.selectAll("#selDataset").on("change", getYear(data.features));

  });



  function getYear(data){
    let dropdownMenu = d3.select("#selDataset");
    let dataset = dropdownMenu.property("value");
    console.log(dataset);
    createMap(myMap,data,dataset);
  }


  function createMap(map, data, year){

    for (let i = 0;i < data.length; i++){
      if (data[i].properties.Year == year) {
        let incident = data[i];
        L.marker({'lat': incident.geometry.coordinates[1],'lon':incident.geometry.coordinates[0]}).bindPopup(`<h2>Date: ${incident.properties.Incident_Date.substring(0,10)}<br>Age: ${incident.properties.Age}<br>Gender: ${incident.properties.Patient_Gender}</h2>`).addTo(map);
      }
    }


  }

