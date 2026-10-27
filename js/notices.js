const noticesContainer = document.getElementById("noticesContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const resetButton = document.getElementById("resetButton");
const retryButton = document.getElementById("retryButton");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const resultsCount = document.getElementById("resultsCount");
const emptyMessage = document.getElementById("emptyMessage");
const pagination = document.getElementById("pagination");

let notices = [];
let currentPage = 1;
const itemsPerPage = 6;

async function loadNotices() {
    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    noticesContainer.replaceChildren();
    pagination.replaceChildren();
    resultsCount.textContent = "";

    try {
        const response = await fetch("../data/notices.json");

        if (!response.ok) {
            throw new Error("Failed to load notices");
        }

        notices = await response.json();

        populateCategories();
        currentPage = 1;
        displayNotices();
    } catch (error) {
        loadingMessage.hidden = true;
        errorMessage.hidden = false;
    }
}

function populateCategories() {
    const categories = [...new Set(notices.map(notice => notice.category))];

    categoryFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption);

    categories.sort().forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function getFilteredNotices() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOrder = sortSelect.value;

    let filteredNotices = notices.filter(notice => {
        const matchesSearch =
            notice.title.toLowerCase().includes(searchTerm) ||
            notice.description.toLowerCase().includes(searchTerm) ||
            notice.category.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            notice.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    filteredNotices.sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.date) - new Date(a.date);
        }

        if (sortOrder === "oldest") {
            return new Date(a.date) - new Date(b.date);
        }

        return a.title.localeCompare(b.title);
    });

    return filteredNotices;
}

function displayNotices() {
    loadingMessage.hidden = true;
    errorMessage.hidden = true;
    noticesContainer.replaceChildren();
    pagination.replaceChildren();

    const filteredNotices = getFilteredNotices();
    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageNotices = filteredNotices.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    resultsCount.textContent =
        `Showing ${pageNotices.length} of ${filteredNotices.length} notices`;

    emptyMessage.hidden = filteredNotices.length !== 0;

    pageNotices.forEach(notice => {
        const card = document.createElement("article");
        card.className = "content-card";

        const category = document.createElement("span");
        category.className = "badge";
        category.textContent = notice.category;

        const title = document.createElement("h3");
        title.textContent = notice.title;

        const date = document.createElement("p");
        date.textContent = `Date: ${new Date(notice.date + "T00:00:00").toLocaleDateString("en-IN")}`;

        const description = document.createElement("p");
        description.textContent = notice.description;

        card.append(category, title, date, description);
        noticesContainer.appendChild(card);
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
                displayNotices();
            });

            pagination.appendChild(button);
        }
    }
}

searchInput.addEventListener("input", () => {
    currentPage = 1;
    displayNotices();
});

categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    displayNotices();
});

sortSelect.addEventListener("change", () => {
    currentPage = 1;
    displayNotices();
});

resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    sortSelect.value = "newest";
    currentPage = 1;
    displayNotices();
});

retryButton.addEventListener("click", loadNotices);

loadNotices();