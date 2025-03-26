const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 4000;

// Function to fetch Census Blocks from the US Census Bureau API (New York State, County 081)
async function fetchCensusBlocks() {
  try {
    // Sending a GET request to the Census Bureau API to retrieve census blocks
    const response = await axios.get(
      "https://api.census.gov/data/2020/dec/pl?get=NAME,GEO_ID&for=block:*&in=state:36&in=county:081"
    );

    // Check if the received data is valid
    if (!response.data || response.data.length < 2) {
      throw new Error("Insufficient data received from the API.");
    }

    // Transforming the data into a usable format
    return response.data.slice(1).map((block) => ({
      name: block[0],
      geo_id: block[1],
      state: block[2],
      county: block[3],
      hasBusinesses: Math.random() > 0.3, // Simulating the presence of businesses
      populationDensity: Math.floor(Math.random() * 25000), // Simulating population density
      lat: (Math.random() * 180 - 90).toFixed(6), // Simulating latitude
      lon: (Math.random() * 360 - 180).toFixed(6), // Simulating longitude
    }));
  } catch (error) {
    console.error("Error fetching Census Blocks:", error.message);
    throw new Error("Unable to fetch data from the Census Bureau.");
  }
}

// Function to filter census blocks that do not contain businesses
function filterBlocks(blocks) {
  return blocks.filter((block) => block.hasBusinesses);
}

// Function to assign relevant industries to each census block
function assignIndustries(blocks) {
  return blocks.map((block) => {
    if (block.populationDensity > 20000)
      block.industries = ["Retail", "Restaurants", "Banks"];
    else if (block.populationDensity > 5000)
      block.industries = ["Shopping Centers", "Auto Shops"];
    else if (block.populationDensity > 500)
      block.industries = ["Manufacturing", "Logistics"];
    else block.industries = ["Gas Stations", "Farms"];
    return block;
  });
}

// Function to adjust zoom level based on population density
function adjustZoom(block) {
  if (block.populationDensity > 20000) return 18; // High zoom for highly dense areas
  if (block.populationDensity > 5000) return 16; // Medium zoom for urban areas
  if (block.populationDensity > 500) return 14; // Wider zoom for small towns
  return 12; // Low zoom for rural areas
}

// Function to generate optimized Google Maps queries
function generateQueries(blocks) {
  return blocks.flatMap((block) => {
    const zoom = adjustZoom(block);
    return block.industries.map(
      (industry) =>
        `https://www.google.com/maps/search/${industry}/@${block.lat},${block.lon},${zoom}z`
    );
  });
}

// API Endpoint to generate and return the list of optimized queries
app.get("/generate-queries", async (req, res) => {
  try {
    let censusBlocks = await fetchCensusBlocks(); // Fetching data
    let filteredBlocks = filterBlocks(censusBlocks); // Filtering relevant blocks
    filteredBlocks = assignIndustries(filteredBlocks); // Assigning industries
    const queries = generateQueries(filteredBlocks); // Generating queries

    res.json({ totalQueries: queries.length, queries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server on the defined port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
