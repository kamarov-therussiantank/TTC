//UI Emitter
UISmokeEmitter = function(game, targetSprite) {
    Phaser.Particles.Arcade.Emitter.call(this, game, 0, 0, 15);
    this.targetSprite = targetSprite;
    this.particleClass = UISmokeParticle;
    this.makeParticles('game', ['smoke0', 'smoke1', 'smoke2']);
    this.minParticleSpeed.setTo(-40, -40);
    this.maxParticleSpeed.setTo(40, 40);
    this.particleDrag.setTo(50, 50);
    this.setAlpha(1.0, 1.0);
    this.setRotation(0, 0);
    this.minParticleScale = UIConstants.GAME_ASSET_SCALE * 0.66;
    this.maxParticleScale = UIConstants.GAME_ASSET_SCALE * 1.0;
    this.gravity = 0;
    this.kill();
    this.visible = false;
}
;
UISmokeEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
UISmokeEmitter.prototype.constructor = UISmokeEmitter;
UISmokeEmitter.prototype.preUpdate = function() {
    if (!this.exists || this.game.physics.arcade.isPaused) {
        return false;
    }
    return Phaser.Particles.Arcade.Emitter.prototype.preUpdate.call(this);
}
;
UISmokeEmitter.prototype.update = function() {
    if (!this.exists || this.game.physics.arcade.isPaused) {
        return;
    }
    Phaser.Particles.Arcade.Emitter.prototype.update.call(this);
    this.x = this.targetSprite.x;
    this.y = this.targetSprite.y;
    if (this.on && !this.targetSprite.exists) {
        this.on = false;
    } else if (this.on && this.targetSprite.exists && this.targetSprite.alpha < 1.0) {
        this.setAlpha(1.0 * this.targetSprite.alpha, 1.0 * this.targetSprite.alpha);
    }
    if (this.countLiving() == 0) {
        this.kill();
        this.visible = false;
    }
}
;
UISmokeEmitter.prototype.postUpdate = function() {
    if (!this.exists) {
        return;
    }
    Phaser.Particles.Arcade.Emitter.prototype.postUpdate.call(this);
}
;
UISmokeEmitter.prototype.spawn = function(x, y) {
    this.revive();
    this.visible = true;
    this.x = x;
    this.y = y;
    this.setAlpha(1.0, 1.0);
    this.explode(1000, 1);
    this.start(false, 3000, 100, -1);
}
;
UISmokeEmitter.prototype.retire = function() {
    this.kill();
    this.visible = false;
    this.callAll('retire');
}
;

//Emits explosion particles
UIExplosionEmitter = function(game) {
    Phaser.Particles.Arcade.Emitter.call(this, game, 0, 0, 5);
    this.particleClass = UIExplosionParticle;
    this.makeParticles('game', ['explosion0', 'explosion1', 'explosion2']);
    this.minParticleSpeed.setTo(-120, -120);
    this.maxParticleSpeed.setTo(120, 120);
    this.particleDrag.setTo(80, 80);
    this.setAlpha(0.9, 1.0);
    this.setRotation(-100, 100);
    this.minParticleScale = UIConstants.GAME_ASSET_SCALE * 0.9;
    this.maxParticleScale = UIConstants.GAME_ASSET_SCALE * 2.0;
    this.gravity = 0;
    this.kill();
    this.visible = false;
}
;
UIExplosionEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
UIExplosionEmitter.prototype.constructor = UIExplosionEmitter;
UIExplosionEmitter.prototype.preUpdate = function() {
    if (!this.exists || this.game.physics.arcade.isPaused) {
        return false;
    }
    return Phaser.Particles.Arcade.Emitter.prototype.preUpdate.call(this);
}
;
UIExplosionEmitter.prototype.update = function() {
    if (!this.exists || this.game.physics.arcade.isPaused) {
        return;
    }
    Phaser.Particles.Arcade.Emitter.prototype.update.call(this);
    if (this.countLiving() == 0) {
        this.kill();
        this.visible = false;
    }
}
;
UIExplosionEmitter.prototype.postUpdate = function() {
    if (!this.exists) {
        return;
    }
    Phaser.Particles.Arcade.Emitter.prototype.postUpdate.call(this);
}
;
UIExplosionEmitter.prototype.spawn = function(x, y, smokeCount) {
    this.revive();
    this.visible = true;
    this.x = x;
    this.y = y;
    this.explode(3200, smokeCount);
}
;
UIExplosionEmitter.prototype.retire = function() {
    this.kill();
    this.visible = false;
    this.callAll('retire');
}
;
