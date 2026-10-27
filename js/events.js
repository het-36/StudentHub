
const eventsContainer = document.getElementById("eventsContainer");
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
const eventControls = document.getElementById("eventControls");

let events = [];
let currentPage = 1;
const eventsPerPage = 6;

async function loadEvents() {
    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    emptyMessage.hidden = true;
    eventsContainer.replaceChildren();
    pagination.replaceChildren();
    resultsCount.textContent = "";

    try {
        const response = await fetch("../data/events.json");

        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid event data");
        }

        events = data;
        loadingMessage.hidden = true;
        populateCategories();
        displayEvents();
    } catch (error) {
        console.error(error);
        loadingMessage.hidden = true;
        errorMessage.hidden = false;
    }
}

function populateCategories() {
    const categories = [...new Set(events.map(event => event.category))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

    categoryFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Categories";
    categoryFilter.appendChild(allOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function getFilteredEvents() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    return events.filter(event => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchText) ||
            event.description.toLowerCase().includes(searchText) ||
            event.venue.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            event.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
}

function sortEvents(eventList) {
    const sortValue = sortSelect.value;
    const sortedEvents = [...eventList];

    if (sortValue === "date-asc") {
        sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortValue === "date-desc") {
        sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortValue === "title-asc") {
        sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === "title-desc") {
        sortedEvents.sort((a, b) => b.title.localeCompare(a.title));
    }

    return sortedEvents;
}

function createEventCard(event) {
    const card = document.createElement("article");
    card.className = "card event-card";

    const category = document.createElement("span");
    category.className = "badge";
    category.textContent = event.category;

    const title = document.createElement("h3");
    title.textContent = event.title;

    const date = document.createElement("time");
    date.className = "event-date";
    date.dateTime = event.date;
    date.textContent = new Date(event.date + "T00:00:00").toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    const venue = document.createElement("p");
    venue.className = "event-venue";
    venue.textContent = `Venue: ${event.venue}`;

    const description = document.createElement("p");
    description.textContent = event.description;

    card.append(category, title, date, venue, description);

    return card;
}

function displayEvents() {
    const filteredEvents = sortEvents(getFilteredEvents());
    const totalEvents = filteredEvents.length;
    const totalPages = Math.ceil(totalEvents / eventsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    if (totalPages === 0) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * eventsPerPage;
    const paginatedEvents = filteredEvents.slice(
        startIndex,
        startIndex + eventsPerPage
    );

    eventsContainer.replaceChildren();
    pagination.replaceChildren();

    resultsCount.textContent = `Showing ${paginatedEvents.length} of ${totalEvents} events`;
    emptyMessage.hidden = totalEvents !== 0;

    paginatedEvents.forEach(event => {
        eventsContainer.appendChild(createEventCard(event));
    });

    createPagination(totalPages);
}

function createPagination(totalPages) {
    pagination.replaceChildren();

    if (totalPages <= 1) {
        return;
    }

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.textContent = "Previous";
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayEvents();
        }
    });

    pagination.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");
        pageButton.type = "button";
        pageButton.textContent = page;

        if (page === currentPage) {
            pageButton.setAttribute("aria-current", "page");
        }

        pageButton.addEventListener("click", () => {
            currentPage = page;
            displayEvents();
        });

        pagination.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayEvents();
        }
    });

    pagination.appendChild(nextButton);
}

searchInput.addEventListener("input", () => {
    currentPage = 1;
    displayEvents();
});

categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    displayEvents();
});

sortSelect.addEventListener("change", () => {
    currentPage = 1;
    displayEvents();
});

eventControls.addEventListener("submit", event => {
    event.preventDefault();
});

resetButton.addEventListener("click", () => {
    setTimeout(() => {
        searchInput.value = "";
        categoryFilter.value = "all";
        sortSelect.value = "date-asc";
        currentPage = 1;
        displayEvents();
    }, 0);
});

retryButton.addEventListener("click", loadEvents);

loadEvents();