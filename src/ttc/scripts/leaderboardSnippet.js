// Leaderboard snippet
whenContentInitialized().then(async () => {
    const snippet = document.createElement("div");
    snippet.id = "leaderboardSnippet";
    snippet.className = "snippet";
    snippet.innerHTML = `
        <div class="header">Leaderboard</div>
        <div class="content"></div>
        <select id="snippetStat" class="buttons">
            <option value="kills">Kills</option>
            <option value="victories">Victories</option>
            <option value="rank">Rank</option>
        </select>
    `;
    document.querySelector("#tertiaryContent").appendChild(snippet);

//Script
const statSelect = document.getElementById("snippetStat");
    await loadAndRenderLeaderboard(statSelect.value);
    statSelect.addEventListener("change", e => {
        loadAndRenderLeaderboard(e.target.value);
    });
    setInterval(() => loadAndRenderLeaderboard(statSelect.value), 1000);
});
let emptyMessageIndex = 0;
const emptyMessage = [
    "Fetching.",
    "Fetching..",
    "Fetching...",
];
async function fetchOnlinePlayers() {
    const players = [];
    try {
        const gameStates = ClientManager.getClient().getAvailableGameStates();
        for (const gameState of gameStates) {
            const playerStates = gameState.getPlayerStates();
            for (const player of playerStates) {
                const playerId = player.getPlayerId();
                await new Promise(resolve => {
                    Backend.getInstance().getPlayerDetails(
                        result => {
                            if (result && result.getUsername().toLowerCase() !== "laika") {
                                players.push({
                                    playerId: playerId,
                                    username: result.getUsername(),
                                    kills: result.getKills(),
                                    victories: result.getVictories(),
                                    rank: result.getRank()
                                });
                            }
                            resolve();
                        },
                        err => resolve(),
                        null,
                        playerId,
                        Caches.getPlayerDetailsCache()
                    );
                });
            }
        }
    } catch (err) {
        console.error("Failed to fetch online players:", err);
    }
    return players;
}
function getTopPlayers(players, stat="kills") {
    return players.sort((a,b) => b[stat] - a[stat]).slice(0,10);
}
function renderLeaderboard(players, stat="kills") {
    const container = document.querySelector("#leaderboardSnippet .content");
    container.innerHTML = "";
    if (!players.length) {
    container.innerHTML = "<p class='empty' id='leaderboardEmpty'></p>";
    const msgElement = document.getElementById("leaderboardEmpty");
        function setNextMessage() {
            msgElement.textContent = emptyMessage[emptyMessageIndex];
            emptyMessageIndex = (emptyMessageIndex + 1) % emptyMessage.length;
        }
        setNextMessage();
        clearInterval(window.leaderboardEmptyInterval);
        window.leaderboardEmptyInterval = setInterval(setNextMessage, 1000);
    }
    const ul = document.createElement("ul");
    ul.className = "leaderboard-snippet-list";
    for (const p of players) {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="username">${p.username}</span>
            <span class="stat">${p[stat].toLocaleString("en-US")}</span>
        `;
        ul.appendChild(li);
    }

    container.appendChild(ul);
}
async function loadAndRenderLeaderboard(stat="kills") {
    const players = await fetchOnlinePlayers();
    const topPlayers = getTopPlayers(players, stat);
    renderLeaderboard(topPlayers, stat);
}