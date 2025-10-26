document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  const plotSelect = document.getElementById("plotSelect");

  // Populate dropdown with available/requested plots
  plotSelect.innerHTML = ""; // Clear existing options

housingData.forEach((plot) => {
  const option = document.createElement("option");
  option.value = plot.plotNumber;
  option.textContent = `Plot ${plot.plotNumber} (${plot.status})`;

  if (plot.status === "assigned") {
    option.disabled = true;
  }

  plotSelect.appendChild(option);
});

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

    // Submit logic here — update housingData, assign requests, etc.
    // You can loop through selectedPlots and mark them as requested
    selectedPlots.forEach(plotNum => {
      const plot = housingData.find(p => p.plotNumber === plotNum);
      if (plot) {
        plot.status = "requested";
        plot.requestedBy = characterName;
      }
    });

    alert("Your request has been submitted!");
    form.reset();
    updateMap(); // re-render the map with updated statuses
  });
});
