const axios = require("axios");
const fs = require("fs");

axios
  .get("https://jsonplaceholder.typicode.com/posts")
  .then((response) => {
    const data = JSON.stringify(response.data);
    fs.writeFileSync("data.json", data);
    console.log("Data saved to data.json");
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
