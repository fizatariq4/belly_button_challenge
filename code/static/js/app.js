const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// read json into drop down
document.addEventListener("DOMContentLoaded", function () {
  const dropdownMenu = d3.select("#selDataset"); 
  const barChartDiv = document.getElementById("bar");
  const bubbleChartDiv = document.getElementById("bubble");

  d3.json(url).then(function (data) {
    // put in data names for ids in drop down
    const sampleIds = data.names;
    sampleIds.forEach((sampleId) => {
      dropdownMenu
        .append("option")
        .attr("value", sampleId)
        .text(sampleId);
    });

    // event listener for the dropdown menu
    dropdownMenu.on("change", function () {
      const selectedSample = this.value; // Get the selected sample ID

      // update all plots
      updateBarChart(data, selectedSample, barChartDiv);
      updateBubbleChart(data, selectedSample, bubbleChartDiv);
      displayMetadata(data, selectedSample);
    });

    // first sample
    const defaultSample = sampleIds[0];
    updateBarChart(data, defaultSample, barChartDiv);
    updateBubbleChart(data, defaultSample, bubbleChartDiv);
    displayMetadata(data, defaultSample);
  });
});

// update bar chart
function updateBarChart(data, selectedSample, chartDiv) {
  const selectedData = data.samples.find((sample) => sample.id === selectedSample);

  const sortedData = selectedData.sample_values.slice(0, 10).reverse();
  const otuIds = selectedData.otu_ids.slice(0, 10).reverse().map((id) => `OTU ${id}`);
  const otuLabels = selectedData.otu_labels.slice(0, 10).reverse();

  const trace = {
    type: "bar",
    x: sortedData,
    y: otuIds,
    text: otuLabels,
    orientation: "h",
  };

  const chartData = [trace];

  const layout = {
    title: `Top 10 OTUs for Sample ${selectedSample}`,
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" },
  };

  Plotly.newPlot(chartDiv, chartData, layout);
}

// update the bubble chart
function updateBubbleChart(data, selectedSample, chartDiv) {
  const selectedData = data.samples.find((sample) => sample.id === selectedSample);

  const trace = {
    x: selectedData.otu_ids,
    y: selectedData.sample_values,
    text: selectedData.otu_labels,
    mode: "markers",
    marker: {
      size: selectedData.sample_values,
      color: selectedData.otu_ids,
      colorscale: "Viridis",
      opacity: 0.7,
    },
  };

  const layout = {
    title: "Bubble Chart for Samples",
    xaxis: { title: "OTU IDs" },
    yaxis: { title: "Sample Values" },
    height: 600, 
    width: 1000, 
  };

  const bubbleData = [trace];

  Plotly.newPlot(chartDiv, bubbleData, layout);
}

// display function for sample metadata 
function displayMetadata(data, selectedSample) {
  const metadataDiv = d3.select("#sample-metadata");
  metadataDiv.html("");

  const selectedMetadata = data.metadata.find((metadata) => metadata.id === parseInt(selectedSample));

  Object.entries(selectedMetadata).forEach(([key, value]) => {
    metadataDiv
      .append("p")
      .text(`${key}: ${value}`);
  });
}




  
