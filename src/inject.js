(() => {
	if (!window.location.hostname.endsWith('tanktrouble.com')) return;

//Replace "TankTrouble" font with "euroline-bold" font
const style = document.createElement("style");
style.textContent = `
@font-face {
  font-family: TankTrouble;
  src: url("https://raw.githubusercontent.com/tangye1234/ZVCloud/refs/heads/master/assets/fonts/eurostile-bold.ttf");
}
`;
document.head.appendChild(style);

//Set Premium to "true"
const { _updatePremium } = PremiumManager;
PremiumManager.classFields({
	get _updatePremium() {
		_updatePremium(true);
		return () => {};
	},
	set _updatePremium(value) {
		return value;
	}
});

})();
