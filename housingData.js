const housingData = [];

const assignedPlots = {
  0: "Neviriah",
  6: "Elvor",
  7: "GasLightatdawn",
  8: "Koren",
  12: "Sailer",
  13: "Sensayy",
  17: "Baelys",
  21: "guest",
  22: "Briar",
  23: "Lionhart",
  24: "Halfyy",
  28: "Aex",
  29: "Gwen",
  31: "Diff",
  32: "Kafka",
  38: "Nobbel",
  41: "Phate",
  43: "Cirillie",
  46: "Wacsnie",
  50: "Sungli"
};

for (let i = 0; i < 54; i++) {
  const assignedTo = assignedPlots[i] || null;
  const status = assignedTo ? "assigned" : "available";

  housingData.push({
    plotNumber: i,
    status: status,
    requestedBy: [],
    assignedTo: assignedTo
  });
}
