async function createGridOverlay() {
  const mapBackground = document.getElementById("mapBackground");

  // Remove existing grid if it exists
  const existingGrid = document.getElementById("gridOverlay");
  if (existingGrid) {
    existingGrid.remove();
  }

  // Create grid container
  const gridOverlay = document.createElement("div");
  gridOverlay.id = "gridOverlay";
  gridOverlay.className = "grid-overlay";

  // Load reference dimensions from plot-positions.json
  const response = await fetch("plot-positions.json");
  const data = await response.json();
  const originalWidth = data.referenceImage.width;
  const originalHeight = data.referenceImage.height;

  const mapRect = mapBackground.getBoundingClientRect();
  const containerWidth = mapRect.width;
  const containerHeight = mapRect.height;

  const scaleX = containerWidth / originalWidth;
  const scaleY = containerHeight / originalHeight;

  const gridSpacing = 100;

  // Vertical lines
  for (let x = 0; x <= originalWidth; x += gridSpacing) {
    const scaledX = x * scaleX;
    const line = document.createElement("div");
    line.className = "grid-line vertical";
    line.style.left = scaledX + "px";
    line.style.top = "0px";
    line.style.height = containerHeight + "px";
    gridOverlay.appendChild(line);

    if (x > 0) {
      const label = document.createElement("div");
      label.className = "grid-label x-label";
      label.textContent = x;
      label.style.left = scaledX + "px";
      label.style.top = "10px";
      label.style.transform = "translate(-50%, -50%)";
      gridOverlay.appendChild(label);
    }
  }

  // Horizontal lines
  for (let y = 0; y <= originalHeight; y += gridSpacing) {
    const scaledY = y * scaleY;
    const line = document.createElement("div");
    line.className = "grid-line horizontal";
    line.style.top = scaledY + "px";
    line.style.left = "0px";
    line.style.width = containerWidth + "px";
    gridOverlay.appendChild(line);

    if (y > 0) {
      const label = document.createElement("div");
      label.className = "grid-label y-label";
      label.textContent = y;
      label.style.top = scaledY + "px";
      label.style.left = "10px";
      label.style.transform = "translate(-50%, -50%)";
      gridOverlay.appendChild(label);
    }
  }

  mapBackground.appendChild(gridOverlay);
}

function removeGridOverlay() {
  const gridOverlay = document.getElementById("gridOverlay");
  if (gridOverlay) {
    gridOverlay.remove();
  }
}

// Toggle grid with G key
document.addEventListener("keydown", function(event) {
  if (event.key === "g" || event.key === "G") {
    const gridOverlay = document.getElementById("gridOverlay");
    if (gridOverlay) {
      removeGridOverlay();
      console.log("Grid overlay removed");
    } else {
      // Delay to ensure map is rendered
      setTimeout(() => {
        createGridOverlay();
        console.log("Grid overlay created");
      }, 500);
    }
  }
});

// Debounced resize handling
let resizeTimeout;
window.addEventListener("resize", function () {
  const gridOverlay = document.getElementById("gridOverlay");
  if (gridOverlay) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createGridOverlay();
      console.log("Grid overlay redrawn after resize");
    }, 300);
  }
});
