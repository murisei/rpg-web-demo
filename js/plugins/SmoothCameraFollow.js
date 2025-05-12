/*:
 * @target MZ
 * @plugindesc ƽ����ͷ�������ǣ����ؿ��� + ��ͻ�䣩v1.2
 * @author Universal Primer
 * @help
 * ��ͷ�ڿ��ؿ�����ƽ���������ǣ������⿪��˲���������
 */

(() => {
    const CAMERA_SWITCH_ID = 80; // ������������Ŀ���
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

        // ���ظոմ�ʱ����ʼ�� targetX/targetY Ϊ��ǰ���λ��
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
