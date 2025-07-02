//Additional Player Details

class Loader {
	static interceptFunction(context, funcName, handler, attributes) {
		const original = Reflect.get(context, funcName);
		if (typeof original !== 'function') throw new Error('Item passed is not typeof function');

		Reflect.defineProperty(context, funcName, {
			value: (...args) => handler(original.bind(context), ...args),
			...attributes
		});
	}
}

(() => {
	Loader.interceptFunction(TankTrouble.TankInfoBox, '_initialize', (original, ...args) => {
		original(...args);

		// Initialize badges Div
		TankTrouble.TankInfoBox.infoBadgesDiv = $('<div class="badge-container"/>');

		// Define icons for badges
		TankTrouble.TankInfoBox.infoBadgesIcon1 = $('<img class="badgeIcon" src="https://i.imgur.com/EM9M66p.png"/>'); // Premium
		TankTrouble.TankInfoBox.infoBadgesIcon2 = $('<img class="badgeIcon" src="https://raw.githubusercontent.com/kamarov-therussiantank/TTCV2/refs/heads/main/src/assets/badges/kickstarterBadge.png"/>'); // Kickstarter
		TankTrouble.TankInfoBox.infoBadgesIcon3 = $('<img class="badgeIcon" src="https://raw.githubusercontent.com/kamarov-therussiantank/TTCV2/refs/heads/main/src/assets/badges/adminBadge.png"/>'); // Admin
		TankTrouble.TankInfoBox.infoBadgesIcon4 = $('<img class="badgeIcon" src="https://i.imgur.com/1UQeWVB.png"/>'); // Beta Tester
		TankTrouble.TankInfoBox.infoBadgesIcon5 = $('<img class="badgeIcon" src="https://i.imgur.com/9WCCK6U.png"/>'); // Classic Player
		TankTrouble.TankInfoBox.infoBannedIcon = $('<img class="banned-Icon" src="https://raw.githubusercontent.com/kamarov-therussiantank/TTCV2/refs/heads/main/src/assets/badges/bannedBadge.png"/>'); // Banned Player

		// Create badges
		TankTrouble.TankInfoBox.classicPlayerBadge = $('<div class="classicBadge"/>');
		TankTrouble.TankInfoBox.classicPlayerBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon5);
		TankTrouble.TankInfoBox.classicPlayerBadge.append(TankTrouble.TankInfoBox.classicPlayerText);
		TankTrouble.TankInfoBox.betaTesterBadge = $('<div class="betaTesterBadge"/>');
		TankTrouble.TankInfoBox.betaTesterBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon4);
		TankTrouble.TankInfoBox.premiumBadge = $('<div class="premiumMemberBadge"/>');
		TankTrouble.TankInfoBox.premiumBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon1);
		TankTrouble.TankInfoBox.kickstarterBadge = $('<div class="kickstarterBadge"/>');
		TankTrouble.TankInfoBox.kickstarterBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon2);
		TankTrouble.TankInfoBox.adminBadge = $('<div class="adminBadge"/>');
		TankTrouble.TankInfoBox.adminBadge.append(TankTrouble.TankInfoBox.infoBadgesIcon3);
		TankTrouble.TankInfoBox.bannedIcon = $('<div class="bannedIcon"/>');
		TankTrouble.TankInfoBox.bannedIcon.append(TankTrouble.TankInfoBox.infoBannedIcon);

    // Experience progress bar
		TankTrouble.TankInfoBox.infoExpDiv = $('<div class="exp tooltipstered"/>');
		TankTrouble.TankInfoBox.infoExpTextDiv = $('<div class="progress"/>');
		TankTrouble.TankInfoBox.infoExpBorder = $('<div class="border"/>');
		TankTrouble.TankInfoBox.infoExpBar = $('<div class="exp-bar"/>');
		TankTrouble.TankInfoBox.infoExpText = $('<span class="exp-text"/>');
		TankTrouble.TankInfoBox.infoExpTextDiv.append(TankTrouble.TankInfoBox.infoExpBorder);
		TankTrouble.TankInfoBox.infoExpTextDiv.append(TankTrouble.TankInfoBox.infoExpBar);
		TankTrouble.TankInfoBox.infoExpTextDiv.append(TankTrouble.TankInfoBox.infoExpText);
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

    // Create a container for the icon and text
    TankTrouble.TankInfoBox.infoDeathsDiv = $('<td class="deaths tooltipstered"/>');
    TankTrouble.TankInfoBox.infoDeaths = $(`
    <div class="statsContainer">
        <img class="statsIcon" src="https://i.imgur.com/ze2jYnc.png" srcset="https://i.imgur.com/XIQFQn6.png 2x"/>
        <div class="hasSVG">
            <svg version="1.1" width="58" height="34">
                <text id="deathsTextOutline" x="1" y="22" text-anchor="start" font-family="TankTrouble" font-size="14" fill="none" stroke="black" stroke-linejoin="round" stroke-width="3" letter-spacing="1">N/A</text>
                <text id="deathsText" x="1" y="22" text-anchor="start" font-family="TankTrouble" font-size="14" fill="white" letter-spacing="1">N/A</text>
            </svg>
        </div>
    </div>
    `);
    TankTrouble.TankInfoBox.infoDeathsDiv.append(TankTrouble.TankInfoBox.infoDeaths);

    TankTrouble.TankInfoBox.infoDeathsDiv.tooltipster({
    content: 'Deaths',
    position: 'left',
    offsetX: 5
    });

    TankTrouble.TankInfoBox.infoDeathsDiv.insertAfter(TankTrouble.TankInfoBox.infoKillsAndVictoriesTableRow);

		// Style badges Div
		TankTrouble.TankInfoBox.infoBadgesDiv.css({
			display: 'flex',
			'align-items': 'center',
			'justify-content': 'center',
			'flex-wrap': 'wrap',
			margin: '0px auto',
			width: 'fit-content'
		});

		// Scale the icons
	TankTrouble.TankInfoBox.infoBadgesIcon1.css({
			width: '38px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBadgesIcon2.css({
			width: '90px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBadgesIcon3.css({
			width: '102px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBadgesIcon4.css({
			width: '38px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBadgesIcon5.css({
			width: '38px',
			margin: '0'
		});

    TankTrouble.TankInfoBox.infoBannedIcon.css({
			width: '200px',
			margin: '0',
		});

    TankTrouble.TankInfoBox.classicPlayerBadge.tooltipster({
			position: 'top',
			offsetX: 0
		});

    TankTrouble.TankInfoBox.betaTesterBadge.tooltipster({
			position: 'top',
			offsetX: 0
		});

    TankTrouble.TankInfoBox.premiumBadge.tooltipster({
			position: 'top',
			offsetX: 0
		});

	TankTrouble.TankInfoBox.infoExpDiv.tooltipster({
			position: 'right',
			offsetX: 5
		});

		// Append all elements
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.classicPlayerBadge);
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.kickstarterBadge);
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.adminBadge);
		TankTrouble.TankInfoBox.infoBadgesDiv.append(TankTrouble.TankInfoBox.bannedIcon);
		TankTrouble.TankInfoBox.infoBadgesDiv.insertBefore(TankTrouble.TankInfoBox.infoRank);

		// Hide badges by default
		TankTrouble.TankInfoBox.infoExpDiv.hide();
		TankTrouble.TankInfoBox.infoBadgesDiv.hide();
		TankTrouble.TankInfoBox.classicPlayerBadge.hide();
		TankTrouble.TankInfoBox.kickstarterBadge.hide();
		TankTrouble.TankInfoBox.adminBadge.hide();
	});

  // Display
    Loader.interceptFunction(TankTrouble.TankInfoBox, 'show', (original, ...args) => {
        original(...args);

        TankTrouble.TankInfoBox.classicPlayerBadge.tooltipster('content', 'Classic Player');
        TankTrouble.TankInfoBox.infoExpDiv.tooltipster('content', 'Classic EXP');

        const [,, playerId] = args;

        Backend.getInstance().getPlayerDetails(result => {
            if (typeof result === 'object') {
                const playerId = result.getPlayerId();
                const username = result.getUsername();
                const banned = result.getBanned();
                const classicPlayer = result.getExperience();
                const premiumMember = result.getPremium();
                const betaTester = result.getBeta();
                const adminMember = result.getGmLevel();
                const deaths = result.getDeaths();
                const lastLogin = result.getLastLogin();

                $("#deathsTextOutline").text(deaths);
                $("#deathsText").text(deaths);

                if (deaths > 100000) {
                    $("#deathsTextOutline").attr("font-size", "12");
                    $("#deathsText").attr("font-size", "12");
                } else {
                    $("#deathsTextOutline").attr("font-size", "14");
                    $("#deathsText").attr("font-size", "14");
                }

                // Always show the badges div
                TankTrouble.TankInfoBox.infoBadgesDiv.show();

                // Kickstarter Badge
                Backend.getInstance().ajax.getBackers(backerResult => {
                    const backers = backerResult.result.data;

                    if (backers.includes(username)) {
                        TankTrouble.TankInfoBox.kickstarterBadge.show();
                    } else {
                        TankTrouble.TankInfoBox.kickstarterBadge.hide();
                    }
                });

                // Classic Player badge & Experience progress bar
                if (classicPlayer) {
                    TankTrouble.TankInfoBox.infoExpDiv.show();
                    TankTrouble.TankInfoBox.infoExpText.text(`EXP: ${classicPlayer}`);

                    // Adjust EXP text position based on value
                    const expTextElement = TankTrouble.TankInfoBox.infoExpText[0];

                    if (classicPlayer <= 9999999) {
                        expTextElement.style.left = '27%';
                    }

                    if (classicPlayer <= 999999) {
                        expTextElement.style.left = '29%';
                    }

                    if (classicPlayer <= 99999) {
                        expTextElement.style.left = '32%';
                    }

                    if (classicPlayer <= 9999) {
                        expTextElement.style.left = '34%';
                    }

                    if (classicPlayer <= 999) {
                        expTextElement.style.left = '35%';
                    }

                    if (classicPlayer <= 99) {
                        expTextElement.style.left = '37%';
                    }

                } else {
                    TankTrouble.TankInfoBox.infoExpDiv.hide();
                }

                // Admin & Kickstarter Backer positioning fix
                Backend.getInstance().ajax.getBackers(backerResult => {
                    const backers = backerResult.result.data;

                    const isBacker = backers.includes(username);
                    const isAdmin = !!adminMember;

                    if (isAdmin && isBacker) {
                        $(".kickstarterBadge").css("top", "-55px");
                        $(".kickstarterBadge").css("right", "-30px");
                        $(".kickstarterBadge img.badgeIcon").css("width", "70px");
                        $(".adminBadge").css("top", "-65px");
                        $(".adminBadge").css("right", "-10px");
                        $(".adminBadge img.badgeIcon").css("width", "85px");
                    } else {
                        $(".kickstarterBadge").css("top", "-70px");
                        $(".kickstarterBadge").css("right", "-22px");
                        $(".kickstarterBadge img.badgeIcon").css("width", "90px");
                        $(".adminBadge").css("top", "-75px");
                        $(".adminBadge").css("right", "-22px");
                        $(".adminBadge img.badgeIcon").css("width", "102px");
                    }

                    // Also control visibility here if needed
                    if (isBacker) {
                TankTrouble.TankInfoBox.kickstarterBadge.show();
                    } else {
                TankTrouble.TankInfoBox.kickstarterBadge.hide();
                    }
                });

                // Display player info or banned message
                if (banned) {
                    TankTrouble.TankInfoBox.bannedIcon.show();
                    TankTrouble.TankInfoBox.infoAboutDiv.show();
                    TankTrouble.TankInfoBox.infoAboutText.text(`#${playerId}`);
                    TankTrouble.TankInfoBox.infoBannedPlayerDiv.show();
                    TankTrouble.TankInfoBox.infoBannedPlayerText.text(`Player has been permanently banned because of rules violation. Player statistics are counted towards the scrapyard.`);
                    document.querySelector(".about-container").style.color = "#fff";
                    document.querySelector("#tankinfo .rank").style.display = "none";
                    document.querySelector("#tankinfo .xp").style.display = "none";
                    document.querySelector(".exp.tooltipstered").style.display = "none";
                    document.querySelector("#tankinfo table").style.display = "none";
                    document.querySelector(".actions.centered").style.display = "none";
                } else if (playerId) {
                    TankTrouble.TankInfoBox.bannedIcon.hide();
                    TankTrouble.TankInfoBox.infoBannedPlayerDiv.hide();
                    TankTrouble.TankInfoBox.infoAboutDiv.show();
                    TankTrouble.TankInfoBox.infoAboutText.text(`#${playerId}`);
                    document.querySelector(".about-container").style.color = "";
                    document.querySelector("#tankinfo .rank").style.display = "";
                    document.querySelector("#tankinfo .xp").style.display = "";
                    document.querySelector("#tankinfo table").style.display = "";
                    document.querySelector(".actions.centered").style.display = "";
                } else {
                    TankTrouble.TankInfoBox.infoAboutDiv.hide();
                    document.querySelector(".exp.tooltipstered").style.display = "";
                }

                // Show or hide other badges
                adminMember ? TankTrouble.TankInfoBox.adminBadge.show() : TankTrouble.TankInfoBox.adminBadge.hide();
            } else {
                TankTrouble.TankInfoBox.infoBadgesDiv.hide();
            }

        }, () => {}, () => {}, playerId, Caches.getPlayerDetailsCache());
    });
})();