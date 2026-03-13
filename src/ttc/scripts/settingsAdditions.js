const reloadGame = () => {
    const game = GameManager.getGame();
    if (!game) return;
    if (game) {
        const gameController = GameManager.getGameController();
        if (gameController) {
                gameController.endGame();
            }
        game?.load.reset(true, true);
        game.destroy();
        GameManager.phaserInstance = null;
        const newGameInstance = GameManager.insertGame($('#game'));
    }
};
const reloadPlayerPanel = () => {
    if (!UIPlayerPanel.phaserInstance) return;
        const parent = $(UIPlayerPanel.phaserInstance.parent);
        UIPlayerPanel.removePanel();
        UIPlayerPanel.insertPanel(parent);
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
    settingsExtraTitleDiv: null,
    settingsExtraForm: null,
    disableCameraShakeCheckbox: null,
    settingsBackground: null,
    refreshServerStatsInterval: null,
    showing: false,
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
        this.settingsTitleDiv = $("<div class='spaced'>Settings:</div>");
        this.settingsForm = $("<form class='spaced'></form>");
        this.displayAllGamesCheckbox = $("<div><input id='displayAllGames' type='checkbox'/><label class='subheadline' for='displayAllGames'>Display all games</label></div>");
        this.disableCameraShakeCheckbox = $("<div><input id='disableCameraShake' type='checkbox'/><label class='subheadline' for='disableCameraShake'>Disable Camera Shake</label></div>");
        this.disableTankBadgesCheckbox = $("<div><input id='disableTankBadges' type='checkbox'/><label class='subheadline' for='disableTankBadges'>Disable badges</label></div>");
        this.settingsForm.append(this.displayAllGamesCheckbox);
        this.settingsForm.append(this.disableCameraShakeCheckbox);
        this.settingsForm.append(this.disableTankBadgesCheckbox);
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
        this.settingsBackground = $("<div class='boxbackground'></div>");
        for (var i = 0; i < this.settingsServerOptions.length; ++i) {
            this.settingsServerSelect.append(this.settingsServerOptions[i]);
        }
        this.settingsServerForm.append(this.settingsServerSelect);
        for (var i = 0; i < this.settingsQualityOptions.length; ++i) {
            this.settingsQualitySelect.append(this.settingsQualityOptions[i]);
        }
        this.settingsQualityForm.append(this.settingsQualitySelect);
        this.settingsContent.append(this.settingsTabTop);
        this.settingsContent.append(this.settingsTitleDiv);
        this.settingsContent.append(this.settingsForm);
        this.settingsContent.append(this.settingsServerTitleDiv);
        this.settingsContent.append(this.settingsServerForm);
        this.settingsContent.append(this.settingsQualityTitleDiv);
        this.settingsContent.append(this.settingsQualityForm);
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
        if (Cookies.get('multiplayerserverid')) {
            this.settingsServerSelect.val(Cookies.get('multiplayerserverid'));
        }
        if (Cookies.get('quality')) {
            this.settingsQualitySelect.val(Cookies.get('quality'));
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
        this.initialized = true;
        QualityManager.addEventListener(this._qualityEventHandler, this);
        this._setQuality(QualityManager.getQuality());
        this.refreshServerStatsInterval = setInterval(function() {
            self._refreshServerStats();
        }, UIConstants.REFRESH_SERVER_STATS_INTERVAL);
        setTimeout(function() {
            self._refreshServerStats();
        }, UIConstants.INITIAL_SERVER_STATS_DELAY);
        this._setGamecount(Cookies.get("displayAllGames") === "true");
        this._setCameraShake(Cookies.get("disableCameraShake") === "true");
        this._setTankBadges(Cookies.get("disableTankBadges") === "true");
        this.displayAllGamesCheckbox.find("input").on("change", function() {
            self._setGamecount(this.checked);
        });
        this.disableCameraShakeCheckbox.find("input").on("change", function() {
            self._setCameraShake(this.checked);
        });
        this.disableTankBadgesCheckbox.find("input").on("change", function() {
            self._setTankBadges(this.checked);
        });
    },
    show: function(x, y, preferredRadius) {
        if (!TankTrouble.SettingsBox.settings || !document.getElementById("settings")) {
            TankTrouble.SettingsBox.init();}
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
    _setGamecount: function(enabled) {
        this.displayAllGamesCheckbox.find("input").prop("checked", enabled);
        UIConstants.GAME_ICON_COUNT = enabled ? 6 : 4;
        Cookies.set("displayAllGames", enabled, { expires: 365 });
        try { reloadGame(); } catch(e) {}
    },
    _setCameraShake: function(disabled) {
        this.disableCameraShakeCheckbox.find("input").prop("checked", disabled);
        UIConstants.MAX_CAMERA_SHAKE = disabled ? 0 : UIConstants.MAX_CAMERA_SHAKE;
        UIConstants.MINE_EXPLOSION_CAMERA_SHAKE = disabled ? 0 : UIConstants.MINE_EXPLOSION_CAMERA_SHAKE;
        UIConstants.TANK_EXPLOSION_CAMERA_SHAKE = disabled ? 0 : UIConstants.TANK_EXPLOSION_CAMERA_SHAKE;
        Cookies.set("disableCameraShake", disabled, { expires: 365 });
    },
    _setTankBadges: function(disabled) {
        this.disableTankBadgesCheckbox.find("input").prop("checked", disabled);
        UIConstants.DISABLE_TANK_BADGES = disabled;
        Cookies.set("disableTankBadges", disabled, { expires: 365 });
        try { reloadGame(); } catch(e) {}
        try { reloadPlayerPanel(); } catch(e) {}
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
    }
};
