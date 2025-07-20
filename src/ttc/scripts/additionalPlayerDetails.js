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
				<img class="statsIcon" src="https://raw.githubusercontent.com/kamarov-therussiantank/TTC/refs/heads/main/src/assets/tankInfo/deaths.png" srcset="https://raw.githubusercontent.com/kamarov-therussiantank/TTC/refs/heads/main/src/assets/tankInfo/deaths@2x.png 2x"/>
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

		TankTrouble.TankInfoBox.infoExpDiv.tooltipster({
			position: 'right',
			offsetX: 5
		});

		// Hide EXP by default
		TankTrouble.TankInfoBox.infoExpDiv.hide();
	});

	Loader.interceptFunction(TankTrouble.TankInfoBox, 'show', (original, ...args) => {
		original(...args);

		TankTrouble.TankInfoBox.infoExpDiv.tooltipster('content', 'Classic EXP');
		const [,, playerId] = args;

		Backend.getInstance().getPlayerDetails(result => {
			if (typeof result === 'object') {
				const playerId = result.getPlayerId();
				const username = result.getUsername();
				const banned = result.getBanned();
				const classicPlayer = result.getExperience();
				const deaths = result.getDeaths();

				$("#deathsTextOutline").text(deaths);
				$("#deathsText").text(deaths);

				const fontSize = deaths > 100000 ? "12" : "14";
				$("#deathsTextOutline").attr("font-size", fontSize);
				$("#deathsText").attr("font-size", fontSize);

				// Classic EXP bar
				if (classicPlayer) {
					TankTrouble.TankInfoBox.infoExpDiv.show();
					TankTrouble.TankInfoBox.infoExpText.text(`EXP: ${classicPlayer}`);
					const expTextElement = TankTrouble.TankInfoBox.infoExpText[0];

					if (classicPlayer <= 99) expTextElement.style.left = '37%';
					else if (classicPlayer <= 999) expTextElement.style.left = '35%';
					else if (classicPlayer <= 9999) expTextElement.style.left = '34%';
					else if (classicPlayer <= 99999) expTextElement.style.left = '32%';
					else if (classicPlayer <= 999999) expTextElement.style.left = '29%';
					else expTextElement.style.left = '27%';
				} else {
					TankTrouble.TankInfoBox.infoExpDiv.hide();
				}

				// Banned handling
				if (banned) {
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
			}
		}, () => {}, () => {}, playerId, Caches.getPlayerDetailsCache());
	});
})();
