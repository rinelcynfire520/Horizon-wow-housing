// 🏠 Housing Requests Data Store (global)
let housingRequests = [];
let exportedRequests = [];
let lastExportedSnapshot = "";

// 📥 Load requests from requests.json
async function loadRequestsFromFile() {
  try {
    const response = await fetch("requests.json");
    if (!response.ok) throw new Error("Failed to load requests.json");
    housingRequests = await response.json();
  } catch (error) {
    console.error("Error loading requests.json:", error);
  }
}

// 📥 Load exported requests from requests_export.json
async function loadExportedRequests() {
  try {
    const response = await fetch("requests_export.json");
    if (!response.ok) throw new Error("Failed to load requests_export.json");
    const text = await response.text();
    if (text !== lastExportedSnapshot) {
      exportedRequests = JSON.parse(text);
      lastExportedSnapshot = text;
      updateMap();
      if (document.getElementById("moderatorPopup").style.display === "flex") {
        displayModeratorRequests();
      }
    }
  } catch (error) {
    console.error("Error loading exported requests:", error);
  }
}

// 🔁 Auto-refresh every 10 seconds
setInterval(loadExportedRequests, 10000);

// 🧹 Close popup function (global)
function closePopup() {
  document.getElementById("requestPopup").style.display = "none";
}

// 🪟 Display moderator requests in popup
function displayModeratorRequests() {
  const container = document.getElementById("moderatorContent");
  container.innerHTML = "";

  if (exportedRequests.length === 0) {
    container.innerHTML = "<p>No requests found.</p>";
    return;
  }

  const assignedPlots = getAssignedPlots();

  exportedRequests.forEach((req, index) => {
    const div = document.createElement("div");
    div.className = "moderator-request";

    const assigned = req.assignedPlot !== null ? `Plot ${req.assignedPlot}` : "None";

    const dropdown = req.requestedPlots.map(p => {
      const disabled = assignedPlots.includes(p) ? "disabled" : "";
      return `<option value="${p}" ${disabled}>Plot ${p}</option>`;
    }).join("");

    div.innerHTML = `
      <strong>${req.name}</strong><br/>
      Requested: ${req.requestedPlots.join(", ")}<br/>
      Assigned: ${assigned}<br/>
      <select id="assignSelect${index}">
        <option value="">--Assign Plot--</option>
        ${dropdown}
      </select>
      <button onclick="assignPlot(${index})">Assign</button>
      <button onclick="unassignPlot(${index})">Unassign</button>
    `;

const sheetsBtn = document.createElement("button");
sheetsBtn.textContent = "Save to Google Sheets";
sheetsBtn.onclick = exportAssignmentsToGoogleSheets;
container.appendChild(sheetsBtn);

    container.appendChild(div);
  });

  // Add export button
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Save Assignments";
  exportBtn.onclick = exportAssignments;
  container.appendChild(exportBtn);
}

// 🪟 Open moderator panel
function openModeratorPopup() {
  displayModeratorRequests();
  document.getElementById("moderatorPopup").style.display = "flex";
}

// 🧠 Get assigned plots
function getAssignedPlots() {
  return exportedRequests
    .filter(req => req.assignedPlot !== null)
    .map(req => req.assignedPlot);
}

// 🖱️ Assign plot
function assignPlot(index) {
  const select = document.getElementById(`assignSelect${index}`);
  const value = parseInt(select.value);
  const assignedPlots = getAssignedPlots();

  if (!isNaN(value)) {
    if (assignedPlots.includes(value)) {
      alert(`Plot ${value} is already assigned.`);
      return;
    }

    exportedRequests[index].assignedPlot = value;
    updateMap();
    displayModeratorRequests();
  }
}

// 🖱️ Unassign plot
function unassignPlot(index) {
  exportedRequests[index].assignedPlot = null;
  updateMap();
  displayModeratorRequests();
}

// 💾 Export assignments to file
function exportAssignments() {
  const data = JSON.stringify(exportedRequests, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "assigned_requests.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  function exportAssignmentsToGoogleSheets() {
  const url = "https://script.google.com/macros/s/AKfycbyNT2unSvgZNKuKTxzPUrLuUGZhTJZm5-HIt_hftHPwyYt66E9HjwmrxOj8EixjWhM2/exec"; // ← Replace this with your actual script URL

  fetch(url, {
    method: "POST",
    body: JSON.stringify(exportedRequests),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.text())
    .then(msg => {
      alert("✅ Assignments saved to Google Sheets!");
    })
    .catch(err => {
      console.error("Error saving to Google Sheets:", err);
      alert("❌ Failed to save assignments.");
    });
}

}

// 🎨 Highlight assigned plots on map
function updateMap() {
  const assigned = getAssignedPlots();

  housingData.forEach(plot => {
    const marker = document.getElementById(`plot-${plot.plotNumber}`);
    if (!marker) return;

    if (assigned.includes(plot.plotNumber)) {
      marker.classList.add("assigned-highlight");
    } else {
      marker.classList.remove("assigned-highlight");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  const plotSelect = document.getElementById("plotSelect");

  // Load both request files
  Promise.all([loadRequestsFromFile(), loadExportedRequests()]).then(() => {
    updateMap();
  });

  // Clear existing options
  plotSelect.innerHTML = "";

  // Group plots by status
  const statusGroups = {
    available: [],
    requested: [],
    assigned: []
  };

  housingData.forEach((plot) => {
    statusGroups[plot.status]?.push(plot);
  });

  // Helper to create optgroup
  function addGroup(label, plots, disable = false) {
    const group = document.createElement("optgroup");
    group.label = label;

    plots.forEach((plot) => {
      const option = document.createElement("option");
      option.value = plot.plotNumber;

      let labelText = `Plot ${plot.plotNumber} (${plot.status})`;
      if (plot.requestedBy) {
        labelText += ` by ${plot.requestedBy}`;
      }

      option.textContent = labelText;
      if (disable) option.disabled = true;

      group.appendChild(option);
    });

    plotSelect.appendChild(group);
  }

  // Add groups in order
  addGroup("Available Plots", statusGroups.available);
  addGroup("Requested Plots", statusGroups.requested);
  addGroup("Assigned Plots", statusGroups.assigned, true);

  // 🧠 Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("characterName").value.trim();
    const selectedPlots = Array.from(plotSelect.selectedOptions).map(opt => parseInt(opt.value));

    if (!name) {
      alert("Please enter a character name.");
      return;
    }

    if (selectedPlots.length === 0) {
      alert("Please select at least one plot.");
      return;
    }

    if (selectedPlots.length > 4) {
      alert("You can only select up to 4 plots.");
      return;
    }

    // ✅ Save to housingRequests
    housingRequests.push({
      name: name,
      requestedPlots: selectedPlots,
      assignedPlot: null
    });

    // ✅ Update housingData with requested status
    selectedPlots.forEach(plotNum => {
      const plot = housingData.find(p => p.plotNumber === plotNum);
      if (plot && plot.status === "available") {
        plot.status = "requested";
        plot.requestedBy = name;
      }
    });

    // ✅ Show popup with selected plots
    const selectedText = selectedPlots.map(num => `Plot ${num}`).join(", ");
    document.getElementById("selectedPlotsMessage").textContent = `You selected: ${selectedText}`;
    document.getElementById("requestPopup").style.display = "flex";

    // ✅ Clear form
    form.reset();
    updateMap();
  });
});
