async function updateMap() {
  const mapBackground = document.getElementById("mapBackground");
  mapBackground.innerHTML = ""; // Clear existing plots

  // Load plot positions
  const response = await fetch("plot-positions.json");
  const data = await response.json();
  const positions = data.plotPositions;
  const originalWidth = data.referenceImage.width;
  const originalHeight = data.referenceImage.height;

  const displayedWidth = mapBackground.clientWidth;
  const displayedHeight = mapBackground.clientHeight;

  if (displayedWidth === 0 || displayedHeight === 0) {
    console.warn("Map dimensions are zero — overlay may not render.");
  }

  const scaleX = displayedWidth / originalWidth;
  const scaleY = displayedHeight / originalHeight;

  positions.forEach(pos => {
    const plotData = housingData.find(p => p.plotNumber === pos.plotNumber);
    if (!plotData) return;

    const plot = document.createElement("div");
    plot.className = `house-plot ${plotData.status}`;
    plot.dataset.plot = plotData.plotNumber;
    plot.style.left = `${pos.x * scaleX}px`;
    plot.style.top = `${pos.y * scaleY}px`;
    plot.textContent = plotData.plotNumber;

    // Tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "plot-info";

    let info = `Plot ${plotData.plotNumber}<br>Status: ${plotData.status}`;
    if (Array.isArray(plotData.requestedBy) && plotData.requestedBy.length > 0) {
      info += `<br>Requested by: ${plotData.requestedBy.join(", ")}`;
    } else if (typeof plotData.requestedBy === "string" && plotData.requestedBy.trim() !== "") {
      info += `<br>Requested by: ${plotData.requestedBy}`;
    }

    if (plotData.assignedTo) {
      info += `<br>Assigned to: ${plotData.assignedTo}`;
    }

    tooltip.innerHTML = info;
    plot.appendChild(tooltip);
    mapBackground.appendChild(plot);
  });
}

document.addEventListener