// We are injecting this script to override styles before the content gets initialized
(() => {
  if (!window.location.hostname.endsWith('tanktrouble.com')) return;
  const fontStyle = document.createElement("style");
  fontStyle.textContent = `
    @font-face {
      font-family: "TankTrouble";
      src: url("https://raw.githubusercontent.com/tangye1234/ZVCloud/refs/heads/master/assets/fonts/eurostileRegular.ttf");
    }
  `;
  document.head.appendChild(fontStyle);

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

  function applyChristmasSnowEffect() {
  if (!document.body.classList.contains("christmas")) return;
  const header = document.querySelector("#header");
  if (!header) return;
  if (header.querySelector(".christmas-snow")) return;
  const canvas = document.createElement("canvas");
  canvas.className = "christmas-snow";
  canvas.style.position = "absolute";
  canvas.style.pointerEvents = "none";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "9999";
  header.style.position = "relative";
  header.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let windowW = header.offsetWidth;
  let windowH = header.offsetHeight;
  let numFlakes = 70;
  let flakes = [];

  function Flake(x, y) {
    const maxWeight = 5, maxSpeed = 2;
    this.x = x;
    this.y = y;
    this.r = Math.random();
    this.a = Math.random() * Math.PI;
    this.aStep = 0.01;

    this.weight = 2 + Math.random() * (maxWeight - 2);
    this.alpha = this.weight / maxWeight;
    this.speed = (this.weight / maxWeight) * maxSpeed;

    this.update = function () {
      this.x += Math.cos(this.a) * this.r;
      this.a += this.aStep;
      this.y += this.speed;
    };
  }

  function init() {
    for (let i = 0; i < numFlakes; i++) {
      flakes.push(new Flake(Math.random() * windowW, Math.random() * windowH));
    }
    scaleCanvas();
    loop();
  }

  function scaleCanvas() {
    canvas.width = windowW;
    canvas.height = windowH;
  }

  function loop() {
    ctx.clearRect(0, 0, windowW, windowH);

    flakes.forEach(flake => {
      flake.update();
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.weight, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.alpha})`;
      ctx.fill();

      if (flake.y >= windowH) flake.y = -flake.weight;
    });

    requestAnimationFrame(loop);
  }

  const resizeObserver = new ResizeObserver(() => {
    windowW = header.offsetWidth;
    windowH = header.offsetHeight;
    scaleCanvas();
  });
  resizeObserver.observe(header);

  init();
  }

  function waitForTabs() {
    if (document.querySelector("#gameTab")) {
      applySeasonalStyles();
      applyChristmasSnowEffect();
    } else {
      setTimeout(waitForTabs, 500);
    }
  }

  window.addEventListener("load", waitForTabs);
})();
