(() => {
	if (!window.location.hostname.endsWith('tanktrouble.com')) return;

//Replace "TankTrouble" font with "euroline" font
const style = document.createElement("style");
style.textContent = `
@font-face {
  font-family: TankTrouble;
  src: url("https://raw.githubusercontent.com/tangye1234/ZVCloud/refs/heads/master/assets/fonts/eurostileRegular.ttf");
}
`;
document.head.appendChild(style);
})();
