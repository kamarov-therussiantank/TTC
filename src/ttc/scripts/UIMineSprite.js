//UI Mine Sprite
UIMineSprite = function(game, gameController, activateSound, tripSound, detonateSound) {
    Phaser.Sprite.call(this, game, 0, 0, 'game', 'mine');

    this.activateSound = activateSound;
    this.tripSound = tripSound;
    this.detonateSound = detonateSound;

    this.anchor.setTo(0.5, 0.5);
    this.gameController = gameController;
    this.scale.setTo(UIConstants.GAME_ASSET_SCALE, UIConstants.GAME_ASSET_SCALE);
    this.glow = this.addChild(new Phaser.Image(game, 0, 0, 'game', 'mineGlow01'));
    this.glowTripped = this.addChild(new Phaser.Image(game, 0, 0, 'game', 'mineGlow02'));
    this.glow.anchor.setTo(0.5, 0.5);
    this.glowTripped.anchor.setTo(0.5, 0.5);
    this.glow.alpha = 0.0;
    this.glowTripped.alpha = 0.0;
    this.kill();
};

UIMineSprite.prototype = Object.create(Phaser.Sprite.prototype);
UIMineSprite.prototype.constructor = UIMineSprite;

UIMineSprite.prototype.update = function() {
    if (!this.exists) return;

    var trap = this.gameController.getTrap(this.trapId);
    if (trap) {
        this.x = UIUtils.mpx(trap.getX());
        this.y = UIUtils.mpx(trap.getY());

        var speedX = trap.getSpeedX();
        var speedY = trap.getSpeedY();
        if (speedX * speedX + speedY * speedY > 0) {
            this.rotation = Math.atan2(speedY, speedX) - Math.PI * 0.5;
        }
    }
};

UIMineSprite.prototype.spawn = function(x, y, trapId, playerId, activated, tripped) {
    this.reset(x, y);
    this.alpha = 1.0;
    this.glow.alpha = 0.0;
    this.glowTripped.alpha = 0.0;
    this.trapId = trapId;
    this.playerId = playerId;

    var self = this;
    Backend.getInstance().getPlayerDetails(function(result) {
        if (typeof result === "object") {
            self.tint = result.getTurretColour().numericValue;
        } else {
            self.tint = UIConstants.TANK_UNAVAILABLE_COLOUR.numericValue;
        }
    }, function() {}, function() {}, this.playerId, Caches.getPlayerDetailsCache());

    if (tripped) {
        this.glowTween = this.game.add.tween(this.glowTripped).to({
            alpha: 1.0
        }, 100, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
    } else if (activated) {
        this.alpha = 0.0;
    }
};

UIMineSprite.prototype.activate = function() {
    this.activateSound.play();

    this.fadeTween = this.game.add.tween(this).to({
        alpha: 0.0
    }, 500, Phaser.Easing.Linear.None, true, 1000);

    this.glow.alpha = 0.0;
    this.glowTripped.alpha = 0.0;

    this.glowTween = this.game.add.tween(this.glow).to({
        alpha: 1.0
    }, 200, Phaser.Easing.Cubic.InOut, true);
};

UIMineSprite.prototype.trip = function() {
    if (this.glowTween) this.glowTween.stop();
    if (this.fadeTween) this.fadeTween.stop();

    this.activateSound.stop();
    this.tripSound.play();

    this.fadeTween = this.game.add.tween(this).to({
        alpha: 1.0
    }, 100, Phaser.Easing.Linear.None, true);
    this.glow.alpha = 0.0;
    this.glowTripped.alpha = 0.0;
    this.glowTween = this.game.add.tween(this.glowTripped).to({
        alpha: 1.0
    }, 100, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
};

UIMineSprite.prototype.detonate = function() {
    this.detonateSound.play();
};

UIMineSprite.prototype.remove = function() {
    if (this.glowTween) this.glowTween.stop();
    if (this.fadeTween) this.fadeTween.stop();
    this.detonateSound.stop();
    this.kill();
};

UIMineSprite.prototype.retire = function() {
    if (this.glowTween) this.glowTween.stop();
    if (this.fadeTween) this.fadeTween.stop();
    this.kill();
};
