//Get the path to the file and split it to get the last segment
let locationSplit= window.location.pathname.split('/');
let locationEnd = locationSplit[locationSplit.length -1];

//If on the Map HTML
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

  //Layer to hold all the markers
  let markerLayer;

    // Initialize map with 2017 markers
    createMarkers(myMap, JsonData, 2017);

    //On change for the dropdown box
    d3.selectAll("#selDataset").on("change", getYear);

    //Function called by the dropdown
    function getYear(){
      //Extract the value of the dropdown selected
      let dropdownMenu = d3.select("#selDataset");
      let dataset = dropdownMenu.property("value");
      //Clear existing markers
      myMap.removeLayer(markerLayer);
      //Call the create map function to create all the markers for the selected year.
      createMarkers(myMap,JsonData,dataset);
    }

  //Function which creates all the map markers for a given year
  function createMarkers(map, data, year){
    let markers = [];
    for (let i = 0;i < data.length; i++){
      if (data[i].Year == year) {
        let incident = data[i];
        markers.push(L.marker({'lat': incident.Y,'lon':incident.X}).bindPopup(`<h2>Date: ${incident.Incident_Date.substring(0,10)}<br>Age: ${incident.Age}<br>Gender: ${incident.Patient_Gender}</h2>`));
      }
    }
    markerLayer = L.layerGroup(markers).addTo(map);
  }

//If on the Charts HTML
} else if (locationEnd == 'charts.html') {    
    let innerData = JsonData;

    let layout = {
      height: 550,
      width: 850
    };

    //Bar Chart by Month (check for seasonal peaks)
    const countByMonth = innerData.reduce((acc, item) => {
      // Check if the month is already a key in the accumulator
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
      // Check if the Age Range is already a key in the accumulator
      if (acc[item.Age]) {
        acc[item.Age] += 1; // Increment the count
      } else {
        acc[item.Age] = 1; // Initialize the count
      }
      return acc; // Return the accumulator for the next iteration
    }, {});

    //Intitialize dictionary for age grouped by above 25 elements
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


    //Line Graph by Gender
    const yearArray = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
    const genderLabels = innerData.map(item => item.Year);
    const genderData = innerData.map(item => item.Patient_Gender);
    console.log(genderLabels);
    console.log(genderData);

    let femaleCount = [0, 0, 0, 0, 0, 0, 0, 0];
    let maleCount = [0, 0, 0, 0, 0, 0, 0, 0];
    let nullCount = [0, 0, 0, 0, 0, 0, 0, 0];
    for (index = 0; index < yearArray.length; index++) {
      for (i = 0; i < innerData.length; i++) {
        if ((innerData[i].Year) === yearArray[index]) {
          if (innerData[i].Patient_Gender === "Female") {
            femaleCount[index] += 1;
          } else if (innerData[i].Patient_Gender === "Male") {
            maleCount[index] += 1;
          } else {
            nullCount[index] += 1;
          }
        }
      }
    }
    console.log(femaleCount);
    console.log(maleCount);

    var dataLine = [
      {
        x: Object.keys(yearArray),
        y: Object.values(femaleCount),
        type: "line"
      }
    ]

    Plotly.newPlot("line", dataLine, layout);

  }


