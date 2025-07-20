
// Load a player's tank icon
UITankIcon.classMethod('loadPlayerTankIcon', function (canvas, size, playerId, onReady, context) {
    Backend.getInstance().getPlayerDetails(function (result) {
        if (typeof result === 'object') {
            const gmLevel = result.getGmLevel();
            const turretColour = result.getTurretColour();
            const treadColour = result.getTreadColour();
            const baseColour = result.getBaseColour();
            const turretAccessory = result.getTurretAccessory();
            const barrelAccessory = result.getBarrelAccessory();
            const frontAccessory = result.getFrontAccessory();
            const backAccessory = result.getBackAccessory();

            let badge = null;
            
            if (gmLevel > 0) {
                if (gmLevel === 1) {
                    badge = '0';
                } else if (gmLevel === 2) {
                    badge = '1';
                } else {
                    badge = '2';
                }
            }

            const isComplete = (
                turretColour && treadColour && baseColour &&
                turretAccessory && barrelAccessory &&
                frontAccessory && backAccessory
            );

            // If they're not admin, don't require badge for loading
            if (!isComplete) return;

            UITankIcon.loadTankIcon(
                canvas, size,
                turretColour, treadColour, baseColour,
                turretAccessory, barrelAccessory, frontAccessory, backAccessory,
                null, null, badge,
                onReady || function () {},
                context || self
            );
        } else {
            // Load unavailable tank icon if no player data
            UITankIcon.loadTankIcon(
                canvas, size,
                UIConstants.TANK_UNAVAILABLE_COLOUR,
                UIConstants.TANK_UNAVAILABLE_COLOUR,
                UIConstants.TANK_UNAVAILABLE_COLOUR,
                null, null, null, null,
                null, null, null,
                onReady || function () {},
                context || self
            );
        }
    }, function () {}, function () {}, playerId, Caches.getPlayerDetailsCache());
});

// Load full tank icon image with queued resources
UITankIcon.classMethod('loadTankIcon', function (
    canvas, size,
    turretColour, treadColour, baseColour,
    turretAccessory, barrelAccessory, frontAccessory, backAccessory,
    treadAccessory, backgroundAccessory, badge,
    onReady, context
) {
    const loader = UITankIconLoader.create(canvas, size);

    // Queue colour parts
    loader.queueColour(UIConstants.TANK_ICON_TINT_PARTS.TURRET, turretColour);
    loader.queueColour(UIConstants.TANK_ICON_TINT_PARTS.TREAD, treadColour);
    loader.queueColour(UIConstants.TANK_ICON_TINT_PARTS.BASE, baseColour);

    // Queue accessory parts
    loader.queueAccessory(UIConstants.TANK_ICON_ACCESSORY_PARTS.TURRET, turretAccessory);
    loader.queueAccessory(UIConstants.TANK_ICON_ACCESSORY_PARTS.BARREL, barrelAccessory);
    loader.queueAccessory(UIConstants.TANK_ICON_ACCESSORY_PARTS.FRONT, frontAccessory);
    loader.queueAccessory(UIConstants.TANK_ICON_ACCESSORY_PARTS.BACK, backAccessory);
    loader.queueAccessory(UIConstants.TANK_ICON_ACCESSORY_PARTS.TREAD, treadAccessory);
    loader.queueAccessory(UIConstants.TANK_ICON_ACCESSORY_PARTS.BACKGROUND, backgroundAccessory);
    loader.queueAccessory(UIConstants.TANK_ICON_ACCESSORY_PARTS.BADGE, badge);

    loader.onReady(onReady, context);
    loader.start();
});

// Queue accessory image if applicable
UITankIconLoader.method('queueAddons', function (part, accessory) {
    if (
        accessory !== null &&
        accessory !== undefined &&
        accessory !== '0'
    ) {
        this._queueImage('accessories/', part, accessory, this.accessories, part, true);
    }
});

// Draw the tank icon to a canvas
UITankIcon.classMethod('drawTankIcon', function (
    canvas,
    turretColour, treadColour, baseColour,
    turret, barrel, leftTread, rightTread, base,
    turretShade, barrelShade, leftTreadShade, rightTreadShade, baseShade,
    turretAccessory, barrelAccessory, frontAccessory, backAccessory,
    treadAccessory, backgroundAccessory, badge
) {
    const context = canvas.getContext('2d');

    // Resize buffers if necessary
    if (canvas.width !== this.compositedBuffer.width || canvas.height !== this.compositedBuffer.height) {
        this.compositedBuffer.width = canvas.width;
        this.compositedBuffer.height = canvas.height;
    }

    const compositedContext = this.compositedBuffer.getContext('2d');
    compositedContext.clearRect(0, 0, canvas.width, canvas.height);

    if (canvas.width !== this.tintedBuffer.width || canvas.height !== this.tintedBuffer.height) {
        this.tintedBuffer.width = canvas.width;
        this.tintedBuffer.height = canvas.height;
    }

    const tintedContext = this.tintedBuffer.getContext('2d');
    tintedContext.clearRect(0, 0, canvas.width, canvas.height);

    // Draw layers in order
    if (backAccessory instanceof HTMLImageElement) {
        compositedContext.drawImage(backAccessory, 0, 0, canvas.width, canvas.height);
    }

    const drawLayer = (colour, image, shade) => {
        tintedContext.globalCompositeOperation = 'copy';

        if (colour instanceof HTMLImageElement) {
            tintedContext.drawImage(colour, 0, 0, canvas.width, canvas.height);
        } else {
            tintedContext.fillStyle = colour;
            tintedContext.fillRect(0, 0, canvas.width, canvas.height);
        }

        tintedContext.globalCompositeOperation = 'destination-atop';
        tintedContext.drawImage(image, 0, 0, canvas.width, canvas.height);

        compositedContext.drawImage(this.tintedBuffer, 0, 0);
        compositedContext.drawImage(shade, 0, 0, canvas.width, canvas.height);
    };

    drawLayer(treadColour, leftTread, leftTreadShade);
    drawLayer(turretColour, turret, turretShade);
    drawLayer(baseColour, base, baseShade);
    drawLayer(treadColour, rightTread, rightTreadShade);
    drawLayer(turretColour, barrel, barrelShade);

    // Draw accessories
    [turretAccessory, frontAccessory, barrelAccessory, badge].forEach(image => {
        if (image instanceof HTMLImageElement) {
            compositedContext.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    });

    // Outline buffer drawing
    if (canvas.width !== this.outlineBuffer.width || canvas.height !== this.outlineBuffer.height) {
        this.outlineBuffer.width = canvas.width;
        this.outlineBuffer.height = canvas.height;
    }

    var outlineContext = this.outlineBuffer.getContext('2d');
        outlineContext.globalCompositeOperation = "copy";
        outlineContext.fillStyle = "rgba(0, 0, 0, 1)";
        outlineContext.fillRect(0, 0, canvas.width, canvas.height);
        outlineContext.globalCompositeOperation = "destination-atop";
        outlineContext.drawImage(this.compositedBuffer, 0, 0);
        var width = UIConstants.TANK_ICON_OUTLINE_WIDTH;
        var diagWidth = Math.sqrt((width * width) / 2.0);
        context.drawImage(this.outlineBuffer, -width, 0);
        context.drawImage(this.outlineBuffer, -diagWidth, -diagWidth);
        context.drawImage(this.outlineBuffer, -diagWidth, diagWidth);
        context.drawImage(this.outlineBuffer, 0, width);
        context.drawImage(this.outlineBuffer, 0, -width);
        context.drawImage(this.outlineBuffer, diagWidth, -diagWidth);
        context.drawImage(this.outlineBuffer, diagWidth, diagWidth);
        context.drawImage(this.outlineBuffer, width, 0);
        context.drawImage(this.compositedBuffer, 0, 0);
});

// Internal function to queue image resources
UITankIconLoader.method('_queueImage', function (basePath, part, image, output, customKey) {
    const key = customKey !== undefined ? customKey : part;
    const cacheKey = part + image + '-' + this.size;

    let cachedImage = UITankIconLoader.imageCache[cacheKey];

    if (cachedImage === undefined) {
        const resolution = UIConstants.TANK_ICON_RESOLUTIONS[this.size];
        let imgPath = basePath + part + image + '-' + resolution;
        let imageName = imgPath.includes('assets') ? imgPath.substring(14) : imgPath;
        const d_url = (path) => path;
        let src = d_url('https://raw.githubusercontent.com/kamarov-therussiantank/TTC/refs/heads/main/src/assets/images/' + imageName + '.png');
        let srcset = d_url('https://raw.githubusercontent.com/kamarov-therussiantank/TTC/refs/heads/main/src/assets/images/' + imageName + '@2x.png') + ' 2x';
        const imageElement = $('<img>', {
            src: src,
            srcset: srcset,
            crossorigin: 'anonymous'
        });
        const self = this;
        imageElement.on('load', function () {
            output[key] = this;
            ++self.numImagesLoaded;
            self._checkIfDone();
        });
        imageElement.on('error', function () {
            const fallback = $('<img>', {
                src: g_url('assets/images/' + imageName + '.png'),
                srcset: g_url('assets/images/' + imageName + '@2x.png') + ' 2x',
                crossorigin: 'anonymous'
            });
            fallback.on('load', function () {
                output[key] = this;
                ++self.numImagesLoaded;
                self._checkIfDone();
            });
            fallback.on('error', function () {
                ++self.numImagesLoaded;
                self._checkIfDone();
            });
        });
    } else {
        output[key] = cachedImage;
        ++this.numImagesLoaded;
    }

    ++this.numImages;
});
