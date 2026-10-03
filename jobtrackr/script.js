console.log("JobTrackr JS connected");

let applications = JSON.parse(localStorage.getItem("applications")) || [];

// Track edited application
let editingIndex = null;


// Form elements
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("applied-date");
const statusInput = document.getElementById("status");
const navAddBtn = document.getElementById("nav-add-btn");
const sectionAddBtn = document.getElementById("section-add-btn");
navAddBtn.addEventListener("click", function () {
    companyInput.focus();
});

sectionAddBtn.addEventListener("click", function () {
    companyInput.focus();
});

const addApplicationBtn = document.getElementById("add-application-btn");
const applicationsList = document.getElementById("applications-list");

// Search & Filter
const searchInput = document.getElementById("search-input");
const filterStatus = document.getElementById("filter-status");


// Dashboard counters
const totalCount = document.getElementById("total-count");
const interviewCount = document.getElementById("interview-count");
const selectedCount = document.getElementById("selected-count");
const rejectedCount = document.getElementById("rejected-count");


// Add / Update Application
addApplicationBtn.addEventListener("click", function () {

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const date = dateInput.value;
    const status = statusInput.value;

    // Validation
    if (company === "" || role === "" || date === "") {
        alert("Please fill all required fields.");
        return;
    }

    const application = {
        company,
        role,
        date,
        status
    };


    // Update existing application
    if (editingIndex !== null) {

        applications[editingIndex] = application;

        editingIndex = null;

        addApplicationBtn.textContent = "Add Application";

    }

    // Add new application
    else {

        applications.push(application);

    }


    // Save to LocalStorage
    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );


    // Reset form
    companyInput.value = "";
    roleInput.value = "";
    dateInput.value = "";
    statusInput.value = "Applied";


    renderApplications();
    updateStats();

});


// Search
searchInput.addEventListener("input", function () {

    renderApplications();

});


// Filter
filterStatus.addEventListener("change", function () {

    renderApplications();

});


// Render Applications
function renderApplications() {

    applicationsList.innerHTML = "";


    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = filterStatus.value;


    const filteredApplications = applications.filter(function (application) {

        const matchesSearch =
            application.company.toLowerCase().includes(searchText) ||
            application.role.toLowerCase().includes(searchText);


        const matchesStatus =
            selectedStatus === "All" ||
            application.status === selectedStatus;


        return matchesSearch && matchesStatus;

    });


    // No matching applications
    if (filteredApplications.length === 0) {

        applicationsList.innerHTML = `
            <p>No applications found.</p>
        `;

        return;
    }


    filteredApplications.forEach(function (application) {

        const card = document.createElement("div");

        card.classList.add("application-card");


        card.innerHTML = `
            <div>
                <h3>${application.company}</h3>
                <p>${application.role}</p>
                <p>${application.date}</p>
                <span class="status-badge ${application.status.toLowerCase()}">
    ${application.status}
</span>

                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;


        const editBtn = card.querySelector(".edit-btn");
        const deleteBtn = card.querySelector(".delete-btn");


        // Edit
        editBtn.addEventListener("click", function () {

            const index = applications.indexOf(application);

            editingIndex = index;

            companyInput.value = application.company;
            roleInput.value = application.role;
            dateInput.value = application.date;
            statusInput.value = application.status;

            addApplicationBtn.textContent = "Update Application";

        });


        // Delete
        deleteBtn.addEventListener("click", function () {

            const index = applications.indexOf(application);

            applications.splice(index, 1);

            localStorage.setItem(
                "applications",
                JSON.stringify(applications)
            );

            renderApplications();
            updateStats();

        });


        applicationsList.appendChild(card);

    });

}


// Update Dashboard Stats
function updateStats() {

    totalCount.textContent = applications.length;


    const interviews = applications.filter(function (application) {
        return application.status === "Interview";
    });


    const selected = applications.filter(function (application) {
        return application.status === "Selected";
    });


    const rejected = applications.filter(function (application) {
        return application.status === "Rejected";
    });


    interviewCount.textContent = interviews.length;
    selectedCount.textContent = selected.length;
    rejectedCount.textContent = rejected.length;

}


// Load saved applications
renderApplications();
updateStats();