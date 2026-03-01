// Countdown Image Loader
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
            x: 1.35,
            y: 1.35
        }, 500, Phaser.Easing.Cubic.Out, true);
        this.game.add.tween(this).to({
            alpha: 0.0
        }, 100, Phaser.Easing.Linear.None, true, 400).onComplete.add(function() {
            this.kill();
        }, this);
    }
}
