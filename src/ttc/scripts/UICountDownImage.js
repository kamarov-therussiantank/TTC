// UI Count Down Image
UICountDownImage = function(game) {
    Phaser.Image.call(this, game, 0, 0, 'game', 'countdown0');
    this.anchor.set(0.5, 0.5);
    this.kill();
}
UICountDownImage.prototype = Object.create(Phaser.Image.prototype);
UICountDownImage.prototype.constructor = UICountDownImage;
UICountDownImage.prototype.update = function() {
    if (!this.exists) {
        return;
    }
}
UICountDownImage.prototype.spawn = function(countDownValue) {
    this.revive();
    this.frameName = 'countdown' + countDownValue;
    this.alpha = 1.0;
    this.scale.set(0.0, 0.0);
    if (countDownValue > 0) {
        this.removeEvent = this.game.time.events.add(UIConstants.COUNT_DOWN_DISPLAY_TIME, this.remove, this);
        this.game.add.tween(this.scale).to({
            x: 1.0,
            y: 1.0
        }, 300, Phaser.Easing.Back.Out, true);
    } else {
        this.game.add.tween(this.scale).to({
            x: 1.4,
            y: 1.4
        }, 500, Phaser.Easing.Cubic.Out, true);
        this.game.add.tween(this).to({
            alpha: 0.0
        }, 100, Phaser.Easing.Linear.None, true, 400).onComplete.add(function() {
            this.kill();
        }, this);
    }
}
UICountDownImage.prototype.remove = function() {
    this.removeEvent = null;
    this.game.add.tween(this).to({
        alpha: 0.0
    }, 100, Phaser.Easing.Linear.None, true);
    this.game.add.tween(this.scale).to({
        x: 1.5,
        y: 1.5
    }, 100, Phaser.Easing.Linear.None, true).onComplete.add(function() {
        this.kill();
    }, this);
}
UICountDownImage.prototype.retire = function() {
    if (this.removeEvent) {
        this.game.time.events.remove(this.removeEvent);
    }
    this.kill();
}
