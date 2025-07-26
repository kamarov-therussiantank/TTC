function whenContentInitialized() {
    return new Promise(resolve => {
        const check = () => {
            const container = document.querySelector('#tertiaryContent');
            if (container && typeof TankTrouble !== "undefined") {
                resolve();
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

function getTimeAgo(unixTimestampInSeconds) {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const secondsAgo = nowSeconds - unixTimestampInSeconds;

    const minute = 60;
    const hour = 3600;
    const day = 86400;
    const week = day * 7;
    const month = day * 30.44;
    const year = day * 365.25;

    if (secondsAgo < minute) {
        return `${secondsAgo} sec${secondsAgo !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < hour) {
        const minutes = Math.floor(secondsAgo / minute);
        return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < day) {
        const hours = Math.floor(secondsAgo / hour);
        return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < week) {
        const days = Math.floor(secondsAgo / day);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < month) {
        const weeks = Math.floor(secondsAgo / week);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (secondsAgo < year) {
        const months = Math.floor(secondsAgo / month);
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(secondsAgo / year);
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
}

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

    fetchModDataAndUpdateUI();
    setInterval(updateTimeAgoEntries, 60000);
    setInterval(fetchModDataAndUpdateUI, 60000);
});
