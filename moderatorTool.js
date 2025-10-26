const fs = require("fs");
const readline = require("readline");

const MODERATOR_PASSWORD = "guildsecure123"; // Change this to your own secret
const filePath = "./requests.json";

// Load existing requests
let requests = [];
try {
  requests = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (error) {
  console.error("Error loading requests.json:", error);
  process.exit(1);
}

// CLI setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 🔐 Login
function authenticate() {
  rl.question("Enter moderator password: ", (input) => {
    if (input.trim() === MODERATOR_PASSWORD) {
      console.log("Access granted.");
      showMenu();
    } else {
      console.log("Access denied.");
      rl.close();
    }
  });
}

// 📋 Menu
function showMenu() {
  console.log("\nModerator Tool:");
  console.log("1. View all requests");
  console.log("2. Add a new request");
  console.log("3. Assign a plot");
  console.log("4. Unassign a plot");
  console.log("5. Delete a request");
  console.log("6. Exit");
  console.log("7. Export requests to file");
  rl.question("Choose an option: ", handleChoice);
}

// 🧠 Actions
function handleChoice(choice) {
  switch (choice.trim()) {
    case "1":
      viewRequests();
      break;
    case "2":
      addRequest();
      break;
    case "3":
      assignPlot();
      break;
    case "4":
      unassignPlot();
      break;
    case "5":
      deleteRequest();
      break;
    case "6":
      rl.close();
      break;
    case "7":
      exportRequests();
      break;
    default:
      console.log("Invalid choice.");
      showMenu();
  }
}

function viewRequests() {
  console.log("\nCurrent Requests:");
  requests.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name} → Requested: [${r.requestedPlots.join(", ")}] | Assigned: ${r.assignedPlot ?? "None"}`);
  });
  showMenu();
}

function addRequest() {
  rl.question("Character name: ", (name) => {
    rl.question("Enter up to 4 plot numbers (comma-separated): ", (input) => {
      const plots = input.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p));
      if (plots.length === 0 || plots.length > 4) {
        console.log("Please enter between 1 and 4 valid plot numbers.");
        return showMenu();
      }
      requests.push({ name, requestedPlots: plots, assignedPlot: null });
      saveRequests();
      console.log("Request added.");
      showMenu();
    });
  });
}

function assignPlot() {
  rl.question("Enter request number to assign: ", (num) => {
    const index = parseInt(num) - 1;
    if (!requests[index]) return invalidIndex();
    rl.question(`Choose a plot from [${requests[index].requestedPlots.join(", ")}]: `, (plot) => {
      const plotNum = parseInt(plot);
      if (!requests[index].requestedPlots.includes(plotNum)) {
        console.log("That plot wasn't requested.");
        return showMenu();
      }
      requests[index].assignedPlot = plotNum;
      saveRequests();
      console.log(`Assigned Plot ${plotNum} to ${requests[index].name}.`);
      showMenu();
    });
  });
}

function unassignPlot() {
  rl.question("Enter request number to unassign: ", (num) => {
    const index = parseInt(num) - 1;
    if (!requests[index]) return invalidIndex();
    requests[index].assignedPlot = null;
    saveRequests();
    console.log(`Unassigned plot from ${requests[index].name}.`);
    showMenu();
  });
}

function deleteRequest() {
  rl.question("Enter request number to delete: ", (num) => {
    const index = parseInt(num) - 1;
    if (!requests[index]) return invalidIndex();
    console.log(`Deleted request for ${requests[index].name}.`);
    requests.splice(index, 1);
    saveRequests();
    showMenu();
  });
}

function exportRequests() {
  const exportPath = "./requests_export.json";
  fs.writeFileSync(exportPath, JSON.stringify(requests, null, 2));
  console.log(`Requests exported to ${exportPath}`);
  showMenu();
}

function invalidIndex() {
  console.log("Invalid request number.");
  showMenu();
}

function saveRequests() {
  fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));
}

// 🚀 Start
authenticate();
