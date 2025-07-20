//Visits Snippet
function whenContentInitialized() {
    return new Promise(resolve => {
        const check = () => {
            const container = document.querySelector('#secondaryContent');
            if (container && typeof TankTrouble !== "undefined") {
                resolve();
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}


whenContentInitialized().then(() => {

    var snippet = $(`
    <div id="visitsSnippet" class="snippet">
            <div class="header">Visits</div>
            <div id="stats1">
            Since 2007-12-16
            <div id="visits">Fetching...</div>Tank Owners:
            <div id="tankOwners">...</div>
		</div>
        <div id="stats2">
			Online:
            <div id="playersOnline">...</div>
            <br>
			Games:
            <div id="gamesMade">...</div>
        </div>
    </div>
    `);

    var content = $('<div></div>');
    
    TankTrouble.Statistics._updateStatistics = function() {
    Backend.getInstance().getStatistics((result) => {
        if (typeof result === 'object') {
            this._updateNumber($('#visits'), result.visits);
            this._updateNumber($('#playersOnline'), result.onlineStatistics.playerCount);
            this._updateNumber($('#tankOwners'), result.tankOwners);
            this._updateNumber($('#gamesMade'), result.onlineStatistics.gameCount);
         }
      });
    };

 snippet.append(content);
$('#secondaryContent').append(snippet);

});

