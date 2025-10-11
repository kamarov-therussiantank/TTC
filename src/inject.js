// Injects custom styles and seasonal themes
(() => {
  if (!window.location.hostname.endsWith('tanktrouble.com')) return;

  // Replace "TankTrouble" font with "Eurostile"
  const fontStyle = document.createElement("style");
  fontStyle.textContent = `
    @font-face {
      font-family: "TankTrouble";
      src: url("https://raw.githubusercontent.com/tangye1234/ZVCloud/refs/heads/master/assets/fonts/eurostileRegular.ttf");
    }
  `;
  document.head.appendChild(fontStyle);

  // Apply seasonal theme content
  if (window.PremiumManager && typeof PremiumManager._updatePremium === "function") {
    PremiumManager._updatePremium(PremiumManager.hasPremium);
  }

  function applySeasonalStyles() {
    const currentMonth = new Date().getMonth();
    let imageSelected = "";
    if (currentMonth === 9) {
      imageSelected = "tab1Selected0-1";
    } else if (currentMonth === 11) {
      imageSelected = "tab1Selected0-2";
    }

    let imageDeselected = "";
    if (currentMonth === 9) {
      imageDeselected = "tab1-1";
    } else if (currentMonth === 11) {
      imageDeselected = "tab1-2";
    }

    const hasPremium = window.hasPremium ?? false;
    const isHalloween = window.isHalloween ?? (currentMonth === 9);
    const isChristmas = window.isChristmas ?? (currentMonth === 11);

    if (typeof $ !== "undefined") {
      $('body').removeClass();

      if (hasPremium) {
        $('body').addClass('premium');
      }
      if (isHalloween) {
        $('body').addClass('halloween');
      }
      if (isChristmas) {
        $('body').addClass('christmas');
      }
    }

    if (imageSelected && imageDeselected) {
      const seasonalStyle = document.createElement("style");
      seasonalStyle.textContent = `
        #gameTab .deselected, 
        #gameTab .selected {
          background-image: -webkit-image-set(
            url(https://raw.githubusercontent.com/kamarov-therussiantank/TTC/main/src/assets/images/header/${imageSelected}.png) 1x,
            url(https://raw.githubusercontent.com/kamarov-therussiantank/TTC/main/src/assets/images/header/${imageSelected}@2x.png) 2x
          ) !important;
          background-size: cover !important;
        }

        #gameTab .deselected {
          background-image: image-set(
            url(https://raw.githubusercontent.com/kamarov-therussiantank/TTC/main/src/assets/images/header/${imageDeselected}.png) 1x,
            url(https://raw.githubusercontent.com/kamarov-therussiantank/TTC/main/src/assets/images/header/${imageDeselected}@2x.png) 2x
          ) !important;
          padding: 60px 0 0 368px !important;
        }
      `;
      document.head.appendChild(seasonalStyle);
    }
  }

  function waitForTabs() {
    if (document.querySelector("#gameTab")) {
      applySeasonalStyles();
    } else {
      setTimeout(waitForTabs, 500);
    }
  }

  window.addEventListener("load", waitForTabs);
})();
