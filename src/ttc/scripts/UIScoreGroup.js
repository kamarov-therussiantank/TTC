// UI Tank Icon Score Group
UITankIconScoreGroup = function(game) {
    Phaser.Group.call(this, game, null);
    GameManager.addGameEventListener(this._gameEventHandler, this);
    ClientManager.getClient().addStateChangeListener(this._clientStateChangeHandler, this);
    this.itemGroup = this.game.add.group(this);
    this.fragmentGroup = this.game.add.group(this);
    for (var i = 0; i < UIConstants.SCORE_FRAGMENT_POOL_SIZE; ++i) {
        this.fragmentGroup.add(new UIScoreExplosionFragmentSprite(game));
    }
    this.emitter = this.addChild(new UIScoreExplosionEmitter(game));
    this.playerId = null;
    this.removeTween = null;
    this.scale.set(0.0, 0.0);
    this.exists = false;
    this.visible = false;
    this.latestGameState = null;
    this.items = null;
    this.centerIndex = null;
    this.log = Log.create('UITankIconScoreGroup');
};

UITankIconScoreGroup.prototype = Object.create(Phaser.Group.prototype);
UITankIconScoreGroup.prototype.constructor = UITankIconScoreGroup;
UITankIconScoreGroup.prototype._gameEventHandler = function(self, id, evt, data) {
    switch (evt) {
    case GameModel._EVENTS.GAME_STATE_CHANGED:
        {
            self.latestGameState = data;
            self._updateItemsWithLatestGameState();
            break;
        }
    case GameModel._EVENTS.GAME_ENDED:
        {
            self._clearItems();
            break;
        }
    }
};

UITankIconScoreGroup.prototype._clientStateChangeHandler = function(self, oldState, newState, data, msg) {
    self.log.debug("Client state: " + newState + ": " + msg);
    switch (newState) {
    case TTClient.STATES.UNCONNECTED:
        {
            self._clearItems();
            break;
        }
    }
};

UITankIconScoreGroup.prototype._updateItemsWithLatestGameState = function() {
    if (!this.game) {
        return;
    }
    if (this.latestGameState) {
        if (!this.items) {
            var info = UIConstants.GAME_MODE_SCORE_ITEM_INFO[this.latestGameState.getMode()];
            this.items = [];
            this.centerIndex = info.CENTER_ITEM;
            for (var i = 0; i < info.ITEM_CONFIG.length; ++i) {
                var config = info.ITEM_CONFIG[i];
                var newDisplayObject = null;
                switch (config.category) {
                case UIConstants.SCORE_CATEGORIES.EMBLEM:
                    {
                        newDisplayObject = this.itemGroup.addChild(new Phaser.Image(this.game,0,0,'playerpanel','emblem' + config.type));
                        newDisplayObject.scale.setTo(0.0, 0.0);
                        break;
                    }
                case UIConstants.SCORE_CATEGORIES.SCORE:
                    {
                        newDisplayObject = this.itemGroup.addChild(new Phaser.Text(this.game,0,0,'',{
                            font: UIConstants.SCORE_FONT_SIZE + "px TankTrouble",
                            fill: "#444",
                            stroke: "#444",
                            strokeThickness: UIConstants.SCORE_STROKE_WIDTH
                        }));
                        break;
                    }
                case UIConstants.SCORE_CATEGORIES.SEPARATOR:
                    {
                        newDisplayObject = this.itemGroup.addChild(new Phaser.Image(this.game,0,0,'playerpanel','separator'));
                        break;
                    }
                }
                newDisplayObject.anchor.set(config.anchorX, 0.5);
                newDisplayObject.y = UIConstants.SCORE_ITEM_INFO[config.category].offsetY;
                this.items.push({
                    category: config.category,
                    type: config.type,
                    displayObject: newDisplayObject,
                    spawnTween: null,
                    removeTween: null
                });
            }
            this._updateItemPositions(false);
        }
        for (var i = 0; i < this.items.length; ++i) {
            var item = this.items[i];
            switch (item.category) {
            case UIConstants.SCORE_CATEGORIES.EMBLEM:
                {
                    var emblemFound = false;
                    var emblemStates = this.latestGameState.getEmblemStates();
                    for (var j = 0; j < emblemStates.length; ++j) {
                        if (this.playerId == emblemStates[j].getPlayerId()) {
                            if (item.type == emblemStates[j].getType()) {
                                emblemFound = true;
                                break;
                            }
                        }
                    }
                    this._updateEmblem(item, emblemFound);
                    break;
                }
            case UIConstants.SCORE_CATEGORIES.SCORE:
                {
                    var scoreStates = this.latestGameState.getScoreStates();
                    for (var j = 0; j < scoreStates.length; ++j) {
                        if (this.playerId == scoreStates[j].getPlayerId()) {
                            if (item.type == scoreStates[j].getType()) {
                                this._updateScore(item, scoreStates[j].getValue());
                                break;
                            }
                        }
                    }
                    break;
                }
            case UIConstants.SCORE_CATEGORIES.SEPARATOR:
                {
                    item.displayObject.revive();
                    break;
                }
            }
        }
        this._updateItemPositions(true);
    }
};

UITankIconScoreGroup.prototype._updateItemPositions = function(animate) {
    var centerItem = this.items[this.centerIndex];
    this._updateItemPosition(centerItem, 0, animate);
    var centerItemWidth = centerItem.displayObject.getLocalBounds().width;
    var offsetX = -centerItemWidth * centerItem.displayObject.anchor.x - UIConstants.SCORE_ITEM_INFO[centerItem.category].paddingX;
    for (var i = this.centerIndex - 1; i >= 0; --i) {
        var item = this.items[i];
        var itemWidth = item.displayObject.getLocalBounds().width;
        var itemPadding = UIConstants.SCORE_ITEM_INFO[item.category].paddingX;
        var itemX = offsetX - itemWidth * (1.0 - item.displayObject.anchor.x) - itemPadding;
        this._updateItemPosition(item, itemX, animate);
        offsetX -= itemWidth + 2 * itemPadding;
    }
    offsetX = centerItemWidth * (1.0 - centerItem.displayObject.anchor.x) + UIConstants.SCORE_ITEM_INFO[centerItem.category].paddingX;
    for (var i = this.centerIndex + 1; i < this.items.length; ++i) {
        var item = this.items[i];
        var itemWidth = item.displayObject.getLocalBounds().width;
        var itemPadding = UIConstants.SCORE_ITEM_INFO[item.category].paddingX;
        var itemX = offsetX + itemWidth * item.displayObject.anchor.x + itemPadding;
        this._updateItemPosition(item, itemX, animate);
        offsetX += itemWidth + 2 * itemPadding;
    }
};

UITankIconScoreGroup.prototype._updateItemPosition = function(item, posX, animate) {
    if (animate) {
        this.game.add.tween(item.displayObject).to({
            x: posX
        }, UIConstants.ELEMENT_POP_IN_TIME, Phaser.Easing.Quadratic.Out, true);
    } else {
        item.displayObject.x = posX;
    }
};
UITankIconScoreGroup.prototype._updateScore = function(item, newValue) {
    var textField = item.displayObject;
    var oldValue = textField.text;
    if (newValue != oldValue && oldValue != '') {
        var centerX = textField.x + (0.5 - textField.anchor.x) * textField.width;
        this.emitter.spawn(centerX, UIConstants.SCORE_EXPLOSION_Y, textField.width);
        var numFragments = Math.min(UIConstants.MAX_SCORE_FRAGMENTS_PER_EXPLOSION, UIConstants.MIN_SCORE_FRAGMENTS_PER_LETTER * oldValue.length + Math.floor(Math.random() * 3));
        for (var i = 0; i < numFragments; ++i) {
            var fragment = this.fragmentGroup.getFirstExists(false);
            if (fragment) {
                fragment.spawn(centerX, UIConstants.SCORE_EXPLOSION_Y, textField.width);
            } else {
                this.log.error("Could not create score fragment sprite. No sprite available.");
            }
        }
    }
    textField.setText(newValue);
};

UITankIconScoreGroup.prototype._updateEmblem = function(item, show) {
    if (show) {
        if (item.removeTween) {
            item.removeTween.stop();
            item.removeTween = null;
        }
        item.spawnTween = this.game.add.tween(item.displayObject.scale).to({
            x: 1.0,
            y: 1.0
        }, UIConstants.ELEMENT_POP_IN_TIME, Phaser.Easing.Back.Out);
        item.spawnTween.start();
    } else {
        if (item.spawnTween) {
            item.spawnTween.stop();
            item.spawnTween = null;
        }
        item.removeTween = this.game.add.tween(item.displayObject.scale).to({
            x: 0.0,
            y: 0.0
        }, UIConstants.ELEMENT_GLIDE_OUT_TIME, Phaser.Easing.Linear.None);
        item.removeTween.start();
    }
};

UITankIconScoreGroup.prototype._clearItems = function() {
    this.latestGameState = null;
    this.items = null;
    this.centerIndex = null;
    this.itemGroup.setAll('pendingDestroy', true);
};

UITankIconScoreGroup.prototype.update = function() {
    if (!this.exists) {
        return;
    }
    Phaser.Group.prototype.update.call(this);
};

UITankIconScoreGroup.prototype.postUpdate = function() {
    if (!this.exists) {
        return;
    }
    Phaser.Group.prototype.postUpdate.call(this);
};

UITankIconScoreGroup.prototype.spawn = function(x, y, playerId) {
    this.exists = true;
    this.visible = true;
    this.x = x;
    this.y = y;
    this.playerId = playerId;
    this._updateItemsWithLatestGameState();
    var delay = 50 + Math.random() * 200;
    if (this.removeTween) {
        this.removeTween.stop();
    }
    this.game.add.tween(this.scale).to({
        x: 1.0,
        y: 1.0
    }, UIConstants.ELEMENT_POP_IN_TIME, Phaser.Easing.Back.Out, true, delay);
};

UITankIconScoreGroup.prototype.refresh = function(x, y) {
    if (x !== undefined) {
        this.game.add.tween(this).to({
            x: x
        }, UIConstants.ELEMENT_MOVE_TIME, Phaser.Easing.Quadratic.InOut, true);
    }
    if (y !== undefined) {
        this.game.add.tween(this).to({
            y: y
        }, UIConstants.ELEMENT_MOVE_TIME, Phaser.Easing.Quadratic.InOut, true);
    }
};

UITankIconScoreGroup.prototype.remove = function() {
    this.removeTween = this.game.add.tween(this.scale).to({
        x: 0.0,
        y: 0.0
    }, UIConstants.ELEMENT_GLIDE_OUT_TIME, Phaser.Easing.Linear.None, true);
    this.removeTween.onComplete.add(function() {
        this._clearItems();
        this.exists = false;
        this.visible = false;
    }, this);
};

UITankIconScoreGroup.prototype.retire = function() {
    this._clearItems();
    this.exists = false;
    this.visible = false;
    GameManager.removeGameEventListener(this._gameEventHandler, this);
    ClientManager.getClient().removeStateChangeListener(this._clientStateChangeHandler, this);
};
