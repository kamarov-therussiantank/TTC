// leaderboard snippet
whenContentInitialized().then(async () => {
    const snippet = document.createElement("div");
    snippet.id = "leaderboardSnippet";
    snippet.className = "snippet";

    snippet.innerHTML = `
        <div class="header">
            Leaderboard
        </div>
        <div class="content"></div>
            <select id="snippetStat" class="buttons">
                <option value="kills">Kills</option>
                <option value="victories">Victories</option>
                <option value="rank">Rank</option>
            </select>
    `;
    document.querySelector("#tertiaryContent").appendChild(snippet);
    await loadAndRenderLeaderboard("kills", "weekly");
    document
        .getElementById("snippetStat")
        .addEventListener("change", e => {
            loadAndRenderLeaderboard(e.target.value, "weekly");
        });
});
async function fetchLeaderboardData(stat = "kills", period = "weekly") {
    try {
        const url = `https://raw.githubusercontent.com/ForsakenGentleman/tt-leaderboards-current/main/${period}/${stat}.json?${Date.now()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let players = data.data.filter(p => p.username.toLowerCase() !== "laika");
        return players.slice(0, 10);
    } catch (err) {
        console.error("[Snippet] Failed to fetch:", err);
        document.querySelector("#leaderboardSnippet .content").innerHTML =
            "<p>Failed to fetch leaderboard!</p>";
        return null;
    }
}
function renderLeaderboardSnippet(players) {
    const container = document.querySelector("#leaderboardSnippet .content");
    container.innerHTML = "";
    if (!players || !players.length) {
        container.innerHTML = "<p class='empty'>No data available</p>";
        return;
    }
    const ul = document.createElement("ul");
    ul.className = "leaderboard-snippet-list";
    players.forEach((p, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="username">${p.username}</span>
            <span class="stat"> ${p.stat.toLocaleString("en-US")} </span>
        `;
        ul.appendChild(li);
    });
    container.appendChild(ul);
}
async function loadAndRenderLeaderboard(stat = "kills", period = "weekly") {
    const players = await fetchLeaderboardData(stat, period);
    renderLeaderboardSnippet(players);
}