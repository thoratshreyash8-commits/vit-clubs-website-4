/* ================= PAGE LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {
    initializeCards();
    restoreJoinedClubs();

    // Hide admin panel on load (only on index.html)
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) adminPanel.style.display = "none";
});

/* ================= OOP: Club Class ================= */
class Club {
    constructor(name) {
        this.name = name;
    }

    saveCommittee(data) {
        localStorage.setItem(this.name + "_committee", data);
    }

    saveStory(story) {
        localStorage.setItem(this.name + "_story", story);
    }

    getStory() {
        return localStorage.getItem(this.name + "_story");
    }
}

/* ================= CLUB CARDS ================= */
function initializeCards() {
    const cards = document.querySelectorAll(".club-card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const page = card.getAttribute("data-page");
            window.location.href = page;
        });

        const button = card.querySelector(".join-btn");
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            handleJoin(card);
        });
    });
}

/* ================= JOIN LOGIC ================= */
function handleJoin(card) {
    const clubName = card.getAttribute("data-club");

    if (localStorage.getItem(clubName)) {
        alert(`You have already joined ${clubName}`);
        return;
    }

    if (confirm(`Do you want to join ${clubName}?`)) {
        localStorage.setItem(clubName, "joined");
        updateJoinedUI(card);
        alert(`Welcome to ${clubName}! 🎉`);
    }
}

function restoreJoinedClubs() {
    const cards = document.querySelectorAll(".club-card");
    cards.forEach(card => {
        if (localStorage.getItem(card.getAttribute("data-club"))) {
            updateJoinedUI(card);
        }
    });
}

function updateJoinedUI(card) {
    const button = card.querySelector(".join-btn");
    button.textContent = "Joined ✔";
    button.style.background = "#22c55e";
    button.disabled = true;
}

/* ================= ADMIN PANEL ================= */
function getSelectedClub() {
    const club = document.getElementById("clubSelect").value;
    if (!club) {
        alert("Please select a club");
        return null;
    }
    return club;
}

function updateCommittee() {
    const clubName = getSelectedClub();
    if (!clubName) return;

    const data = document.getElementById("committeeInput").value;
    if (!data) {
        alert("Committee cannot be empty");
        return;
    }

    new Club(clubName).saveCommittee(data);
    document.getElementById("adminMsg").innerText =
        "Committee updated for " + clubName;
}

function updateStory() {
    const clubName = getSelectedClub();
    if (!clubName) return;

    const story = document.getElementById("storyInput").value;
    if (story.length < 10) {
        alert("Story must be at least 10 characters");
        return;
    }

    new Club(clubName).saveStory(story);
    document.getElementById("adminMsg").innerText =
        "Success story updated for " + clubName;
}

function sendEmail() {
    const clubName = getSelectedClub();
    if (!clubName) return;

    const story = new Club(clubName).getStory();
    if (!story) {
        alert("No success story available");
        return;
    }

    window.location.href =
        "mailto:students@vit.edu?subject=" +
        clubName +
        " Success Story&body=" +
        encodeURIComponent(story);
}

/* ================= ADMIN LOGIN ================= */
localStorage.setItem("adminUser", "shreyash");
localStorage.setItem("adminPass", "vit123");

function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function login() {
    const u = document.getElementById("adminUser").value;
    const p = document.getElementById("adminPass").value;

    if (
        u === localStorage.getItem("adminUser") &&
        p === localStorage.getItem("adminPass")
    ) {
        alert("Login Successful");
        document.getElementById("adminPanel").style.display = "block";
        closeLogin();
        document.getElementById("logoutBtn").style.display = "inline-block";
    } else {
        document.getElementById("loginMsg").innerText = "Invalid Credentials";
    }
}

function logout() {
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
}
