document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  const plotSelect = document.getElementById("plotSelect");

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

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const characterName = document.getElementById("characterName").value.trim();
    const selectedPlots = Array.from(plotSelect.selectedOptions).map(opt => parseInt(opt.value));

    if (!characterName) {
      alert("Please enter your character name.");
      return;
    }

    if (selectedPlots.length === 0 || selectedPlots.length > 4) {
      alert("Please select between 1 and 4 plots.");
      return;
    }
	if (plot.status !== "available") {
  alert(`Plot ${plotNum} is not available.`);
  return;
}

    // Update housingData with requested status
    selectedPlots.forEach(plotNum => {
      const plot = housingData.find(p => p.plotNumber === plotNum);
      if (plot) {
        plot.status = "requested";
        plot.requestedBy = characterName;
      }
    });

if (Array.isArray(plot.requestedBy)) {
  labelText += ` by ${plot.requestedBy.join(", ")}`;
} else if (typeof plot.requestedBy === "string" && plot.requestedBy.trim() !== "") {
  labelText += ` by ${plot.requestedBy}`;
}

    alert("Your request has been submitted!");
    form.reset();
    updateMap(); // re-render the map with updated statuses
  });
});
