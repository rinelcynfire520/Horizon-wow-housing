document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("requestForm");
  const plotSelectContainer = document.getElementById("plotSelectContainer");

  // Create checkboxes for all available plots
  for (let i = 0; i < housingData.length; i++) {
    const plot = housingData[i];
    if (plot.status !== "assigned") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `plot-${plot.plotNumber}`;
      checkbox.name = "plotRequest";
      checkbox.value = plot.plotNumber;

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = `Plot ${plot.plotNumber}`;

      const wrapper = document.createElement("div");
      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);

      plotSelectContainer.appendChild(wrapper);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const characterName = document.getElementById("characterName").value.trim();
    const selectedPlots = Array.from(document.querySelectorAll('input[name="plotRequest"]:checked'))
      .map(cb => parseInt(cb.value));

    if (!characterName) {
      alert("Please enter your character name.");
      return;
    }

    if (selectedPlots.length === 0 || selectedPlots.length > 4) {
      alert("Please select between 1 and 4 plots.");
      return;
    }

    selectedPlots.forEach(plotNumber => {
      const plot = housingData.find(p => p.plotNumber === plotNumber);
      if (plot && !plot.requestedBy.includes(characterName)) {
        plot.requestedBy.push(characterName);
        if (plot.status === "available") {
          plot.status = "requested";
        }
      }
    });

    alert("Your request has been submitted!");
    form.reset();
    updateMap(); // re-render the map with updated statuses
  });
});
