//Settings improvements and UIGameIconImage adjustments
function createPolygon(count, radiusX, radiusY) {
    const positions = [];
    if (count <= 0) return positions;

    const angleStep = (Math.PI * 2) / count;
    const centerX = 0;
    const centerY = 0;

    for (let i = 0; i < count; i++) {
        const angle = i * angleStep - Math.PI / 4; 
        const x = centerX + Math.cos(angle) * radiusX;
        const y = centerY + Math.sin(angle) * radiusY;
        const flipped = x > 0;
        positions.push({ x, y, flipped });
    }

    return positions;
}


const reloadGame = () => {
    const game = GameManager.getGame();
    if (game) {
        const gameController = GameManager.getGameController();

        game?.load.reset(true, true);
        game.destroy();
        GameManager.phaserInstance = null;
        const newGameInstance = GameManager.insertGame($('#game'));

        if (!gameController) return;

        gameController.endGame();
        return;
    }
};

UIConstants = UIConstants || {};
UIConstants.GAME_ICON_WIDTH_BASE = UIConstants.GAME_ICON_WIDTH_BASE || (UIConstants.GAME_ICON_WIDTH || 100);
UIConstants.GAME_ICON_HEIGHT_BASE = UIConstants.GAME_ICON_HEIGHT_BASE || (UIConstants.GAME_ICON_HEIGHT || 100);
const savedIconCount = parseInt(localStorage.getItem('gameiconcount'), 10);

if (!isNaN(savedIconCount)) {
    UIConstants.GAME_ICON_POOL_SIZE = savedIconCount;
    UIConstants.GAME_ICON_COUNT = savedIconCount;
} else {
    UIConstants.GAME_ICON_POOL_SIZE = 6;
    UIConstants.GAME_ICON_COUNT = 6;
}

UIConstants.TANK_ICON_HORIZONTAL_SPACING = UIConstants.TANK_ICON_HORIZONTAL_SPACING || (UIConstants.GAME_ICON_WIDTH_BASE * 0.9);
UIConstants.generateTankIconPlacements = function(count) {
    UIConstants.TANK_ICON_PLACEMENTS = [];
    UIConstants.TANK_NAME_PLACEMENTS = [];

    if (count !== 4) {
        console.warn("This layout is designed for 4 tanks. Adjust accordingly for other counts.");
    }

    var spacing = UIConstants.TANK_ICON_HORIZONTAL_SPACING;

    for (var i = 0; i < count; ++i) {
        var x, flipped;
        if (i < count / 2) {
            x = -spacing/2 + i * spacing;
            flipped = false;
        } else {
            x = spacing/2 + (i - count/2) * spacing;
            flipped = true;
        }

        UIConstants.TANK_ICON_PLACEMENTS.push({ x: x, y: -1, flipped: flipped });
        UIConstants.TANK_NAME_PLACEMENTS.push({ x: x, y: 20 });
    }
};

UIConstants.generateTankIconPlacements(UIConstants.GAME_ICON_COUNT);

UIGameIconImage = function(game) {
    Phaser.Image.call(this, game, 0, 0, 'gameicon', 0);
    this.anchor.setTo(0.5, 0.5);

    this.gameModeIcon = this.addChild(new Phaser.Sprite(this.game, 0, 0, 'gamemodeicon', 0));
    this.gameModeIcon.anchor.setTo(0.5, 0.5);

    this.tankIconGroup = this.game.add.group(this);
    this.tankNameGroup = this.game.add.group(this);

    this.tankIcons = {};
    this.iconPlacements = [];

    for (var i = 0; i < UIConstants.GAME_ICON_POOL_SIZE; ++i) {
        this.tankIconGroup.add(new UITankIconImage(this.game, true, UIConstants.TANK_ICON_SIZES.SMALL));
        this.tankNameGroup.add(new UITankIconNameGroup(this.game, UIConstants.TANK_ICON_WIDTH_SMALL, true));
    }

    this.removeTween = null;
    this.scale.set(0.0, 0.0);
    this.kill();
};

UIGameIconImage.prototype = Object.create(Phaser.Image.prototype);
UIGameIconImage.prototype.constructor = UIGameIconImage;

UIGameIconImage.prototype.update = function() {
    if (!this.exists) return;
    for (var playerId in this.tankIcons) {
        this.tankIcons[playerId].icon?.update();
        this.tankIcons[playerId].name?.update();
    }
};

UIGameIconImage.prototype.spawn = function(x, y, gameState) {
    this.reset(x, y);

	this.gameId = gameState.getId();
	this.mode = gameState.getMode();
	this.ranked = gameState.getRanked();
    this.symmetric = gameState.getSymmetric && gameState.getSymmetric();
    this.premium   = gameState.getPremium && gameState.getPremium();
	this.playerStates = gameState.getPlayerStates().sort((first, sec) => first.getQueued() - sec.getQueued());

    var count = this.playerStates.length;
    this.iconPlacements = createPolygon(count, 90, 60);

    this._updateUI();

    var delay = 50 + Math.random() * 200;
    if (this.removeTween) this.removeTween.stop();
    this.game.add.tween(this.scale).to({
        x: UIConstants.ASSET_SCALE / 1.3,
        y: UIConstants.ASSET_SCALE / 1.3
    }, UIConstants.ELEMENT_POP_IN_TIME, Phaser.Easing.Back.Out, true, delay);
};

UIGameIconImage.prototype.refresh = function(gameState, favouriteActiveQueuedCounts) {
    this.mode = gameState.getMode();
    this.ranked = gameState.getRanked();
    this.symmetric = gameState.getSymmetric && gameState.getSymmetric();
    this.premium   = gameState.getPremium && gameState.getPremium();
    this.playerStates = gameState.getPlayerStates();

    var tankCount = this.playerStates.length;
    this.iconPlacements = createPolygon(tankCount, 90, 60);
    this.favouriteActiveQueuedCounts = favouriteActiveQueuedCounts;

    this._updateUI();
};

UIGameIconImage.prototype._updateUI = function() {
    this.frame = (this.symmetric ? 1 : 0) * 2 + (this.premium ? 1 : 0);

    var iconFrame = UIConstants.GAME_MODE_NAME_INFO[this.mode]?.ICON ?? -1;
    if (iconFrame < 0) {
        this.gameModeIcon.visible = false;
    } else {
        this.gameModeIcon.frame = iconFrame * 2 + (this.premium ? 1 : 0);
        this.gameModeIcon.visible = true;
    }

    for (var playerId in this.tankIcons) {
        if (!this.playerStates.some(ps => ps.getPlayerId() === playerId)) {
            this.tankIcons[playerId].icon.remove();
            this.tankIcons[playerId].name.remove();
            delete this.tankIcons[playerId];
        }
    }

    for (var i = 0; i < this.playerStates.length && i < this.iconPlacements.length; i++) {
        var ps = this.playerStates[i];
        var playerId = ps.getPlayerId();
        var placement = this.iconPlacements[i];

        if (!this.tankIcons[playerId]) {
            var freeIcon = this.tankIconGroup.children.find(icon => !Object.values(this.tankIcons).some(t => t.icon === icon));
            var freeName = this.tankNameGroup.children.find(name => !Object.values(this.tankIcons).some(t => t.name === name));

            if (!freeIcon || !freeName) {
                console.error("No free tank icon or name available for player", playerId);
                continue;
            }

            freeIcon.spawn(placement.x, placement.y - 20, playerId, placement.flipped, true);
            freeName.spawn(placement.x, placement.y + 20, playerId, undefined, this.ranked);

            this.tankIcons[playerId] = { icon: freeIcon, name: freeName };
        } else {
            var t = this.tankIcons[playerId];
            t.icon.refresh();
            t.icon.x = placement.x;
            t.icon.y = placement.y - 20;
            t.icon.scale.x = placement.flipped ? -Math.abs(t.icon.scale.x) : Math.abs(t.icon.scale.x);

            t.name.refresh(undefined, undefined, undefined, this.ranked);
            t.name.x = placement.x;
            t.name.y = placement.y + 20;
        }
    }
};

UIGameIconImage.prototype.remove = function() {
    this.removeTween = this.game.add.tween(this.scale).to({
        x: 0,
        y: 0
    }, UIConstants.ELEMENT_GLIDE_OUT_TIME, Phaser.Easing.Linear.None, true);

    this.removeTween.onComplete.add(() => this.kill());

    this.tankIconGroup.callAll('remove');
    this.tankNameGroup.callAll('remove');

    this.tankIcons = {};
};

UIGameIconImage.prototype.retire = function() {
    this.kill();
    this.tankIconGroup.callAll('retire');
    this.tankNameGroup.callAll('retire');
};

var TankTrouble = TankTrouble || {};
TankTrouble.SettingsBox = {
    settings: null,
    settingsContent: null,
    settingsTabTop: null,
    settingsServerTitleDiv: null,
    settingsServerForm: null,
    settingsServerSelect: null,
    settingsServerOptions: [],
    settingsQualityTitleDiv: null,
    settingsQualityForm: null,
    settingsQualitySelect: null,
    settingsQualityOptions: [],
    settingsGameCountDiv: null,
    settingsGameCountForm: null,
    settingsGameCountSelect: null,
    settingsGameCountOptions: [],
    settingsBackground: null,
    refreshServerStatsInterval: null,
    showing: false,
    initialized: false,

    init: function() {
        $.widget("custom.iconselectmenu", $.ui.selectmenu, {
            _renderItem: function(ul, item) {
                var li = $("<li>", {
                    text: item.label
                });
                if (item.disabled) {
                    li.addClass("ui-state-disabled");
                }
                if (item.element.attr("data-imagesrc")) {
                    $("<img width='26' src='" + item.element.attr("data-imagesrc") + "' srcset='" + item.element.attr("data-imagesrcset") + "'/>").addClass("ui-icon").appendTo(li);
                }
                if (item.element.attr("data-description")) {
                    $("<div style='font-size: 0.7em;'>" + item.element.attr("data-description") + "</div>").appendTo(li);
                }
                return li.appendTo(ul);
            }
        });

        this.settings = $("<div class='box noselect' id='settings'></div>");
        this.settingsContent = $("<div class='content'></div>");
        this.settingsTabTop = $("<div class='tab topRight'></div>");

        this.settingsServerTitleDiv = $("<div class='spaced'>Server:</div>");
        this.settingsServerForm = $("<form class='spaced'></form>");
        this.settingsServerSelect = $("<select/>");
        var servers = ClientManager.getAvailableServers();
        var serverIds = Object.keys(servers);
        for (var i = 0; i < serverIds.length; ++i) {
            var serverData = servers[serverIds[i]];
            var option = $("<option disabled value='" + serverIds[i] + "' data-imagesrc='" + g_url("assets/images/header/pingTimeNoConnection.png") + "' data-imagesrcset='" + g_url("assets/images/header/pingTimeNoConnection@2x.png") + " 2x' data-description=' (N/A ms)'>" + serverData.name + "</option>");
            this.settingsServerOptions.push(option);
        }

        this.settingsQualityTitleDiv = $("<div class='spaced'>Quality:</div>");
        this.settingsQualityForm = $("<form class='spaced'></form>");
        this.settingsQualitySelect = $("<select/>");
        this.settingsQualityOptions.push($("<option selected value='auto' data-imagesrc='" + g_url("assets/images/header/pingTimeNoConnection.png") + "' data-imagesrcset='" + g_url("assets/images/header/pingTimeNoConnection@2x.png") + " 2x' data-description=' (N/A fps)'>Auto</option>"));
        this.settingsQualityOptions.push($("<option value='high'>High</option>"));
        this.settingsQualityOptions.push($("<option value='low'>Low</option>"));

        this.settingsGameCountDiv = $("<div class='spaced'>Game Count:</div>");
        this.settingsGameCountForm = $("<form class='spaced'></form>");
        this.settingsGameCountSelect = $("<select/>");
        this.settingsGameCountOptions.push($("<option selected value='3'>3</option>"));
        this.settingsGameCountOptions.push($("<option value='4'>4</option>"));
        this.settingsGameCountOptions.push($("<option value='5'>5</option>"));
        this.settingsGameCountOptions.push($("<option value='6'>6</option>"));

        this.settingsBackground = $("<div class='boxbackground'></div>");

        for (var i = 0; i < this.settingsServerOptions.length; ++i) {
            this.settingsServerSelect.append(this.settingsServerOptions[i]);
        }
        this.settingsServerForm.append(this.settingsServerSelect);

        for (var i = 0; i < this.settingsQualityOptions.length; ++i) {
            this.settingsQualitySelect.append(this.settingsQualityOptions[i]);
        }
        this.settingsQualityForm.append(this.settingsQualitySelect);

        for (var i = 0; i < this.settingsGameCountOptions.length; ++i) {
            this.settingsGameCountSelect.append(this.settingsGameCountOptions[i]);
        }
        this.settingsGameCountForm.append(this.settingsGameCountSelect);

        this.settingsContent.append(this.settingsTabTop);
        this.settingsContent.append(this.settingsServerTitleDiv);
        this.settingsContent.append(this.settingsServerForm);
        this.settingsContent.append(this.settingsQualityTitleDiv);
        this.settingsContent.append(this.settingsQualityForm);
        this.settingsContent.append(this.settingsGameCountDiv);
        this.settingsContent.append(this.settingsGameCountForm);

        this.settings.append(this.settingsContent);
        $("body").append(this.settingsBackground);
        $("body").append(this.settings);
        this.settingsBackground.hide();
        this.settings.hide();

        var self = this;
        this.settingsBackground.click(function(event) {
            if (self.showing) {
                self.hide();
            }
        });

        this.settingsServerSelect.css("width", UIConstants.SETTINGS_WIDTH - 10);
        this.settingsServerSelect.css("height", UIConstants.SETTINGS_SERVER_SELECT_HEIGHT);
        this.settingsQualitySelect.css("width", UIConstants.SETTINGS_WIDTH - 10);
        this.settingsQualitySelect.css("height", UIConstants.SETTINGS_QUALITY_SELECT_HEIGHT);
        this.settingsGameCountSelect.css("width", UIConstants.SETTINGS_WIDTH - 10);
        this.settingsGameCountSelect.css("height", UIConstants.SETTINGS_QUALITY_SELECT_HEIGHT);

        if (Cookies.get('multiplayerserverid')) {
            this.settingsServerSelect.val(Cookies.get('multiplayerserverid'));
        }
        if (Cookies.get('quality')) {
            this.settingsQualitySelect.val(Cookies.get('quality'));
        }
        var savedCount = localStorage.getItem('gameiconcount');
        if (savedCount) {
            this.settingsGameCountSelect.val(savedCount);
                UIConstants.GAME_ICON_POOL_SIZE = parseInt(savedCount, 10);
                UIConstants.GAME_ICON_COUNT = parseInt(savedCount, 10);
        } else {
            this.settingsGameCountSelect.val(String(UIConstants.GAME_ICON_COUNT));
        }

        this.settingsServerSelect.iconselectmenu({
            change: function(event, ui) {
                self._changeServer(event, ui);
            }
        }).iconselectmenu("menuWidget").addClass("ui-menu-icons").css("max-height", UIConstants.SETTINGS_SERVER_MAX_OPTION_HEIGHT);

        this.settingsQualitySelect.iconselectmenu({
            change: function(event, ui) {
                self._changeQuality(event, ui);
            }
        }).iconselectmenu("menuWidget").addClass("ui-menu-icons").css("max-height", UIConstants.SETTINGS_QUALITY_MAX_OPTION_HEIGHT);

        this.settingsGameCountSelect.iconselectmenu({
            change: function(event, ui) {
                self._changeGameCount(event, ui);
            }
        }).iconselectmenu("menuWidget").addClass("ui-menu-icons").css("max-height", UIConstants.SETTINGS_QUALITY_MAX_OPTION_HEIGHT);

        this.initialized = true;
        QualityManager.addEventListener(this._qualityEventHandler, this);
        this._setQuality(QualityManager.getQuality());

        this.refreshServerStatsInterval = setInterval(function() {
            self._refreshServerStats();
        }, UIConstants.REFRESH_SERVER_STATS_INTERVAL);
        setTimeout(function() {
            self._refreshServerStats();
        }, UIConstants.INITIAL_SERVER_STATS_DELAY);
    },

    show: function(x, y, preferredRadius) {
        this.settings.show();
        this.settingsBackground.fadeIn(200);
        this.showing = true;
        this.settings.removeClass("left right top bottom");
        this.settings.position({
            my: "right top",
            at: "left+" + (x + 35) + " top+" + (y + preferredRadius + 30),
            of: $(document),
            collision: 'none'
        });
        this.settings.addClass("topRight");
        this.settings.css({
            scale: 0.1,
            opacity: 0,
            transformOrigin: '225px -35px'
        });
        this.settings.transition({
            scale: 1,
            queue: false
        }, 300, 'easeOutBack');
        this.settings.animate({
            opacity: 1
        }, {
            duration: 200,
            queue: false
        });
        GameManager.disableGameInput();
    },

    hide: function() {
        var self = this;
        this.settings.transition({
            scale: 0,
            queue: false
        }, 200, 'easeInQuad', function() {
            self.settings.hide();
            self.settings.css({
                scale: 1
            });
        });
        this.settings.animate({
            opacity: 0
        }, {
            duration: 200,
            queue: false
        });
        this.settingsBackground.fadeOut(200);
        TankTrouble.SettingsButton.close();
        this.settingsServerSelect.iconselectmenu("widget").blur();
        this.settingsQualitySelect.iconselectmenu("widget").blur();
        this.settingsGameCountSelect.iconselectmenu("widget").blur();
        this.showing = false;
        GameManager.enableGameInput();
    },

    setServer: function(serverId) {
        if (this.settingsServerSelect) {
            this.settingsServerSelect.val(serverId);
            this.settingsServerSelect.iconselectmenu("refresh");
        }
    },

    enableServer: function(serverId, latency) {
        if (this.settingsServerSelect) {
            var option = this.settingsServerSelect.find("option[value='" + serverId + "']");
            option.removeAttr("disabled");
            option.attr("data-description", " (" + latency + " ms)");
            if (latency < UIConstants.MAXIMUM_GOOD_LATENCY) {
                option.attr("data-imagesrc", "/assets/images/header/pingTimeGood.png");
                option.attr("data-imagesrcset", "/assets/images/header/pingTimeGood@2x.png 2x");
            } else if (latency < UIConstants.MAXIMUM_AVERAGE_LATENCY) {
                option.attr("data-imagesrc", "/assets/images/header/pingTimeAverage.png");
                option.attr("data-imagesrcset", "/assets/images/header/pingTimeAverage@2x.png 2x");
            } else {
                option.attr("data-imagesrc", "/assets/images/header/pingTimeBad.png");
                option.attr("data-imagesrcset", "/assets/images/header/pingTimeBad@2x.png 2x");
            }
            this.settingsServerSelect.iconselectmenu("refresh");
        }
    },

    disableServer: function(serverId) {
        if (this.settingsServerSelect) {
            var option = this.settingsServerSelect.find("option[value='" + serverId + "']");
            option.attr("disabled", "disabled");
            option.attr("data-description", " Offline");
            option.attr("data-imagesrc", "/assets/images/header/pingTimeNoConnection.png");
            option.attr("data-imagesrcset", "/assets/images/header/pingTimeNoConnection@2x.png 2x");
            this.settingsServerSelect.iconselectmenu("refresh");
        }
    },

    _changeServer: function(event, ui) {
        this.hide();
        ClientManager.selectMultiplayerServer(ui.item.value);
    },

    _refreshServerStats: function() {
        var self = this;
        ClientManager.getAvailableServerStats(function(success, serverId, latency, gameCount, playerCount, message) {
            if (success) {
                self.enableServer(serverId, latency);
            } else {
                self.disableServer(serverId);
            }
        });
    },

    _setQuality: function(quality) {
        this.settingsQualitySelect.val(quality);
        this.settingsQualitySelect.iconselectmenu("refresh");
    },

    _updateFps: function(fps) {
        var option = this.settingsQualitySelect.find("option[value='auto']");
        if (fps) {
            option.attr("data-description", " (" + Math.floor(fps) + " fps)");
            if (fps > UIConstants.MINIMUM_GOOD_FPS) {
                option.attr("data-imagesrc", "/assets/images/header/pingTimeGood.png");
                option.attr("data-imagesrcset", "/assets/images/header/pingTimeGood@2x.png 2x");
            } else if (fps > UIConstants.MINIMUM_AVERAGE_FPS) {
                option.attr("data-imagesrc", "/assets/images/header/pingTimeAverage.png");
                option.attr("data-imagesrcset", "/assets/images/header/pingTimeAverage@2x.png 2x");
            } else {
                option.attr("data-imagesrc", "/assets/images/header/pingTimeBad.png");
                option.attr("data-imagesrcset", "/assets/images/header/pingTimeBad@2x.png 2x");
            }
        } else {
            option.attr("data-description", " (N/A fps)");
            option.attr("data-imagesrc", "/assets/images/header/pingTimeNoConnection.png");
            option.attr("data-imagesrcset", "/assets/images/header/pingTimeNoConnection@2x.png 2x");
        }
        this.settingsQualitySelect.iconselectmenu("refresh");
    },

    _changeQuality: function(event, ui) {
        this.hide();
        QualityManager.setQuality(ui.item.value);
    },

    _qualityEventHandler: function(self, evt, data) {
        switch (evt) {
        case QualityManager.EVENTS.QUALITY_SET:
            {
                self._setQuality(data);
                break;
            }
        case QualityManager.EVENTS.FPS_UPDATED:
            {
                self._updateFps(data);
                break;
            }
        }
    },

    _changeGameCount: function(event, ui) {
    var count = parseInt(ui.item.value, 10);
    if (!count || count < 1) return;

    localStorage.setItem('gameiconcount', String(count));

    UIConstants.GAME_ICON_POOL_SIZE = count;
    UIConstants.GAME_ICON_COUNT = count;

    var scaleMap = { 3: 0.7, 4: 0.7, 5: 0.7, 6: 0.7 };
    var iconScale = scaleMap[count];

    UIConstants.GAME_ICON_WIDTH = Math.round(UIConstants.GAME_ICON_WIDTH_BASE * iconScale);
    UIConstants.GAME_ICON_HEIGHT = Math.round(UIConstants.GAME_ICON_HEIGHT_BASE * iconScale);

    UIConstants.TANK_ICON_HORIZONTAL_SPACING = UIConstants.GAME_ICON_WIDTH * 0.9;
    UIConstants.generateTankIconPlacements(count);

    TankTrouble._gameIconInstances = TankTrouble._gameIconInstances || [];
    for (var i = 0; i < TankTrouble._gameIconInstances.length; ++i) {
        try {
            var inst = TankTrouble._gameIconInstances[i];
            if (!inst) continue;

            if (inst.rebuildTankIconGroups) inst.rebuildTankIconGroups();

            if (inst.playerStates) {
                var tankCount = inst.playerStates.length;
                var radiusX = 90 * iconScale;
                var radiusY = 60 * iconScale;
                inst.iconPlacements = createPolygon(tankCount, radiusX, radiusY);
                inst._updateUI();
                inst.scale.set(iconScale, iconScale);
            }
        } catch (e) {
            console.error("Error updating UIGameIconImage instance:", e);
        }
    }

    if (typeof LobbyManager !== 'undefined' && LobbyManager.refreshGameList) {
        try { LobbyManager.refreshGameList(); } catch (e) {}
    }
    if (typeof GameManager !== 'undefined' && GameManager.rebuildLobbyIcons) {
        try { GameManager.rebuildLobbyIcons(); } catch (e) {}
    }

    this.hide();
    try { reloadGame(); } catch (e) {}
}
};
