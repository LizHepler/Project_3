

let locationSplit= window.location.pathname.split('/');
let locationEnd = locationSplit[locationSplit.length -1];


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
  let data = JsonData;
  

    createMap(myMap, data, 2017);

    d3.selectAll("#selDataset").on("change", getYear);

    function getYear(){
      let dropdownMenu = d3.select("#selDataset");
      let dataset = dropdownMenu.property("value");
      myMap.removeLayer(markerLayer);
      createMap(myMap,data,dataset);
    }

  


  function createMap(map, data, year){
    let markers = [];
    for (let i = 0;i < data.length; i++){
      if (data[i].Year == year) {
        let incident = data[i];
        markers.push(L.marker({'lat': incident.Y,'lon':incident.X}).bindPopup(`<h2>Date: ${incident.Incident_Date.substring(0,10)}<br>Age: ${incident.Age}<br>Gender: ${incident.Patient_Gender}</h2>`));
      }
    }
    markerLayer = L.layerGroup(markers).addTo(map);
  }
//Charts HTML
} else if (locationEnd == 'charts.html') {    
    let innerData = JsonData;

    let layout = {
      height: 1000,
      width: 1200
    };

    let just2017 = [];
    for (let i = 0; i< innerData.length;i++){
      if (innerData[i].Year == 2017) {
        just2017.push(innerData[i]);
      }
    }
    //Bar Chart by Month (check for seasonal peaks)
    const countByMonth = innerData.reduce((acc, item) => {
      // Check if the country is already a key in the accumulator
      if (acc[item.Month_Sort]) {
        acc[item.Month_Sort] += 1; // Increment the count
      } else {
        acc[item.Month_Sort] = 1; // Initialize the count
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
      if (acc[item.Age]) {
        acc[item.Age] += 1; // Increment the count
      } else {
        acc[item.Age] = 1; // Initialize the count
      }
      return acc; // Return the accumulator for the next iteration
    }, {});

    let groupedVals = {'Other':0};

    Object.keys(countByAge).forEach(element => {
      if (countByAge[element] > 25) {
        groupedVals[element] = countByAge[element];
      } else {
        groupedVals['Other'] = groupedVals['Other'] + countByAge[element];
      }
    });

    
    var dataPie = [
      {
        values:Object.values(groupedVals),
        labels:Object.keys(groupedVals),
        type: "pie",
        sort: true
      }
    ]
    
    Plotly.newPlot("pie", dataPie, layout);
  }


