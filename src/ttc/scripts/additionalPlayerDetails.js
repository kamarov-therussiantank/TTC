// Additional Player Details
whenContentInitialized().then(() => {
	Loader.interceptFunction(TankTrouble.TankInfoBox, '_initialize', (original, ...args) => {
		original(...args);
		TankTrouble.TankInfoBox.infoExpDiv = $('<div class="exp tooltipstered"/>');
		TankTrouble.TankInfoBox.infoExpTextDiv = $('<div class="progress"/>');
		TankTrouble.TankInfoBox.infoExpBorder = $('<div class="border"/>');
		TankTrouble.TankInfoBox.infoExpBar = $('<div class="exp-bar"/>');
		TankTrouble.TankInfoBox.infoExpText = $('<span class="exp-text"/>');
		TankTrouble.TankInfoBox.infoExpTextDiv
			.append(TankTrouble.TankInfoBox.infoExpBorder)
			.append(TankTrouble.TankInfoBox.infoExpBar)
			.append(TankTrouble.TankInfoBox.infoExpText);
		TankTrouble.TankInfoBox.infoExpDiv.append(TankTrouble.TankInfoBox.infoExpTextDiv);
		TankTrouble.TankInfoBox.infoExpDiv.insertAfter(TankTrouble.TankInfoBox.infoRank);
		TankTrouble.TankInfoBox.infoAboutDiv = $('<div class="tooltipstered"/>');
		TankTrouble.TankInfoBox.infoAboutTextDiv = $('<div class="about-container"/>');
		TankTrouble.TankInfoBox.infoAboutText = $('<span class="about-text"/>');
		TankTrouble.TankInfoBox.infoAboutTextDiv.append(TankTrouble.TankInfoBox.infoAboutText);
		TankTrouble.TankInfoBox.infoAboutDiv.append(TankTrouble.TankInfoBox.infoAboutTextDiv);
		TankTrouble.TankInfoBox.infoAboutDiv.insertAfter(TankTrouble.TankInfoBox.infoName);
		TankTrouble.TankInfoBox.infoBannedPlayerDiv = $('<div class="tooltipstered"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerTextDiv = $('<div class="bannedText-container"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerText = $('<span class="bannedText-text"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerTextDiv.append(TankTrouble.TankInfoBox.infoBannedPlayerText);
		TankTrouble.TankInfoBox.infoBannedPlayerDiv.append(TankTrouble.TankInfoBox.infoBannedPlayerTextDiv);
		TankTrouble.TankInfoBox.infoBannedPlayerDiv.insertAfter(TankTrouble.TankInfoBox.infoRank);
		TankTrouble.TankInfoBox.infoExpDiv.tooltipster({
			position: 'right',
			offsetX: 5
		});
		TankTrouble.TankInfoBox.infoExpDiv.hide();
	});
	Loader.interceptFunction(TankTrouble.TankInfoBox, 'show', (original, ...args) => {
    original(...args);

    TankTrouble.TankInfoBox.infoExpDiv.tooltipster('content', 'Classic EXP');
    const [,, playerId] = args;

    Backend.getInstance().getPlayerDetails(result => {
        if (typeof result === 'object') {
            const resultPlayerId = result.getPlayerId();
            const banned = result.getBanned();
            const classicPlayer = result.getExperience();
            const kills = result.getKills();
            const victories = result.getVictories();
            const exp = kills + victories + classicPlayer;

            if (classicPlayer && classicPlayer > 0) {
                TankTrouble.TankInfoBox.infoExpDiv.show();
			TankTrouble.TankInfoBox.infoExpText.text(`${exp}`);
			
            } else {
                TankTrouble.TankInfoBox.infoExpDiv.hide();
            }
				if (banned) {
					TankTrouble.TankInfoBox.infoAboutDiv.show();
					TankTrouble.TankInfoBox.infoAboutText.text(`#${resultPlayerId}`);
					TankTrouble.TankInfoBox.infoBannedPlayerDiv.show();
					TankTrouble.TankInfoBox.infoBannedPlayerText.text(
						`Player has been permanently banned because of rules violation. Player statistics are counted towards the scrapyard.`
					);

					document.querySelector(".about-container")?.style && (document.querySelector(".about-container").style.color = "#fff");
					document.querySelector("#tankinfo .rank")?.style && (document.querySelector("#tankinfo .rank").style.display = "none");
					document.querySelector("#tankinfo .xp")?.style && (document.querySelector("#tankinfo .xp").style.display = "none");
					document.querySelector(".exp.tooltipstered")?.style && (document.querySelector(".exp.tooltipstered").style.display = "none");
					document.querySelector("#tankinfo table")?.style && (document.querySelector("#tankinfo table").style.display = "none");
					document.querySelector(".actions.centered")?.style && (document.querySelector(".actions.centered").style.display = "none");
				} else if (resultPlayerId) {
					TankTrouble.TankInfoBox.infoBannedPlayerDiv.hide();
					TankTrouble.TankInfoBox.infoAboutDiv.show();
					TankTrouble.TankInfoBox.infoAboutText.text(`#${resultPlayerId}`);

					document.querySelector(".about-container")?.style && (document.querySelector(".about-container").style.color = "");
					document.querySelector("#tankinfo .rank")?.style && (document.querySelector("#tankinfo .rank").style.display = "");
					document.querySelector("#tankinfo .xp")?.style && (document.querySelector("#tankinfo .xp").style.display = "");
					document.querySelector("#tankinfo table")?.style && (document.querySelector("#tankinfo table").style.display = "");
					document.querySelector(".actions.centered")?.style && (document.querySelector(".actions.centered").style.display = "");
				} else {
					TankTrouble.TankInfoBox.infoAboutDiv.hide();
					document.querySelector(".exp.tooltipstered")?.style && (document.querySelector(".exp.tooltipstered").style.display = "");
				}
			}
		}, () => {}, () => {}, playerId, Caches.getPlayerDetailsCache());
	});
	// Additional Account Details
	Loader.interceptFunction(TankTrouble.AccountOverlay, '_initialize', (original, ...args) => {
		original(...args);
		TankTrouble.AccountOverlay.accountContainer = $('<div class="account-details"></div>');
		TankTrouble.AccountOverlay.accountContainer.insertAfter(TankTrouble.AccountOverlay.accountHeadline);
		TankTrouble.AccountOverlay.accountID = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
		TankTrouble.AccountOverlay.accountCreated = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
		TankTrouble.AccountOverlay.accountCountry = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
		TankTrouble.AccountOverlay.accountVerification = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
		TankTrouble.AccountOverlay.accountLastLogin = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
	});
	Loader.interceptFunction(TankTrouble.AccountOverlay, 'show', (original, ...args) => {
		original(...args);
	Backend.getInstance().getPlayerDetails(result => {
            if (typeof result === 'object') {
                const accountVerification = result.getVerified();
                const accountID = result.getPlayerId();
                const created = new Date(result.getCreated() * 1000);
                const accountCountry = result.getCountry();
                const accountLastLogin = result.getLastLogin();
                const formatted = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(created);
                TankTrouble.AccountOverlay.accountID.text(`Player ID: #${accountID}`);
                TankTrouble.AccountOverlay.accountCreated.text(`Created: ${formatted}`);
                TankTrouble.AccountOverlay.accountCountry.text(`Country: ${accountCountry ? accountCountry : 'N/A'}`);
                TankTrouble.AccountOverlay.accountVerification.text(`Verified: ${accountVerification ? 'Yes' : 'No'}`);
                TankTrouble.AccountOverlay.accountLastLogin.text(`Last login: ${accountLastLogin ? getTimeAgo(accountLastLogin) : 'Never'}`);
            }
        }, () => {}, () => {}, TankTrouble.AccountOverlay.playerId, Caches.getPlayerDetailsCache());
	});
})();