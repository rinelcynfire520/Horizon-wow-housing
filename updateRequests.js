const fs = require("fs");

const newRequest = {
  name: "NewMember",
  requestedPlots: [1, 4, 18, 32],
  assignedPlot: null
};

const filePath = "./requests.json";
const requests = JSON.parse(fs.readFileSync(filePath, "utf8"));

requests.push(newRequest);

fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));
console.log("Request added to requests.json");
