/*:
 * @target MZ
 * @plugindesc ����������ƶ���ʹ��WASD���н�ɫ�ƶ����� @UniversalPrimer
 * @author UniversalPrimer
 */

(() => {
    // �����������ͼ�ƶ�
    Game_Temp.prototype.setDestination = function (x, y) {
        // �����κ��£���������ٴ����ƶ�
    };

    // ��� WASD ֧��
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
