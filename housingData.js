const housingData = [];

const assignedPlots = {

};

// Total plots based on plot-positions.json
const totalPlots = 55;

for (let i = 0; i < totalPlots; i++) {
  const assignedTo = assignedPlots[i] || null;
  const status = assignedTo ? "assigned" : "available";

  housingData.push({
    plotNumber: i,
    status: status,
    requestedBy: "", // Can be updated to a string or array later
    assignedTo: assignedTo
  });
}
