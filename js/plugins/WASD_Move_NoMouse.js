/*:
 * @target MZ
 * @plugindesc 禁用鼠标点击移动，使用WASD进行角色移动控制 @UniversalPrimer
 * @author UniversalPrimer
 */

(() => {
    // 禁用鼠标点击地图移动
    Game_Temp.prototype.setDestination = function (x, y) {
        // 不做任何事，鼠标点击不再触发移动
    };

    // 添加 WASD 支持
    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function () {
        _Scene_Map_create.call(this);
        setupWASDControls();
    };

    function setupWASDControls() {
        const inputMapper = {
            87: 'up',     // W
            65: 'left',   // A
            83: 'down',   // S
            68: 'right'   // D
        };

        for (const keyCode in inputMapper) {
            Input.keyMapper[keyCode] = inputMapper[keyCode];
        }
    }
})();
