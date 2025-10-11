// Additional Player Details
// Adds an experience progress bar (for classic players), player ID display under their username, and banned player information if banned.
// Also adds more details to the account overlay such as account creation date, country, verification status, news subscription status, player ID, lifetime in hours, and last login time.
(() => {
	// TankInfoBox init
	Loader.interceptFunction(TankTrouble.TankInfoBox, '_initialize', (original, ...args) => {
		original(...args);

		// Experience progress bar
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

		// Player additional information element
		TankTrouble.TankInfoBox.infoAboutDiv = $('<div class="tooltipstered"/>');
		TankTrouble.TankInfoBox.infoAboutTextDiv = $('<div class="about-container"/>');
		TankTrouble.TankInfoBox.infoAboutText = $('<span class="about-text"/>');
		TankTrouble.TankInfoBox.infoAboutTextDiv.append(TankTrouble.TankInfoBox.infoAboutText);
		TankTrouble.TankInfoBox.infoAboutDiv.append(TankTrouble.TankInfoBox.infoAboutTextDiv);
		TankTrouble.TankInfoBox.infoAboutDiv.insertAfter(TankTrouble.TankInfoBox.infoName);

		// Banned information element
		TankTrouble.TankInfoBox.infoBannedPlayerDiv = $('<div class="tooltipstered"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerTextDiv = $('<div class="bannedText-container"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerText = $('<span class="bannedText-text"/>');
		TankTrouble.TankInfoBox.infoBannedPlayerTextDiv.append(TankTrouble.TankInfoBox.infoBannedPlayerText);
		TankTrouble.TankInfoBox.infoBannedPlayerDiv.append(TankTrouble.TankInfoBox.infoBannedPlayerTextDiv);
		TankTrouble.TankInfoBox.infoBannedPlayerDiv.insertAfter(TankTrouble.TankInfoBox.infoRank);

		// Init tooltip
		TankTrouble.TankInfoBox.infoExpDiv.tooltipster({
			position: 'right',
			offsetX: 5
		});

		// Hide EXP by default
		TankTrouble.TankInfoBox.infoExpDiv.hide();
	});

	// TankInfoBox show
Loader.interceptFunction(TankTrouble.TankInfoBox, 'show', (original, ...args) => {
    original(...args);

    TankTrouble.TankInfoBox.infoExpDiv.tooltipster('content', 'Classic EXP');
    const [,, playerId] = args;

    Backend.getInstance().getPlayerDetails(result => {
        if (typeof result === 'object') {
            const resultPlayerId = result.getPlayerId();
            const username = result.getUsername();
            const banned = result.getBanned();
            const classicPlayer = result.getExperience();
            const kills = result.getKills();
            const victories = result.getVictories();
            const exp = kills + victories + classicPlayer;

            if (classicPlayer && classicPlayer > 0) {
                TankTrouble.TankInfoBox.infoExpDiv.show();

			// Define tiers
			const tiers = [
    			{ name: 'Recruit',   min: 0,       max: 109 },
    			{ name: 'Corporal',  min: 100,     max: 1099 },
    			{ name: 'Sergeant', min: 1000,    max: 10999 },
    			{ name: 'Captain',    min: 10000,   max: 109999 },
    			{ name: 'Colonel',  min: 100000,  max: 599999 },
    			{ name: 'Marshal',   min: 500000, max: Infinity },
				{ name: 'Legend',   min: 1000000, max: Infinity },
			];

			// Find current tier
			let currentTier = tiers.slice().reverse().find(t => exp >= t.min) || tiers[0];
			const currentMin = currentTier.min;
			const currentMax = currentTier.max;

			// For Infinity max, set progress as 100%
			let progressPercent;
			let requiredPoints;
			if (currentMax === Infinity) {
   				progressPercent = 100;
    			requiredPoints = 'Maxed out';
			} else {
    			requiredPoints = currentMax - currentMin + 1;
    			progressPercent = Math.min(100, ((exp - currentMin) / requiredPoints) * 100);
			}

			// Update the bar and text
			TankTrouble.TankInfoBox.infoExpBar.css({ width: `${progressPercent}%` });
			TankTrouble.TankInfoBox.infoExpText.text(currentTier.name);

			// Tooltip with breakdown
			TankTrouble.TankInfoBox.infoExpDiv.tooltipster(
    			'content',
    			`Classic EXP\n(${exp}/${requiredPoints})`
			);

                // Keep label centered
                TankTrouble.TankInfoBox.infoExpText[0].style.left = '39%';
            } else {
                TankTrouble.TankInfoBox.infoExpDiv.hide();
            }

				// Banned handling
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
})();

(() => {
	Loader.interceptFunction(TankTrouble.AccountOverlay, '_initialize', (original, ...args) => {
		original(...args);

		// Create container div
		TankTrouble.AccountOverlay.accountContainer = $('<div class="account-details"></div>');
		TankTrouble.AccountOverlay.accountContainer.insertAfter(TankTrouble.AccountOverlay.accountHeadline);

		// Create and append each detail div inside the container
		TankTrouble.AccountOverlay.accountCreated = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
		TankTrouble.AccountOverlay.accountCountry = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
		TankTrouble.AccountOverlay.accountID = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
		TankTrouble.AccountOverlay.accountVerification = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
		TankTrouble.AccountOverlay.accountNewsSubscriber = $('<div></div>').appendTo(TankTrouble.AccountOverlay.accountContainer);
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
                const accountNewsSubscriber = result.getNewsSubscriber();
                const accountLastLogin = result.getLastLogin();

                const formatted = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(created);

                TankTrouble.AccountOverlay.accountCreated.text(`Created: ${formatted}`);
                TankTrouble.AccountOverlay.accountCountry.text(`Country: ${accountCountry ? accountCountry : 'Siberia’s tourist (Unknown)'}`);
                TankTrouble.AccountOverlay.accountID.text(`Player ID: #${accountID}`);
                TankTrouble.AccountOverlay.accountVerification.text(`Verified: ${accountVerification ? 'Yes' : 'No'}`);
                TankTrouble.AccountOverlay.accountNewsSubscriber.text(`News Subscriber: ${accountNewsSubscriber ? 'Yes' : 'No'}`);
                TankTrouble.AccountOverlay.accountLastLogin.text(`Last login: ${accountLastLogin ? getTimeAgo(accountLastLogin) : 'Never'}`);
            }
        }, () => {}, () => {}, TankTrouble.AccountOverlay.playerId, Caches.getPlayerDetailsCache());
	});
})();
