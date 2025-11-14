// Visits Snippet
// Displays number of visits, tank owners, online players, and games made
whenContentInitialized().then(() => {

    const snippet = $(`
    <div id="visitsSnippet" class="snippet">
        <div class="header">Visits</div>
        <div id="stats1">
            Since 2007-12-16
            <div id="visits">Fetching...</div>
            Tank Owners:
            <div id="tankOwners">...</div>
        </div>
        <div id="stats2">
            Online:
            <div id="playersOnline">...</div>
            <br>
            Games:
            <div id="gamesMade">...</div>
            <br>
            <div style="gap:10px;">
                <button id="toggleStats">Global</button>
            </div>
        </div>
    </div>
    `);

    $('#secondaryContent').append(snippet);

    let statsType = 'global';

    function updateNumber(element, number, label = '') {
        if (!element || number === undefined) return;
        element.text(`${number} ${label}`.trim());
    }

    function updateStatistics() {
        if (statsType === 'global') {
            Backend.getInstance().getStatistics((result) => {
                if (typeof result === 'object') {
                    updateNumber($('#visits'), result.visits);
                    updateNumber($('#tankOwners'), result.tankOwners);
                    updateNumber($('#playersOnline'), result.onlineStatistics.playerCount);
                    updateNumber($('#gamesMade'), result.onlineStatistics.gameCount);
                }
            });
        } else if (statsType === 'local') {
            const serverId = ClientManager.multiplayerServerId;
            ClientManager._getSelectedServerStats(serverId, (_success, _serverId, _latency, gameCount, playerCount) => {
                updateNumber($('#playersOnline'), playerCount);
                updateNumber($('#gamesMade'), gameCount);
            });
        }
    }

    $('#toggleStats').on('click', function () {
        statsType = statsType === 'global' ? 'local' : 'global';
        $(this).text(statsType.charAt(0).toUpperCase() + statsType.slice(1));
        updateStatistics();
    });

    ClientManager.getClient().addEventListener((_, evt) => {
        if (evt === TTClient.EVENTS.PLAYERS_AUTHENTICATED) {
            updateStatistics();
        }
    });

    updateStatistics();
});