let defaultFlights = [
    { flight: "AI-101", airline: "Air India", aircraft: "Medium", type: "Arrival", start: "09:00", end: "10:00", gate: "A1" },
    { flight: "6E-205", airline: "IndiGo", aircraft: "Medium", type: "Departure", start: "10:00", end: "11:00", gate: "A2" }
];

let schedules = JSON.parse(localStorage.getItem("webforgeGates")) || defaultFlights;

function saveData() {
    localStorage.setItem("webforgeGates", JSON.stringify(schedules));
}

function assign() {
    let flight = document.getElementById("flight").value.trim().toUpperCase();
    let airline = document.getElementById("airline").value.trim();
    let aircraft = document.getElementById("aircraft").value;
    let flightType = document.getElementById("flightType").value;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let gate = document.getElementById("gate").value;

    if (flight == "" || airline == "" || start == "" || end == "") {
        showMsg("Error: Please fill all flight details!", "#fee2e2", "#991b1b");
        return;
    }

    if (end <= start) {
        showMsg("Error: End time must be after Start time!", "#fee2e2", "#991b1b");
        return;
    }

    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].flight == flight) {
            showMsg("Conflict: Flight " + flight + " is already scheduled!", "#fee2e2", "#991b1b");
            return;
        }
    }

    if ((gate == "A1" || gate == "A2") && aircraft == "Large") {
        showMsg("Size Conflict: Large aircraft cannot fit in Gate " + gate + "!", "#fee2e2", "#991b1b");
        return;
    }
    if (gate == "B1" && aircraft == "Small") {
        showMsg("Size Conflict: Small aircraft must use Gate A1 or A2!", "#fee2e2", "#991b1b");
        return;
    }
    if (gate == "B2" && aircraft != "Large") {
        showMsg("Size Conflict: Gate B2 is reserved for Large aircraft only!", "#fee2e2", "#991b1b");
        return;
    }

    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].gate == gate) {
            if (start < schedules[i].end && end > schedules[i].start) {
                showMsg("Schedule Conflict: Gate " + gate + " is busy with " + schedules[i].flight + " (" + schedules[i].start + " - " + schedules[i].end + ")!", "#fee2e2", "#991b1b");
                return;
            }
        }
    }

    schedules.push({ flight: flight, airline: airline, aircraft: aircraft, type: flightType, start: start, end: end, gate: gate });
    saveData();

    showMsg("Success: Flight " + flight + " assigned to Gate " + gate + "! Check Live Monitor.", "#dcfce7", "#166534");
    document.getElementById("flight").value = "";
    document.getElementById("airline").value = "";
}

function showMsg(text, bg, color) {
    let result = document.getElementById("result");
    if (result) {
        result.innerHTML = text;
        result.style.backgroundColor = bg;
        result.style.color = color;
    }
}

function loadMonitorPage() {
    let tbody = document.getElementById("flightBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    for (let i = 0; i < schedules.length; i++) {
        let item = schedules[i];
        tbody.innerHTML +=
            "<tr>" +
            "<td><strong>" + item.flight + "</strong></td>" +
            "<td>" + item.airline + "</td>" +
            "<td>" + item.aircraft + "</td>" +
            "<td>" + item.type + "</td>" +
            "<td>" + item.start + " - " + item.end + "</td>" +
            "<td><strong>" + item.gate + "</strong></td>" +
            "<td><span class='badge-ok'>Assigned</span></td>" +
            "<td><button class='del-btn' onclick='removeFlight(" + i + ")'>Remove</button></td>" +
            "</tr>";
    }

    let allGates = ["A1", "A2", "B1", "B2"];
    let busyCount = 0;

    for (let g = 0; g < allGates.length; g++) {
        let gateName = allGates[g];
        let count = 0;
        for (let i = 0; i < schedules.length; i++) {
            if (schedules[i].gate == gateName) count++;
        }

        let cell = document.getElementById("status-" + gateName);
        if (count > 0) {
            cell.innerHTML = "Occupied (" + count + ")";
            cell.className = "occupied";
            busyCount++;
        } else {
            cell.innerHTML = "Available";
            cell.className = "available";
        }
    }

    document.getElementById("free-gates").innerHTML = 4 - busyCount;
    document.getElementById("busy-gates").innerHTML = busyCount;
}

function removeFlight(index) {
    schedules.splice(index, 1);
    saveData();
    loadMonitorPage();
}

loadMonitorPage();
