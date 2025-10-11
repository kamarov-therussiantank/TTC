if (typeof require === "function") {
  var Classy = require("./classy");
}

var Constants = Classy.newClass();

Constants.classFields({
  SERVER: {
    MAX_GAME_COUNT: 6,
    GAME_CONTROLLER_UPDATE_INTERVAL: 1000 / 30,
    STATS_REPORT_INTERVAL: 1000 * 60,
    KEEPALIVE_INTERVAL: 1000 * 60,
    VALIDATION_INTERVAL: 1000 * 30,
    AI_CONTROLLER_UPDATE_INTERVAL: 1000 / 30,
    GOLD_SPAWN_DURATION_MIN: 1000 * 20,
    GOLD_SPAWN_DURATION_VARIANCE: 1000 * 20,
    GOLD_SPAWN_DOUBLE_PROBABILITY: 0.06,
    GOLD_SPAWN_TRIPLE_PROBABILITY: 0.01,
    GOLD_SPAWN_MAX_PER_ROUND: 3,
    DIAMOND_SPAWN_DURATION_MIN: 1000 * 100,
    DIAMOND_SPAWN_DURATION_VARIANCE: 1000 * 400,
    DIAMOND_SPAWN_MAX_PER_ROUND: 1,
    ACHIEVEMENT_UPDATE_INTERVAL: 1000 * 2,
    ACHIEVEMENT_TICK_INTERVAL: 250,
    MAX_PLAYERS_PER_CONNECTION: 3,
    MAX_ACCEPTED_POSITION_DIFF_SQUARED: 3.5 * 3.5,
    MAX_ACCEPTED_ROTATION_DIFF: 1.0,
    MAX_ACCEPTED_MAZE_DISTANCE: 1,
    MAX_INACTIVITY_TIME: 1000 * 60,
    TRACKING_WINDOW_SIZE: 5,
    TRACKING_EMISSION_TOLERANCE: 0.96,
    TRACKING_SPEED_TOLERANCE: 1.04,
    TRACKING_VIOLATION_DURATION: 1000 * 60,
    TRACKING_VIOLATION_THRESHOLD: 5,
    CHAT_COOLDOWN_TIME: 20,
    CHAT_COOLDOWN_PERIOD: 60 * 60 * 3,
    TEMP_BAN_CACHE_DURATION: 60,
    TANKSTATE_VIOLATION_REASONS: {
      EMISSION_TOO_OFTEN: 0,
      MOVED_TOO_FAST: 1,
      TURNED_TOO_FAST: 2
    }
  },

  CLIENT: {
    TANKSTATE_EMISSION_INTERVAL: 0.5,
    MAX_PLAYERS: 3,
    RECONNECT_INTERVAL: 10000,
    MAX_LATENCY_DIFFERENCE_TO_ACCEPT_FOR_POPULATED_SERVER: 35
  },

  GAME: {
    MAX_ACTIVE_PLAYERS: 8,
    SYMMETRIC_MAX_ACTIVE_PLAYERS: 4,
    DEFAULT_ACTIVE_PLAYERS: 6,
    MAX_QUEUED_PLAYERS: 6
  }
});

Constants.classFields({
  PIXELS_PER_METER: 20.0,
  METERS_PER_PIXEL: 0.05,
  PATH_MIN_STEP_LENGTH: 0.01,

  BULLET: {
    RADIUS: { px: 5, m: 5.0 / 20.0 },
    SPEED: { px: 360, m: 360.0 / 20.0 },
    OFFSET: { px: 50, m: 50.0 / 20.0 }
  },

  LASER: {
    RADIUS: { px: 0.0, m: 0.0 / 20.0 },
    SPEED: { px: 3600, m: 3600.0 / 20.0 },
    OFFSET: { px: 50, m: 50.0 / 20.0 }
  },

  DOUBLE_BARREL: {
    RADIUS: { px: 5, m: 5.0 / 20.0 },
    SPEED: { px: 360, m: 360.0 / 20.0 },
    OFFSET: { px: 45, m: 45.0 / 20.0 },
    SPACE: { px: 9, m: 9.0 / 20.0 }
  },

  SHOTGUN: {
    RADIUS: { px: 2, m: 2.0 / 20.0 },
    MIN_SPEED: { px: 600, m: 600.0 / 20.0 },
    MAX_SPEED: { px: 700, m: 700.0 / 20.0 },
    OFFSET: { px: 49, m: 49.0 / 20.0 },
    SPACE: { px: 8, m: 8.0 / 20.0 }
  },

  GATLING_GUN: {
    RADIUS: { px: 2, m: 2.0 / 20.0 },
    MIN_SPEED: { px: 500, m: 500.0 / 20.0 },
    MAX_SPEED: { px: 600, m: 600.0 / 20.0 },
    OFFSET: { px: 60, m: 60.0 / 20.0 },
    SPACE: { px: 8, m: 8.0 / 20.0 }
  },

  HOMING_MISSILE: {
    RADIUS: { px: 4, m: 4.0 / 20.0 },
    SPEED: { px: 360, m: 360.0 / 20.0 },
    OFFSET: { px: 50, m: 50.0 / 20.0 },
    ACCELERATION: 40.0
  },

  MINE: {
    RADIUS: { px: 16, m: 16.0 / 20.0 },
    LAUNCH_SPEED: { px: 250, m: 250 / 20.0 },
    MIN_SPEED: { px: 500, m: 500.0 / 20.0 },
    MAX_SPEED: { px: 700, m: 700.0 / 20.0 },
    OFFSET: { px: -29, m: -29.0 / 20.0 },
    ACCELERATION: 40.0
  },

  COLLECTIBLE_TYPES: {
    CRATE_LASER: 0,
    CRATE_DOUBLE_BARREL: 1,
    CRATE_SHOTGUN: 2,
    CRATE_HOMING_MISSILE: 3,
    CRATE_MINE: 4,
    CRATE_GATLING_GUN: 5,
    WEAPON_CRATE_COUNT: 6,
    CRATE_SHIELD: 6,
    CRATE_AIMER: 7,
    CRATE_SPEED_BOOST: 8,
    UPGRADE_CRATE_COUNT: 9,
    CRATE_COUNT: 9,
    GOLD: 9,
    DIAMOND: 10,
    FLAG: 11,
    COLLECTIBLE_TO_UPGRADE_OFFSET: -4
  },

  CRATE: {
    WIDTH: { px: 64, m: 64.0 / 20.0 },
    HEIGHT: { px: 64, m: 64.0 / 20.0 }
  },

  GOLD: {
    RADIUS: { px: 35, m: 35.0 / 20.0 }
  },

  DIAMOND: {
    WIDTH: { px: 44, m: 44.0 / 20.0 },
    HEIGHT: { px: 76, m: 76.0 / 20.0 },
    MIDDLE_HEIGHT: { px: 38, m: 38.0 / 20.0 }
  },

  SHIELD: {
    RADIUS: { px: 86, m: 86.0 / 20.0 }
  },

  WEAPON_TYPES: {
    BULLET: -1,
    LASER: 0,
    DOUBLE_BARREL: 1,
    SHOTGUN: 2,
    HOMING_MISSILE: 3,
    MINE: 4,
    GATLING_GUN: 5
  },

  PROJECTILE_BOUNCE_TIMEOUT_WINDOW: 35,
  PROJECTILE_BOUNCE_TIMEOUT_COUNT: 5,

  BULLET_AMMO_COUNT: 5,
  BULLET_MAX_LIFETIME: 10.0,

  LASER_LOCK_TIME: 0.2,
  LASER_MAX_LIFETIME: 0.8,

  DOUBLE_BARREL_AMMO_COUNT: 10,
  DOUBLE_BARREL_RELOAD_TIME: 1.0,
  DOUBLE_BARREL_MAX_LIFETIME: 6.0,

  SHOTGUN_AMMO_COUNT: 3,
  SHOTGUN_NUM_BUCKSHOT: 20,
  SHOTGUN_BUCKSHOT_SPREAD: 0.3,
  SHOTGUN_RELOAD_TIME: 1.0,
  SHOTGUN_LIFETIME_AFTER_MAZE_HIT: 0.7,
  SHOTGUN_MAX_LIFETIME: 2.0,

  HOMING_MISSILE_ACTIVATION_TIME: 2.0,
  HOMING_MISSILE_MAX_LIFETIME: 10.0,

  MINE_AMMO_COUNT: 3,
  MINE_ACTIVATION_DELAY: 0.5,
  MINE_DETONATION_DELAY: 0.4,
  MINE_NUM_SHRAPNEL: 30,
  MINE_SHRAPNEL_RADIUS: 2.0 / 20.0,

  GATLING_GUN_AMMO_COUNT: 20,
  GATLING_GUN_BULLET_SPREAD: 0.1,
  GATLING_GUN_CHARGE_TIME: 0.5,
  GATLING_GUN_FIRE_RATE: 0.12,
  GATLING_GUN_DISCHARGE_TIME: 1.5,
  GATLING_GUN_MAX_LIFETIME: 2.0,

  CRATE_SPAWN_DURATION_MIN: 3.0,
  CRATE_SPAWN_DURATION_VARIANCE: 5.0,
  CRATE_MINIMUM_TILES_TO_TANKS: 4,

  GOLD_MINIMUM_TILES_TO_TANKS: 5,
  DIAMOND_MINIMUM_TILES_TO_TANKS: 6,

  MAX_CRATES: 3,
  MAX_GOLDS: 3,
  MAX_DIAMONDS: 1,

  MAX_WEAPON_QUEUE: 3,

  UPGRADE_TYPES: {
    LASER_AIMER: 0,
    SPAWN_SHIELD: 1,
    SHIELD: 2,
    AIMER: 3,
    SPEED_BOOST: 4
  },

  LASER_AIMER_LENGTH: 60.0,
  SPAWN_SHIELD_LIFETIME: 10.0,
  SPAWN_SHIELD_WEAKEN_TIME: 2.0,
  AIMER_LENGTH: 60.0,
  AIMER_LIFETIME: 10.0,
  SHIELD_LIFETIME: 6.0,
  SHIELD_WEAKEN_TIME: 2.0,
  SPEED_BOOST_LIFETIME: 10.0,
  SPEED_BOOST_EFFECT: 0.3,

  MODIFIER_TYPES: { SPEED: 0 },
  MODIFIER_INFO: [{ DEFAULT: 1.0 }],

  SCORE_TYPES: { KILL: 0, VICTORY: 1 },
  EMBLEM_TYPES: { TERMINATOR: 0, DOMINATOR: 1 },

  COUNTER_TYPES: {
    TIMER_COUNTDOWN: 0,
    OVERTIME_COUNT_UP: 1,
    TIMER_COUNT_UP: 2,
    PIE_COUNTDOWN: 3
  },

  ZONE_TYPES: { SPAWN: 0, HILL: 1, BASE: 2, STORM: 3 },

  SPAWN_ZONE_MINIMUM_TILES_TO_TANKS: 1,
  SPAWN_ZONE_LIFETIME: 4.0,
  SPAWN_ZONE_START_GROW_TIME: 2.4,
  SPAWN_ZONE_END_GROW_TIME: 2.3,
  SPAWN_ZONE_START_RADIUS: 0.3,
  SPAWN_ZONE_END_RADIUS: 3.7,

  STORM_ZONE_EXPANSION_TIME: 10.0,
  STORM_ZONE_START_GROW_TIME: 5.0,

  MAX_DELTA_TIME: 1.0 / 10.0,

  BETWEEN_ROUNDS_DURATION: 1.0,
  CELEBRATION_DURATION: 7.0,
  COUNTDOWN_START_VALUE: 3,
  COUNTDOWN_DURATION: 0.5,
  ROUND_FINISHING_DURATION: 3.0,

  JOIN_PRIORITY_START_GAME_WEIGHT: 1000,
  JOIN_PRIORITY_DEATHMATCH_MIN_SECONDS_TO_PENALIZE: 10,
  JOIN_PRIORITY_DEATHMATCH_MAX_SECONDS_TO_PENALIZE: 30,
  JOIN_PRIORITY_DEATHMATCH_TIME_WEIGHT: 10,

  STATISTICS: {
    SLIDING_WINDOW_SIZE: 10,
    MINIMUM_VICTORIES_FOR_DOMINATOR: 3,
    MINIMUM_KILLS_FOR_TERMINATOR: 3,
    MINIMUM_KILLS_FOR_KILL_STREAK: 3
  },

  ACHIEVEMENT: {
    FOLLOW_THE_RED_PENGUIN: {
      MAX_ACCEPTED_ANGLE_DIFFERENCE_FOR_CLEARING_TURN_STEP: 0.25,
      MAX_ACCEPTED_ROTATION_DURING_DRIVE_STEP: 1.0,
      MAX_ACCEPTED_ROTATION_DURING_SHOOT_STEP: 0.5,
      MAX_ACCEPTED_ROTATION_DURING_WAIT_STEP: 0.5
    },
    RED_INFILTRATION: {
      MAX_ACCEPTED_ANGLE_DIFFERENCE_FOR_CLEARING_TURN_STEP: 0.25,
      MAX_ACCEPTED_ROTATION_DURING_DRIVE_STEP: 1.0,
      MAX_ACCEPTED_ROTATION_DURING_SHOOT_STEP: 0.5,
      MAX_ACCEPTED_ROTATION_DURING_WAIT_STEP: 0.5
    },
    WAKKA_WAKKA_WAKKA: { STEP_SIZE: 2.0 },
    MEMORY_LIKE_A_GOLDFISH: { TIME_TO_SURVIVE: 3.0 }
  },

  TANK: {
    WIDTH: { px: 60, m: 60.0 / 20.0 },
    HEIGHT: { px: 80, m: 80.0 / 20.0 },
    ROTATION_SPEED: 5.0,
    FORWARD_SPEED: { px: 319, m: 319.0 / 20.0 },
    BACK_SPEED: { px: 256, m: 256.0 / 20.0 }
  },

  BULLET_TURRET: {
    WIDTH: { px: 14, m: 14.0 / 20.0 },
    HEIGHT: { px: 28, m: 28.0 / 20.0 },
    OFFSET_X: { px: 0, m: 0.0 },
    OFFSET_Y: { px: -40, m: -40.0 / 20.0 }
  },

  LASER_TURRET: {
    ANTENNA_WIDTH: { px: 2, m: 2.0 / 20.0 },
    ANTENNA_HEIGHT: { px: 28, m: 28.0 / 20.0 },
    ANTENNA_OFFSET_X: { px: 0, m: 0.0 },
    ANTENNA_OFFSET_Y: { px: -40, m: -40.0 / 20.0 },
    DISH_WIDTH: { px: 40, m: 40.0 / 20.0 },
    DISH_HEIGHT: { px: 10, m: 10.0 / 20.0 },
    DISH_OFFSET_X: { px: 0, m: 0.0 },
    DISH_OFFSET_Y: { px: -37, m: -37.0 / 20.0 }
  },

  DOUBLE_BARREL_TURRET: {
    WIDTH: { px: 32, m: 32.0 / 20.0 },
    HEIGHT: { px: 22, m: 22.0 / 20.0 },
    OFFSET_X: { px: 0, m: 0.0 },
    OFFSET_Y: { px: -35, m: -35.0 / 20.0 }
  },

  SHOTGUN_TURRET: {
    WIDTH: { px: 28, m: 28.0 / 20.0 },
    HEIGHT: { px: 27, m: 27.0 / 20.0 },
    OFFSET_X: { px: 0, m: 0.0 },
    OFFSET_Y: { px: -39, m: -39.0 / 20.0 }
  },

  MISSILE_TURRET: {
    WIDTH: { px: 6, m: 6.0 / 20.0 },
    CENTER_HEIGHT: { px: 28, m: 28.0 / 20.0 },
    SIDE_HEIGHT: { px: 8, m: 8.0 / 20.0 },
    OFFSET_X: { px: 0, m: 0.0 },
    OFFSET_Y: { px: -39, m: -39.0 / 20.0 }
  },

  GATLING_GUN_TURRET: {
    WIDTH: { px: 28, m: 28.0 / 20.0 },
    HEIGHT: { px: 27, m: 27.0 / 20.0 },
    OFFSET_X: { px: 0, m: 0.0 },
    OFFSET_Y: { px: -39, m: -39.0 / 20.0 }
  },

  MAZE: {
    BASE_WIDTH: 2,
    WIDTH_FOR_PLAYERS: [0, 2, 4, 6, 8, 9, 10, 11, 12],
    MAX_RANDOM_WIDTH_MULTIPLIER: 1.5,
    MAX_WIDTH: 16,
    BASE_HEIGHT: 2,
    HEIGHT_FOR_PLAYERS: [0, 1, 2, 3, 4, 5, 5, 6, 6],
    MAX_RANDOM_HEIGHT_MULTIPLIER: 1.5,
    MAX_HEIGHT: 10,
    TILE_PROBABILITIES: [0.5, 0.7, 0.9, 0.9, 1.0],
    WALL_PROBABILITIES: [0.5, 0.8, 0.9, 1.0, 1.0]
  },

  MAZE_TILE_SIZE: { px: 200, m: 200.0 / 20.0 },
  MAZE_WALL_WIDTH: { px: 16, m: 16.0 / 20.0 },

  MAZE_MINIMUM_TILES_PER_TANK: 5,
  MAZE_MINIMUM_TILES_BETWEEN_TANKS: 4,
  MAZE_MINIMUM_REACHABLE_RATIO: 1.0,
  MAZE_MAX_DEAD_END_PENALTY: 5,

  MAZE_THEMES: {
    STANDARD: 0,
    HALLOWEEN: 1,
    CHRISTMAS: 2,
    COUNT: 3,
    RANDOM: 4
  },

  MAZE_THEME_INFO: [
    {
      BORDER_CONFIG: [],
      FLOOR_CONFIG: [
        { required: 0, missing: 0, weight: 1.0 },
        { required: 0, missing: 0, weight: 1.0 }
      ],
      SPACE_CONFIG: [],
      WALL_CONFIG: [{ flipX: true, flipY: true, weight: 1.0 }],
      WALL_DECORATION_CONFIG: [],
      WALL_DECORATION_PROBABILITY: 0.0
    },
    {
      ACTIVE_DURATION_START: new Date("2017-10-01"),
      ACTIVE_DURATION_END: new Date("2017-11-01T12:00:00Z"),
      BORDER_CONFIG: [
        { flip: true, weight: 2.0 },
        { flip: true, weight: 2.0 },
        { flip: true, weight: 1.0 },
        { flip: true, weight: 1.0 }
      ],
      FLOOR_CONFIG: [
        { required: 0, missing: 0, weight: 2.0 },
        { required: 0, missing: 0, weight: 2.0 },
        { required: 0, missing: 0, weight: 1.0 },
        { required: 0, missing: 0, weight: 1.0 },
        { required: 5, missing: 0, weight: 1.0 },
        { required: 3, missing: 0, weight: 2.0 }
      ],
      SPACE_CONFIG: [
        { required: 0, missing: 0, weight: 1.0 },
        { required: 0, missing: 0, weight: 1.0 },
        { required: 15, missing: 0, weight: 1.0 }
      ],
      WALL_DECORATION_CONFIG: [
        { required: 10, missing: 0, weight: 1.0 },
        { required: 10, missing: 0, weight: 1.0 },
        { required: 10, missing: 5, weight: 1.0 },
        { required: 12, missing: 0, weight: 2.0 },
        { required: 14, missing: 0, weight: 1.0 }
      ],
      WALL_CONFIG: [
        { flipX: true, flipY: true, weight: 1.0 },
        { flipX: true, flipY: true, weight: 1.0 },
        { flipX: true, flipY: true, weight: 1.0 }
      ],
      WALL_DECORATION_PROBABILITY: 0.2
    },
    {
      ACTIVE_DURATION_START: new Date("2017-12-01"),
      ACTIVE_DURATION_END: new Date("2017-12-31T23:59:59Z"),
      BORDER_CONFIG: [
        { flip: true, weight: 3.0 },
        { flip: true, weight: 1.0 },
        { flip: true, weight: 1.0 },
        { flip: true, weight: 1.0 },
        { flip: true, weight: 1.0 },
        { flip: true, weight: 1.0 }
      ],
      FLOOR_CONFIG: [
        { required: 0, missing: 0, weight: 2.0 },
        { required: 0, missing: 0, weight: 2.0 },
        { required: 0, missing: 0, weight: 0.5 },
        { required: 0, missing: 0, weight: 1.0 },
        { required: 0, missing: 0, weight: 1.0 },
        { required: 1, missing: 0, weight: 3.0 },
        { required: 1, missing: 0, weight: 3.0 },
        { required: 5, missing: 0, weight: 3.0 },
        { required: 3, missing: 0, weight: 3.0 },
        { required: 11, missing: 0, weight: 3.0 }
      ],
      SPACE_CONFIG: [
        { required: 0, missing: 0, weight: 1.0 },
        { required: 0, missing: 0, weight: 1.0 },
        { required: 1, missing: 0, weight: 1.0 },
        { required: 3, missing: 0, weight: 1.0 },
        { required: 15, missing: 0, weight: 1.0 },
        { required: 3, missing: 0, weight: 1.0 }
      ],
      WALL_DECORATION_CONFIG: [
        { required: 5, missing: 0, weight: 1.0 },
        { required: 5, missing: 0, weight: 1.0 },
        { required: 3, missing: 0, weight: 1.0 }
      ],
      WALL_CONFIG: [
        { flipX: true, flipY: true, weight: 1.0 },
        { flipX: true, flipY: true, weight: 1.0 },
        { flipX: true, flipY: true, weight: 1.0 },
        { flipX: true, flipY: true, weight: 1.0 }
      ],
      WALL_DECORATION_PROBABILITY: 0.2
    }
  ],

  GAME_MODES: {
    CURRENT: -1,
    CLASSIC: 0,
    BOOT_CAMP: 1,
    DEATHMATCH: 2,
    TEAM_CLASSIC: 3,
    TEAM_DEATHMATCH: 4,
    CAPTURE_THE_FLAG: 5,
    COUNT: 3
  },

  GAME_MODE_INFO: [
    {
      AVAILABLE_ONLINE: true,
      ACTIVE_HOURS: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22],
      HAS_CELEBRATION: false,
      MIN_PLAYERS: 2,
      DEFAULT_AVAILABLE_CRATES: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      AVAILABLE_ONLINE: false,
      HAS_CELEBRATION: false,
      MIN_PLAYERS: 2,
      DEFAULT_AVAILABLE_CRATES: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      AVAILABLE_ONLINE: true,
      ACTIVE_HOURS: [3, 7, 11, 15, 19, 23],
      HAS_CELEBRATION: true,
      MIN_PLAYERS: 3,
      DEFAULT_AVAILABLE_CRATES: [0, 1, 2, 3, 4, 5, 6]
    }
  ],

  CLASSIC_STORM_APPEAR_DURATION: 60,
  DEATHMATCH_ROUND_DURATION: 60,
  DEATHMATCH_RESPAWN_DURATION: 1,
  DEATHMATCH_STORM_APPEAR_DURATION: 30,

  TEAMS: {
    NO_TEAM: 0,
    TEAM_RED: 1,
    TEAM_BLUE: 2
  },

  COLLISION_CATEGORIES: {
    TANK: 0x1,
    MAZE: 0x1 << 1,
    PROJECTILE: 0x1 << 2,
    TRAP: 0x1 << 3,
    COLLECTIBLE: 0x1 << 4,
    SHIELD: 0x1 << 5,
    ZONE: 0x1 << 6
  },

  AI: {
    PATH_STEP_SIZE: 0.1,

    // --- Projectile / Dodge Handling ---
    MIN_PROJECTILE_DISTANCE_TO_CONSIDER: 4,
    MAX_PROJECTILE_DISTANCE_TO_CONSIDER: 15,       // extended threat range
    MIN_PROJECTILE_PATH_LENGTH: 4,
    MAX_PROJECTILE_PATH_LENGTH: 10,
    PROJECTILE_THREAT_TIME_FALLOFF: 0.0,
    PROJECTILE_THREAT_WEIGHT: 3.0,                // increased to make dodging a priority

    MIN_SCARY_PROJECTILE_DISTANCE: 3.0,
    MAX_SCARY_PROJECTILE_DISTANCE: 15.0,
    MIN_DODGE_PROJECTILE_DISTANCE: 3.0,
    MAX_DODGE_PROJECTILE_DISTANCE: 15.0,
    MIN_TIME_TO_DODGE: 0.005,                       // dynamic reaction times
    MAX_TIME_TO_DODGE: 0.3,
    DISTANCE_TO_DODGE: 6.0,
    AMOUNT_TO_DODGE: 18.0,
    MIN_ESCAPE_PATH_LENGTH: 3,
    MAX_ESCAPE_PATH_LENGTH: 12,
    DODGE_PRIORITY_OFFSET: 3.0,

    MIN_PROJECTILE_BOUNCES: 20,
    MAX_PROJECTILE_BOUNCES: 20,

    // --- Mines / Traps ---
    MIN_TRAP_THREAT_DISTANCE_TO_CONSIDER: 8,
    MAX_TRAP_THREAT_DISTANCE_TO_CONSIDER: 16,
    TRAP_THREAT_WEIGHT: 10,

    MINE_INITIAL_THREAT_WEIGHT: 10,
    MINE_THREAT_MIN_TIME_FALLOFF: 0.1,
    MINE_THREAT_MAX_TIME_FALLOFF: 1.0,
    OWN_MINE_THREAT_MAX_TIME_MODIFIER: 0.8,
    OWN_MINE_THREAT_MIN_TIME_MODIFIER: 0.2,

    // --- Tank / Enemy Handling ---
    MIN_TANK_THREAT_DISTANCE_TO_CONSIDER: 8,
    MAX_TANK_THREAT_DISTANCE_TO_CONSIDER: 16,
    TANK_THREAT_WEIGHT: 5,
    LASER_AIMER_THREAT_WEIGHT: 1.0,
    SPAWN_ZONE_THREAT_WEIGHT: 12,
    STORM_ZONE_THREAT_WEIGHT: 12,

    MIN_FIRING_THREAT_PATH_BOUNCES: 2,
    MAX_FIRING_THREAT_PATH_BOUNCES: 5,
    MIN_FIRING_THREAT_PATH_LENGTH: 2,
    MAX_FIRING_THREAT_PATH_LENGTH: 10,
    FIRING_PATH_THREAT_WEIGHT: 2.5,

    // --- Aggression ---
    MIN_AGGRESSIVENESS_GROWTH: -0.0005,          // can calm down
    MAX_AGGRESSIVENESS_GROWTH: 0.0003,
    AGGRESSIVENESS_SHOOT_AFTER_SHRINKAGE: 0.3,
    AGGRESSIVENESS_RETALIATE_SHRINKAGE: 0.8,
    AGGRESSIVENESS_LAY_TRAP_SHRINKAGE: 0.5,

    // --- Greediness / Loot ---
    MIN_GREEDINESS_GROWTH: 0.0,
    MAX_GREEDINESS_GROWTH: 0.0003,
    GREEDINESS_PICK_UP_COLLECTIBLE_SHRINKAGE: 0.5,

    MIN_CRATE_DISTANCE_TO_CONSIDER: 4,
    MAX_CRATE_DISTANCE_TO_CONSIDER: 10,
    MIN_CRATE_DISTANCE_FALLOFF: 0.01,
    MAX_CRATE_DISTANCE_FALLOFF: 0.25,
    MIN_CRATE_PRIORITY_OFFSET: 0.3,
    MAX_CRATE_PRIORITY_OFFSET: 0.8,

    MIN_CURRENCY_DISTANCE_TO_CONSIDER: 6,
    MAX_CURRENCY_DISTANCE_TO_CONSIDER: 20,
    MIN_CURRENCY_DISTANCE_FALLOFF: 0.01,
    MAX_CURRENCY_DISTANCE_FALLOFF: 0.25,
    MIN_GOLD_PRIORITY_OFFSET: 0.0,
    MAX_GOLD_PRIORITY_OFFSET: 0.4,
    MIN_DIAMOND_PRIORITY_OFFSET: 0.1,
    MAX_DIAMOND_PRIORITY_OFFSET: 0.8,

    MIN_PRIORITY_DECREASE: 0.0001,
    MAX_PRIORITY_DECREASE: 0.001,

    // --- Goal / Idle / Stuck Handling ---
    MIN_GOAL_PERIOD: 100,
    MAX_GOAL_PERIOD: 800,
    GET_UNSTUCK_GOAL_PERIOD: 30,
    GET_UNSTUCK_DISTANCE: 2.5,
    MAX_HUNT_PRIORITY: 0.2,
    IDLE_PRIORITY: 0.01,
    MIN_IDLE_DURATION: 100,
    MAX_IDLE_DURATION: 500,
    MIN_IDLE_DISTANCE: 2,
    KILLS_TO_REMEMBER: 10,

    DRIVE_TO_TILE_DISTANCE_SQUARED: 4.0 * 4.0,
    DRIVE_TO_POSITION_DISTANCE_SQUARED: 1.0 * 1.0,
    TURN_TO_DIFFERENCE: 0.1,
    MAX_ROTATION_IMPRECISION: 0.3,

    // --- Firing Behavior ---
    MIN_FIRING_PATH_BOUNCES: 8,
    MAX_FIRING_PATH_BOUNCES: 16,
    MIN_FIRING_PATH_LENGTH: 2,
    MAX_FIRING_PATH_LENGTH: 8,
    MIN_NUM_FIRING_PATHS: 1,
    MAX_NUM_FIRING_PATHS: 5,
    MIN_FIRING_PATH_SPREAD: 1.04,
    MAX_FIRING_PATH_SPREAD: 2.09,
    FIRING_PATH_RANDOM_OFFSET: 0.35,

    MIN_PREFERRED_CLOSEST_DISTANCE_OFFSET: 3.0,
    MAX_PREFERRED_CLOSEST_DISTANCE_OFFSET: 8.0,
    MIN_DISTANCE_TO_FIRE: 8.0,
    MAX_DISTANCE_TO_FIRE: 20.0,
    MIN_FIRST_SEGMENT_TO_FIRE: 4.0,

    MIN_DISTANCE_TO_RETALIATE: 4.0,
    MAX_DISTANCE_TO_RETALIATE: 10.0,
    MAX_RETALIATE_DELAY: 100,

    MIN_TURN_AROUND_ANGLE: 1.04,
    MAX_TURN_AROUND_ANGLE: 2.09,

    MAX_STUCK_TIME: 100.0,

    MIN_TANK_HUNT_DISTANCE_TO_CONSIDER: 6,
    MAX_TANK_HUNT_DISTANCE_TO_CONSIDER: 20,

    MIN_RUN_AWAY_DISTANCE_TO_CONSIDER: 6,
    MAX_RUN_AWAY_DISTANCE_TO_CONSIDER: 20,
    MIN_RUN_AWAY_PRIORITY_OFFSET: 0.2,
    MAX_RUN_AWAY_PRIORITY_OFFSET: 1.0,

    MIN_LASER_AIMER_DISTANCE: 3.0,
    MAX_LASER_AIMER_DISTANCE: 12.0,

    POSITION_DEAD_DISTANCE: 1,
    POSITION_DEAD_ANGLE: 1.13,
    ROTATION_DEAD_ANGLE: 0.1,

    MAX_PATH_LENGTH_TO_REVERSE: 1,
    MIN_PATH_DEAD_END_WEIGHT: 0.2,
    MAX_PATH_DEAD_END_WEIGHT: 1,
    MIN_PATH_THREAT_WEIGHT: 0.1,
    MAX_PATH_THREAT_WEIGHT: 1
},


  MODE_CLIENT_ONLINE: "client online",
  MODE_CLIENT_LOCAL: "client local",
  MODE_SERVER: "server",

  CHAT_SEND_RECEIPT: {
    SUCCESS: "success",
    RETRY: "retry",
    FAIL: "fail"
  },

  mode: null
});

Constants.mode = Constants.MODE_CLIENT_LOCAL;

Constants.setMode = function (mode) {
  Constants.mode = mode;
};

Constants.getMode = function () {
  return Constants.mode;
};

if (typeof module === "object") {
  module.exports = Constants;
}
