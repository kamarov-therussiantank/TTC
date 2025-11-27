whenContentInitialized().then(() => {
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
