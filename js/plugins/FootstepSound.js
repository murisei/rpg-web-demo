/*:
 * @target MZ
 * @plugindesc 在角色移动时播放脚步声。支持运行时更改音效与间隔（支持插件指令）。适合与区域联动使用。
 * @author ChatGPT
 *
 * @param Sound Name
 * @text 默认音效名称
 * @desc 默认脚步音效名称（audio/se 文件夹中的文件名，不带扩展名）
 * @default Step1
 *
 * @param Volume
 * @text 默认音量
 * @type number
 * @min 0
 * @max 100
 * @default 70
 *
 * @param Pitch
 * @text 默认音调
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param Interval
 * @text 默认播放间隔（帧）
 * @desc 音效播放的帧间隔，控制脚步音播放频率
 * @type number
 * @min 1
 * @default 12
 *
 * @command SetFootstepSE
 * @text 更改脚步声
 * @desc 更改当前使用的脚步音效参数
 *
 * @arg name
 * @type string
 * @text 音效名
 * @desc 音效文件名（不带扩展名）
 *
 * @arg volume
 * @type number
 * @min 0
 * @max 100
 * @default 70
 * @text 音量
 *
 * @arg pitch
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * @text 音调
 *
 * @command SetInterval
 * @text 更改脚步间隔
 * @desc 更改脚步声播放的帧间隔（越小越频繁）
 *
 * @arg interval
 * @type number
 * @min 1
 * @default 12
 * @text 间隔帧数
 *
 * @help
 * 🦶 FootstepSound 插件
 *
 * 实现角色走动时播放脚步声，待机时静音。
 * 支持运行时通过插件指令更改音效、音量、音调与播放间隔。
 *
 * 📌 使用说明：
 * 1. 启用插件并设置默认值；
 * 2. 音效文件需放置在 audio/se 文件夹下；
 * 3. 可在事件中使用插件指令，如：
 *    - 更改脚步声（例如 Step_Grass 70 100）
 *    - 更改脚步间隔（例如 8）
 */

(() => {
    const pluginName = "FootstepSound";
    const parameters = PluginManager.parameters(pluginName);

    let footstepSE = {
        name: String(parameters["Sound Name"] || "metalwalksteps"),
        volume: Number(parameters["Volume"] || 70),
        pitch: Number(parameters["Pitch"] || 100),
        pan: 0
    };

    let interval = Number(parameters["Interval"] || 12);
    let lastX = -1;
    let lastY = -1;
    let stepTimer = 0;

    // 播放控制逻辑
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        const player = $gamePlayer;
        if (player.isMoving()) {
            if (!player._hasFootstepPlayed) {
                AudioManager.playSe(footstepSE);
                player._hasFootstepPlayed = true;
            }
        } else {
            player._hasFootstepPlayed = false;
        }
    };


    // 插件指令注册
    PluginManager.registerCommand(pluginName, "SetFootstepSE", args => {
        footstepSE.name = args.name || footstepSE.name;
        footstepSE.volume = Number(args.volume) || footstepSE.volume;
        footstepSE.pitch = Number(args.pitch) || footstepSE.pitch;
    });

    PluginManager.registerCommand(pluginName, "SetInterval", args => {
        interval = Number(args.interval) || interval;
    });

})();
