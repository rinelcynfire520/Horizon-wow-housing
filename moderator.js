document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  const moderatorEmailInput = document.getElementById("moderatorEmail");
  const moderatorPanel = document.getElementById("moderatorPanel");
  const requestList = document.getElementById("requestList");

  const approvedModerators = [
    "rinelcynfire@gmail.com", // Replace with real moderator emails
    "another@mod.com"
  ];

  loginButton.addEventListener("click", () => {
    const email = moderatorEmailInput.value.trim().toLowerCase();
    if (approvedModerators.includes(email)) {
      moderatorPanel.style.display = "block";
      renderRequests();
    } else {
      alert("Access denied. Not a recognized moderator.");
    }
  });

  function renderRequests() {
    requestList.innerHTML = "";

    housingData.forEach(plot => {
      if (plot.requestedBy.length > 0 || plot.status === "assigned") {
        const div = document.createElement("div");
        div.style.marginBottom = "12px";

        let info = `Plot ${plot.plotNumber} - Status: ${plot.status}`;
        if (plot.requestedBy.length > 0) {
          info += ` | Requested by: ${plot.requestedBy.join(", ")}`;
        }
        if (plot.assignedTo) {
          info += ` | Assigned to: ${plot.assignedTo}`;
        }

        div.textContent = info;

        // Assign button
        if (plot.status !== "assigned") {
          const assignInput = document.createElement("input");
          assignInput.type = "text";
          assignInput.placeholder = "Assign to character";
          assignInput.style.marginLeft = "10px";

          const assignBtn = document.createElement("button");
          assignBtn.textContent = "Assign";
          assignBtn.onclick = () => {
            const name = assignInput.value.trim();
            if (name) {
              plot.assignedTo = name;
              plot.status = "assigned";
              plot.requestedBy = [];
              updateMap();
              renderRequests();
            }
          };

          div.appendChild(assignInput);
          div.appendChild(assignBtn);
        }

        // Unassign button
        if (plot.status === "assigned") {
          const unassignBtn = document.createElement("button");
          unassignBtn.textContent = "Unassign";
          unassignBtn.style.marginLeft = "10px";
          unassignBtn.onclick = () => {
            plot.assignedTo = null;
            plot.status = "available";
            updateMap();
            renderRequests();
          };
          div.appendChild(unassignBtn);
        }

        requestList.appendChild(div);
      }
    });
  }
});
