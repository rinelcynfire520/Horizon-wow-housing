document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchPlotNumber");
  const searchResult = document.getElementById("searchResult");

  searchButton.addEventListener("click", () => {
    const plotNumber = parseInt(searchInput.value.trim());
    const plot = housingData.find(p => p.plotNumber === plotNumber);

    if (isNaN(plotNumber) || plotNumber < 0 || plotNumber >= housingData.length) {
      searchResult.textContent = "Please enter a valid plot number.";
      return;
    }

    if (!plot) {
      searchResult.textContent = "Plot not found.";
      return;
    }

    // Build result text
    let resultText = `Plot ${plot.plotNumber} is currently ${plot.status}.`;

    if (plot.requestedBy.length > 0) {
      resultText += ` Requested by: ${plot.requestedBy.join(", ")}.`;
    }

    if (plot.assignedTo) {
      resultText += ` Assigned to: ${plot.assignedTo}.`;
    }

    searchResult.textContent = resultText;

    // Optional: visually highlight the plot
    const plotElement = document.querySelector(`.house-plot[data-plot="${plot.plotNumber}"]`);
    if (plotElement) {
      plotElement.style.outline = "2px solid yellow";
      plotElement.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        plotElement.style.outline = "";
      }, 3000);
    }
  });
});
