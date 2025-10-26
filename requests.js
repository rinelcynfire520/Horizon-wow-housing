// 🏠 Housing Requests Data Store (global)
const housingRequests = [];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  const plotSelect = document.getElementById("plotSelect");

  /*
  Example entry:
  {
    name: "Elunaria",
    requestedPlots: [3, 7, 12, 18],
    assignedPlot: null
  }
  */

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
    updateMap(); // re-render the map
  });
});

// 🧹 Close popup function
function closePopup() {
  document.getElementById("requestPopup").style.display = "none";
}
