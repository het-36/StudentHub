const studentsContainer = document.getElementById("studentsContainer");
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const sortSelect = document.getElementById("sortSelect");
const resetButton = document.getElementById("resetButton");
const retryButton = document.getElementById("retryButton");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const resultsCount = document.getElementById("resultsCount");
const emptyMessage = document.getElementById("emptyMessage");
const pagination = document.getElementById("pagination");

let students = [];
let currentPage = 1;
const itemsPerPage = 6;

async function loadStudents() {
    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    studentsContainer.replaceChildren();
    pagination.replaceChildren();
    resultsCount.textContent = "";

    try {
        const response = await fetch("../data/students.json");

        if (!response.ok) {
            throw new Error("Failed to load student data");
        }

        students = await response.json();
        populateDepartments();
        currentPage = 1;
        displayStudents();
    } catch (error) {
        loadingMessage.hidden = true;
        errorMessage.hidden = false;
    }
}

function populateDepartments() {
    const departments = [
        ...new Set(students.map(student => student.department))
    ];

    departmentFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Departments";
    departmentFilter.appendChild(allOption);

    departments.sort().forEach(department => {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
    });
}

function getFilteredStudents() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedDepartment = departmentFilter.value;
    const sortOrder = sortSelect.value;

    let filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm) ||
            student.studentId.toLowerCase().includes(searchTerm) ||
            student.department.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.city.toLowerCase().includes(searchTerm);

        const matchesDepartment =
            selectedDepartment === "all" ||
            student.department === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    filteredStudents.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === "za" ? -comparison : comparison;
    });

    return filteredStudents;
}

function displayStudents() {
    loadingMessage.hidden = true;
    errorMessage.hidden = true;
    studentsContainer.replaceChildren();
    pagination.replaceChildren();

    const filteredStudents = getFilteredStudents();
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageStudents = filteredStudents.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    resultsCount.textContent =
        `Showing ${pageStudents.length} of ${filteredStudents.length} students`;

    emptyMessage.hidden = filteredStudents.length !== 0;

    pageStudents.forEach(student => {
        const card = document.createElement("article");
        card.className = "content-card";

        const name = document.createElement("h3");
        name.textContent = student.name;

        const studentId = document.createElement("p");
        studentId.textContent = `Student ID: ${student.studentId}`;

        const department = document.createElement("span");
        department.className = "badge";
        department.textContent = student.department;

        const semester = document.createElement("p");
        semester.textContent = `Semester: ${student.semester}`;

        const email = document.createElement("p");
        email.textContent = `Email: ${student.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${student.city}`;

        card.append(
            name,
            studentId,
            department,
            semester,
            email,
            city
        );

        studentsContainer.appendChild(card);
    });

    if (totalPages > 1) {
        for (let page = 1; page <= totalPages; page++) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "page-button";
            button.textContent = page;
            button.disabled = page === currentPage;
            button.setAttribute("aria-label", `Go to page ${page}`);

            button.addEventListener("click", () => {
                currentPage = page;
                displayStudents();
            });

            pagination.appendChild(button);
        }
    }
}

searchInput.addEventListener("input", () => {
    currentPage = 1;
    displayStudents();
});

departmentFilter.addEventListener("change", () => {
    currentPage = 1;
    displayStudents();
});

sortSelect.addEventListener("change", () => {
    currentPage = 1;
    displayStudents();
});

resetButton.addEventListener("click", () => {
    searchInput.value = "";
    departmentFilter.value = "all";
    sortSelect.value = "az";
    currentPage = 1;
    displayStudents();
});

retryButton.addEventListener("click", loadStudents);

loadStudents();