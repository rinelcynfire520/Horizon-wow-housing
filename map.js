async function updateMap() {
  const mapImage = document.getElementById("mapImage");
  const mapBackground = document.getElementById("mapContainer");

  // Remove existing plot markers
  const existingPlots = mapBackground.querySelectorAll(".house-plot");
  existingPlots.forEach(p => p.remove());

  // Load plot positions
  const response = await fetch("plot-positions.json");
  const data = await response.json();
  const positions = data.plotPositions;
  const originalWidth = data.referenceImage.width;
  const originalHeight = data.referenceImage.height;

  const displayedWidth = mapImage.offsetWidth;
  const displayedHeight = mapImage.offsetHeight;

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
    plot.style.top = `${pos.y * scale