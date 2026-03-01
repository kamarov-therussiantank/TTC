// Mod Activity Snippet
whenContentInitialized().then(() => {
    const snippet = $(`
        <div id="modActivitySnippet" class="snippet">
            <div class="header">Mod Activity</div>
            <div id="mod-activity"></div>
        </div>
    `);

    $('#tertiaryContent').append(snippet);

    const usernamesToLookup = [
        'purup', 'bbc', 'foxter', 'dalek-buster', 'george8888', 'rhak', 'quickninja', 'lichen',
        'gentleman', 'redwind', 'triplestryke', 'kerosene', 'newthy32', 'blackhalo', 'amplitude',
        'nelfusion', 'giraffe', 'purplegnome', 'draculous', 'soulpanda', 'acehawk',
        'captainahvong', 'spiros04', 'onion', 'savageaimbot'
    ];

    let modEntries = [];

    function fetchModDataAndUpdateUI() {
        const playerDetailsList = [];
        let completedRequests = 0;
        modEntries = [];

        snippet.find('#mod-activity').empty();

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
                        playerDetailsList
                            .sort((a, b) => b.getLastLogin() - a.getLastLogin())
                            .slice(0, 10)
                            .forEach(player => {
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