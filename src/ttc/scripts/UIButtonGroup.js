// UI Button Group
UIButtonGroup = function (game, x, y, type, size, text, pressedFunction, context, minWidth, keyboardShortcut) {
    Phaser.Group.call(this, game, null);
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
    this.text = text;
    this.pressedFunction = pressedFunction;
    this.context = context;
    this.minWidth = minWidth || 0;
    this.keyboardShortcut = keyboardShortcut || false;
    this.isInputEnabled = true;
    this.isEnabled = true;
    this.setSize(this.size);
    this.enable();
    this.removeTween = null;
    this.spawnTween = null;
    this.idleTween = null;
    this.hoverTween = null;
    this.scale.set(0.0, 0.0);
    this.exists = false;
    this.visible = false;
};
UIButtonGroup.prototype = Object.create(Phaser.Group.prototype);
UIButtonGroup.prototype.constructor = UIButtonGroup;
UIButtonGroup.prototype.spawn = function () {
    this.exists = true;
    this.visible = true;
    this.enable();
    var delay = 50 + Math.random() * 200;
    if (this.removeTween) {
        this.removeTween.stop();
        this.removeTween = null;
    }
    this.spawnTween = this.game.add.tween(this.scale).to({
        x: 1,
        y: 1
    }, UIConstants.ELEMENT_POP_IN_TIME, Phaser.Easing.Back.Out, true, delay);
    this.spawnTween.onComplete.add(this.startIdleAnimation, this);
};

UIButtonGroup.prototype.startIdleAnimation = function () {
    if (this.idleTween) return;
    this.angle = 0;
    var angle = 2.0 + Math.random() * -4.0;
    var duration = 1600;
    this.idleTween = this.game.add.tween(this)
        .to({ angle: angle }, duration, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
};

UIButtonGroup.prototype.stopIdleAnimation = function () {
    if (this.idleTween) {
        this.idleTween.stop();
        this.idleTween = null;
    }
    this.rotation = 0;
};

UIButtonGroup.prototype.startHoverAnimation = function () {
    if (this.hoverTween) this.hoverTween.stop();
    this.stopIdleAnimation();
    this.hoverTween = this.game.add.tween(this.scale).to(
        { x: 1.08, y: 1.08 },
        120,
        Phaser.Easing.Quadratic.Out,
        true
    );
};

UIButtonGroup.prototype.stopHoverAnimation = function () {
    if (this.hoverTween) this.hoverTween.stop();
    this.hoverTween = this.game.add.tween(this.scale).to(
        { x: 1.0, y: 1.0 },
        120,
        Phaser.Easing.Quadratic.Out,
        true
    );
    this.hoverTween.onComplete.add(function () {
        this.startIdleAnimation();
    }, this);
};

UIButtonGroup.prototype.setMinWidth = function (minWidth) {
    this.minWidth = minWidth;
    this._updateSize();
};

UIButtonGroup.prototype.setText = function (text) {
    this.text = text;
    this.buttonText.setText(text);
    this._updateSize();
};

UIButtonGroup.prototype.setSize = function (size) {
    this.size = size;
    if (this.buttonSlice) {
        this.removeChild(this.buttonSlice);
        this.buttonSlice.destroy();
    }
    this.buttonSlice = this.addChild(new PhaserNineSlice.NineSlice(this.game, 0, 0, 'button' + this.type + UIConstants.BUTTON_RESOLUTIONS[this.size], null, 1, 1));
    this.buttonSlice.anchor.setTo(0.5);
    if (this.buttonSliceActive) {
        this.removeChild(this.buttonSliceActive);
        this.buttonSliceActive.destroy();
    }
    this.buttonSliceActive = this.addChild(new PhaserNineSlice.NineSlice(this.game, 0, 0, 'button' + this.type + UIConstants.BUTTON_RESOLUTIONS[this.size] + 'Active', null, 1, 1));
    this.buttonSliceActive.anchor.setTo(0.5);
    if (this.buttonSliceDisabled) {
        this.removeChild(this.buttonSliceDisabled);
        this.buttonSliceDisabled.destroy();
    }
    this.buttonSliceDisabled = this.addChild(new PhaserNineSlice.NineSlice(this.game, 0, 0, 'button' + UIConstants.BUTTON_RESOLUTIONS[this.size] + 'Disabled', null, 1, 1));
    this.buttonSliceDisabled.anchor.setTo(0.5);
    if (this.buttonText) {
        this.removeChild(this.buttonText);
        this.buttonText.destroy();
    }
    this.buttonText = this.addChild(new Phaser.Text(this.game, 0, 0, this.text, {
        font: UIConstants.BUTTON_FONT_SIZES[this.size] + "px TankTrouble",
        fill: "#000"
    }));
    this.buttonText.anchor.setTo(0.5);
    this.buttonTextY = UIUtils.computeButtonTextY(this.size, UIConstants.BUTTON_FONT_BASELINE_FRACTION);
    this.buttonText.y = this.buttonTextY;
    this._updateSize();
    if (this.isInputEnabled) {
        this.buttonSlice.inputEnabled = true;
        this.buttonSlice.input.useHandCursor = true;
        this.buttonSliceActive.inputEnabled = true;
        this.buttonSliceActive.input.useHandCursor = true;
        this.buttonSlice.events.onInputOver.add(this._onHoverOver, this);
        this.buttonSlice.events.onInputOut.add(this._onHoverOut, this);
        this.buttonSliceActive.events.onInputOver.add(this._onHoverOver, this);
        this.buttonSliceActive.events.onInputOut.add(this._onHoverOut, this);
    } else {
        this.buttonSlice.inputEnabled = false;
        this.buttonSliceActive.inputEnabled = false;
    }
    if (this.isEnabled) {
        this.buttonSlice.revive();
        this.buttonSliceActive.kill();
        this.buttonSliceDisabled.kill();
    } else {
        this.buttonSlice.kill();
        this.buttonSliceActive.kill();
        this.buttonSliceDisabled.revive();
        this.buttonText.y = this.buttonTextY;
    }
    UIUtils.addButton(this.buttonSlice,
        function (self) {
            self.game.input.mousePointer.leftButton.reset();
            self.buttonSlice.kill();
            self.buttonSliceActive.revive();
            self.buttonText.y = self.buttonTextY + UIConstants.BUTTON_ACTIVE_OFFSET;
        },
        function (self) {
            self.buttonSlice.revive();
            self.buttonSliceActive.kill();
            self.buttonText.y = self.buttonTextY;
        },
        function (self) {
            self.pressedFunction.call(self.context);
        },
        this
    );
};

UIButtonGroup.prototype._onHoverOver = function () {
    if (this.isEnabled) this.startHoverAnimation();
};

UIButtonGroup.prototype._onHoverOut = function () {
    if (this.isEnabled) this.stopHoverAnimation();
};

UIButtonGroup.prototype.enableInput = function () {
    this.isInputEnabled = true;
    this.buttonSlice.inputEnabled = true;
    this.buttonSlice.input.useHandCursor = true;
    this.buttonSliceActive.inputEnabled = true;
    this.buttonSliceActive.input.useHandCursor = true;
};

UIButtonGroup.prototype.disableInput = function () {
    this.isInputEnabled = false;
    this.buttonSlice.inputEnabled = false;
    this.buttonSliceActive.inputEnabled = false;
};

UIButtonGroup.prototype.enable = function () {
    this.isEnabled = true;
    this.enableInput();
    this.buttonSlice.revive();
    this.buttonSliceActive.kill();
    this.buttonSliceDisabled.kill();
};

UIButtonGroup.prototype.disable = function () {
    this.isEnabled = false;
    this.disableInput();
    this.buttonSlice.kill();
    this.buttonSliceActive.kill();
    this.buttonSliceDisabled.revive();
    this.buttonText.y = this.buttonTextY;
};

UIButtonGroup.prototype._updateSize = function () {
    var width = Math.max(this.minWidth, this.buttonText.width + 2 * UIConstants.BUTTON_MARGINS[this.size]) + 2 * UIConstants.BUTTON_SHADOW_WIDTH;
    var height = UIConstants.BUTTON_HEIGHTS[this.size] + UIConstants.BUTTON_SHADOW_HEIGHT_TOP + UIConstants.BUTTON_SHADOW_HEIGHT_BOTTOM;
    this.buttonSlice.resize(width, height);
    this.buttonSliceActive.resize(width, height);
    this.buttonSliceDisabled.resize(width, height);
};

UIButtonGroup.prototype.update = function () {
    if (!this.exists) return;
    if (this.isEnabled && this.isInputEnabled && this.keyboardShortcut) {
        if (this.game.input.keyboard.downDuration(this.keyboardShortcut, 16)) {
            this.pressedFunction.call(this.context);
        }
    }
    Phaser.Group.prototype.update.call(this);
};

UIButtonGroup.prototype.postUpdate = function () {
    if (!this.exists) return;
    Phaser.Group.prototype.postUpdate.call(this);
};

UIButtonGroup.prototype.remove = function () {
    this.disableInput();
    this.stopIdleAnimation();
    if (this.spawnTween) {
        this.spawnTween.stop();
        this.spawnTween = null;
    }
    this.removeTween = this.game.add.tween(this.scale).to({
        x: 0,
        y: 0
    }, UIConstants.ELEMENT_GLIDE_OUT_TIME, Phaser.Easing.Linear.None, true);
    this.removeTween.onComplete.add(function () {
        this.exists = false;
        this.visible = false;
    }, this);
};

UIButtonGroup.prototype.retire = function () {
    this.exists = false;
    this.visible = false;
};
