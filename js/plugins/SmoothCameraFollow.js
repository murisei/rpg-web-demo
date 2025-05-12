/*:
 * @target MZ
 * @plugindesc 平滑镜头跟随主角（开关控制 + 无突变）v1.2
 * @author Universal Primer
 * @help
 * 镜头在开关开启后平滑跟随主角，并避免开启瞬间的跳动。
 */

(() => {
    const CAMERA_SWITCH_ID = 80; // 控制相机开启的开关
    const SMOOTHING = 0.1;

    const camera = {
        targetX: 0,
        targetY: 0,
        enabled: false,
        lastSwitchState: false
    };

    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function () {
        _Scene_Map_updateMain.call(this);

        const switchOn = $gameSwitches.value(CAMERA_SWITCH_ID);

        // 开关刚刚打开时，初始化 targetX/targetY 为当前玩家位置
        if (switchOn && !camera.lastSwitchState) {
            camera.targetX = $gamePlayer._realX - 7;
            camera.targetY = $gamePlayer._realY - 5;
        }

        camera.lastSwitchState = switchOn;

        if (switchOn) {
            const playerX = $gamePlayer._realX - 7;
            const playerY = $gamePlayer._realY - 5;

            camera.targetX += (playerX - camera.targetX) * SMOOTHING;
            camera.targetY += (playerY - camera.targetY) * SMOOTHING;

            $gameMap.setDisplayPos(camera.targetX, camera.targetY);
        }
    };
})();
