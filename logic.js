let locationSplit= window.location.pathname.split('/');
let locationEnd = locationSplit[locationSplit.length -1];

let dataLink = "https://data.tempe.gov/api/download/v1/items/2daeeafd2741494c8294ca415e5a793e/geojson?layers=0";

if (locationEnd == 'map.html') {
  // Create a map object.
  let myMap = L.map("map", {
    center: [33.412778, -111.943056],
    zoom: 12
  });

  // Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


  let markerLayer;

  d3.json(dataLink).then(function (data){

    createMap(myMap, data.features, 2017);

    d3.selectAll("#selDataset").on("change", getYear);

    function getYear(){
      let dropdownMenu = d3.select("#selDataset");
      let dataset = dropdownMenu.property("value");
      console.log(dataset);
      myMap.removeLayer(markerLayer);
      createMap(myMap,data.features,dataset);
    }

  });


  function createMap(map, data, year){
    let markers = [];
    for (let i = 0;i < data.length; i++){
      if (data[i].properties.Year == year) {
        let incident = data[i];
        markers.push(L.marker({'lat': incident.geometry.coordinates[1],'lon':incident.geometry.coordinates[0]}).bindPopup(`<h2>Date: ${incident.properties.Incident_Date.substring(0,10)}<br>Age: ${incident.properties.Age}<br>Gender: ${incident.properties.Patient_Gender}</h2>`));
      }
    }
    markerLayer = L.layerGroup(markers).addTo(map);
  }
} else if (locationEnd == 'charts.html') {
  d3.json(dataLink).then(function (data){
    
    let innerData = data.features;

    let layout = {
      height: 1000,
      width: 1200
    };

    let just2017 = [];
    for (let i = 0; i< innerData.length;i++){
      if (innerData[i].properties.Year == 2017) {
        just2017.push(innerData[i]);
      }
    }
    //Bar Chart by Month (check for seasonal peaks)
    const countByMonth = innerData.reduce((acc, item) => {
      // Check if the country is already a key in the accumulator
      if (acc[item.properties.Month_Sort]) {
        acc[item.properties.Month_Sort] += 1; // Increment the count
      } else {
        acc[item.properties.Month_Sort] = 1; // Initialize the count
      }
      return acc; // Return the accumulator for the next iteration
    }, {});

    var dataBar = [
      {
        x: Object.keys(countByMonth),
        y: Object.values(countByMonth),
        type: "bar"
      }
    ]
    Plotly.newPlot("bar",dataBar,layout);


    //Pie Chart by Age
    const countByAge = innerData.reduce((acc, item) => {
      // Check if the country is already a key in the accumulator
      if (acc[item.properties.Age]) {
        acc[item.properties.Age] += 1; // Increment the count
      } else {
        acc[item.properties.Age] = 1; // Initialize the count
      }
      return acc; // Return the accumulator for the next iteration
    }, {});

    var dataPie = [
      {
        values:Object.values(countByAge),
        labels:Object.keys(countByAge),
        type: "pie",
        sort: true
      }
    ]
    
    Plotly.newPlot("pie", dataPie, layout);
  }
);
}
