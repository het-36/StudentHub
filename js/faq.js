const faqContainer = document.getElementById("faqContainer");
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

let faqs = [];
let currentPage = 1;
const itemsPerPage = 6;

async function loadFAQs() {
    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    faqContainer.replaceChildren();
    pagination.replaceChildren();
    resultsCount.textContent = "";

    try {
        const response = await fetch("../data/faqs.json");

        if (!response.ok) {
            throw new Error("Failed to load FAQs");
        }

        faqs = await response.json();

        populateCategories();
        currentPage = 1;
        displayFAQs();
    } catch (error) {
        loadingMessage.hidden = true;
        errorMessage.hidden = false;
    }
}

function populateCategories() {
    const categories = [...new Set(faqs.map(faq => faq.category))];

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

function getFilteredFAQs() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOrder = sortSelect.value;

    let filteredFAQs = faqs.filter(faq => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm) ||
            faq.answer.toLowerCase().includes(searchTerm) ||
            faq.category.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            faq.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    filteredFAQs.sort((a, b) => {
        const comparison = a.question.localeCompare(b.question);
        return sortOrder === "za" ? -comparison : comparison;
    });

    return filteredFAQs;
}

function displayFAQs() {
    loadingMessage.hidden = true;
    errorMessage.hidden = true;
    faqContainer.replaceChildren();
    pagination.replaceChildren();

    const filteredFAQs = getFilteredFAQs();
    const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageFAQs = filteredFAQs.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    resultsCount.textContent =
        `Showing ${pageFAQs.length} of ${filteredFAQs.length} FAQs`;

    emptyMessage.hidden = filteredFAQs.length !== 0;

    pageFAQs.forEach(faq => {
        const card = document.createElement("article");
        card.className = "content-card";

        const category = document.createElement("span");
        category.className = "badge";
        category.textContent = faq.category;

        const question = document.createElement("h3");
        question.textContent = faq.question;

        const answer = document.createElement("p");
        answer.textContent = faq.answer;

        card.append(category, question, answer);
        faqContainer.appendChild(card);
    });

    if (totalPages > 1) {
        for (let page = 1; page <= totalPages; page++) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "page-button";
            button.textContent = page;
            button.disabled = page === currentPage;
            button.setAttribute(
                "aria-label",
                `Go to page ${page}`
            );

            button.addEventListener("click", () => {
                currentPage = page;
                displayFAQs();
            });

            pagination.appendChild(button);
        }
    }
}

searchInput.addEventListener("input", () => {
    currentPage = 1;
    displayFAQs();
});

categoryFilter.addEventListener("change", () => {
    currentPage = 1;
    displayFAQs();
});

sortSelect.addEventListener("change", () => {
    currentPage = 1;
    displayFAQs();
});

resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    sortSelect.value = "az";
    currentPage = 1;
    displayFAQs();
});

retryButton.addEventListener("click", loadFAQs);

loadFAQs();