// Phaser image rendering
const REMOVE_SHADING = false;
const POSTERIZE_LEVELS = 3;
const TARGET_KEYS = ["tankSprites"];
const DPR = window.devicePixelRatio || 1;
const SHOULD_DOWNSCALE = DPR < 2;
const ogc = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(type, opts) {
    const ctx = ogc.call(this, type, opts);
    if (type === "2d" && ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
    }
    return ctx;
};
function pC(ctx, width, height, levels = 3) {
    const img = ctx.getImageData(0, 0, width, height);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = Math.round(data[i] / 255 * levels) * (255 / levels);
        data[i + 1] = Math.round(data[i + 1] / 255 * levels) * (255 / levels);
        data[i + 2] = Math.round(data[i + 2] / 255 * levels) * (255 / levels);
    }
    ctx.putImageData(img, 0, 0);
}
async function pI(img) {
    const targetWidth  = SHOULD_DOWNSCALE ? Math.floor(img.width / 2) : img.width;
    const targetHeight = SHOULD_DOWNSCALE ? Math.floor(img.height / 2) : img.height;
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        0, 0, targetWidth, targetHeight
    );
    if (REMOVE_SHADING) {
        pC(ctx, targetWidth, targetHeight, POSTERIZE_LEVELS);
    }
    return canvas;
}
async function pT(game) {
    if (!game || !game.cache || !game.cache._cache?.image) return;
    const images = game.cache._cache.image;
    const SCALE_MODE =
        (typeof PIXI !== "undefined" && PIXI.SCALE_MODES?.NEAREST) ||
        (typeof PIXI !== "undefined" && PIXI.scaleModes?.NEAREST) ||
        1;
    for (let key in images) {
        if (!TARGET_KEYS.includes(key)) continue;
        const imgData = images[key];
        if (!imgData || !imgData.base || !imgData.base.source) continue;
        if (imgData._sharpProcessed) continue;
        try {
            const original = imgData.base.source;
            if (!(original instanceof HTMLImageElement || original instanceof HTMLCanvasElement)) {
                continue;
            }
            const canvas = await pI(original);
            if (!canvas) continue;
            const newBase = new PIXI.BaseTexture(canvas);
            newBase.scaleMode = SCALE_MODE;
            imgData.base = newBase;
            if (imgData.texture) {
                imgData.texture.baseTexture = newBase;
                imgData.texture.frame = new PIXI.Rectangle(0, 0, canvas.width, canvas.height);
            }
            if (imgData.frameData && SHOULD_DOWNSCALE) {
                imgData.frameData._frames.forEach(frame => {
                    frame.x *= 0.5;
                    frame.y *= 0.5;
                    frame.width *= 0.5;
                    frame.height *= 0.5;
                    frame.centerX *= 0.5;
                    frame.centerY *= 0.5;
                });
            }
            imgData._sharpProcessed = true;
        } catch (e) {
            console.warn("Failed processing:", key, e);
        }
    }
}
function fR(game) {
    if (game.renderer?.renderSession) {
        game.renderer.renderSession.roundPixels = false;
    }
}
let lastGame = null;
let lastCache = null;
setInterval(() => {
    const game = GameManager?.getGame?.();
    if (!game) return;
    if (game !== lastGame) {
        lastGame = game;
        lastCache = null;
        fR(game);
        pT(game);
        return;
    }
    const currentCache = game.cache?._cache?.image;
    if (currentCache && currentCache !== lastCache) {
        lastCache = currentCache;
        fR(game);
        pT(game);
    }
}, 100);