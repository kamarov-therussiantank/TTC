// Mod Activity Snippet
whenContentInitialized().then(() => {
    const snippet = $(`
        <div id="modActivitySnippet" class="snippet">
            <div class="header">Mod Activity</div>
            <div id="mod-activity"></div>
        </div>
    `);
    $('#tertiaryContent').append(snippet);

    //Script
    const usernamesToLookup = TankTrouble.WallOfFame.admins;
    let modEntries = [];
    let emptyMessageIndex = 0;
    const emptyMessage = [
        "Fetching.",
        "Fetching..",
        "Fetching...",
    ];
    function fetchModDataAndUpdateUI() {
        const playerDetailsList = [];
        let completedRequests = 0;
        modEntries = [];
        snippet.find('#mod-activity').empty();
        snippet.find('#mod-activity').html(`<p class="empty" id="modActivityEmpty"></p>`);
        const msgElement = document.getElementById("modActivityEmpty");
        function setNextMessage() {
            if (msgElement) {
                msgElement.textContent = emptyMessage[emptyMessageIndex];
                emptyMessageIndex = (emptyMessageIndex + 1) % emptyMessage.length;
            }
        }
        setNextMessage();
        clearInterval(window.modActivityEmptyInterval);
        window.modActivityEmptyInterval = setInterval(setNextMessage, 1000);
        usernamesToLookup.forEach(username => {
            Backend.getInstance().getPlayerDetailsByUsername(
                (result) => {
                    completedRequests++;
                    if (
                        result &&
                        typeof result.getUsername === 'function' &&
                        typeof result.getLastLogin === 'function' &&
                        typeof result.getGmLevel === 'function' &&
                        result.getGmLevel() >= 1
                    ) {
                        playerDetailsList.push(result);
                    }
                    if (completedRequests === usernamesToLookup.length) {
                    clearInterval(window.modActivityEmptyInterval);
                    snippet.find('#mod-activity').empty();
                        playerDetailsList
                        const sorted = playerDetailsList
                            .sort((a, b) => b.getLastLogin() - a.getLastLogin())
                            .slice(0, 3)
                            if (!sorted.length) {
                            snippet.find('#mod-activity').html(`<p class="empty" id="modActivityEmpty"></p>`);
                            const msgElement = document.getElementById("modActivityEmpty");
                            function setNextMessage() {
                                msgElement.textContent = emptyMessage[emptyMessageIndex];
                                emptyMessageIndex = (emptyMessageIndex + 1) % emptyMessage.length;
                            }
                            setNextMessage();
                            clearInterval(window.modActivityEmptyInterval);
                            window.modActivityEmptyInterval = setInterval(setNextMessage, 1000);
                            return;
                            }
                            sorted.forEach(player => {
                                const username = player.getUsername();
                                const lastLogin = parseInt(player.getLastLogin(), 10);
                                const userRow = $(`
                                    <div class="mod-entry">
                                        <span class="mod-username"><div>${username}</div></span>
                                        <span class="mod-last-login" title="${new Date(lastLogin * 1000).toLocaleString()}">${getTimeAgo(lastLogin)}</span>
                                    </div>
                                `);
                                snippet.find('#mod-activity').append(userRow);

                                modEntries.push({
                                    lastLogin,
                                    element: userRow.find('.mod-last-login')
                                });
                            });
                        updateTimeAgoEntries();
                    }
                },
                (errorMessage) => {
                    completedRequests++;
                    snippet.find('#mod-activity').append(`<p>Error fetching player details: ${errorMessage}</p>`);
                },
                null,
                username,
                Caches.getPlayerDetailsCache()
            );
        });
    }
    function updateTimeAgoEntries() {
        modEntries.forEach(({ lastLogin, element }) => {
            element.text(getTimeAgo(lastLogin));
        });
    }
    let nextRefreshTimestamp = null;
    function scheduleNextRealTimeRefresh() {
        const now = Date.now();
        const nextMinute = new Date(now);
        nextMinute.setSeconds(0);
        nextMinute.setMilliseconds(0);
        nextMinute.setMinutes(nextMinute.getMinutes() + 1);
        nextRefreshTimestamp = nextMinute.getTime();
        const delay = nextRefreshTimestamp - now;
        setTimeout(() => {
            fetchModDataAndUpdateUI();
            scheduleNextRealTimeRefresh();
        }, delay);
    }
    fetchModDataAndUpdateUI();
    scheduleNextRealTimeRefresh();
    setInterval(updateTimeAgoEntries, 60000);
});