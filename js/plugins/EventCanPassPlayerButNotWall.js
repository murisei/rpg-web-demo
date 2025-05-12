/*:
 * @target MZ
 * @plugindesc �¼��ɴ���ҵ�����ǽ v2.0 by ChatGPT���޸���Ҳ��жϣ�
 * @author ChatGPT
 *
 * @help
 * �����������¼�����һ��ഩ͸������Ȼ�ᱻ��ͼǽ���赲��
 *
 * ʹ�÷�����
 * 1. ����������ã�
 * 2. �������ÿɴ���ҵ��¼��У�ʹ�ýű���this._eventCanPassPlayer = true;
 * 3. ��Ҫ��ѡ�¼��ġ���͸�����ԣ������¼����ܵ�ͼͨ�й������ƣ�
 *
 * �޲�����
 */

(() => {
    // Ϊ�¼���ӱ�־
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function (mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this._eventCanPassPlayer = false;
    };

    // �޸�����Ƿ����¼���ײ���ж�
    const _Game_Player_isCollidedWithEvents = Game_Player.prototype.isCollidedWithEvents;
    Game_Player.prototype.isCollidedWithEvents = function (x, y) {
        return $gameMap.eventsXyNt(x, y).some(event => {
            // ����¼������� _eventCanPassPlayer���򲻻��赲���
            return event.isNormalPriority() && !event._eventCanPassPlayer;
        });
    };

    // �޸��¼��Ƿ��������ײ���ж�
    const _Game_Event_isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
    Game_Event.prototype.isCollidedWithPlayerCharacters = function (x, y) {
        // ����¼��ɴ���ң�����������ײ
        if (this._eventCanPassPlayer) {
            return false;
        }
        return _Game_Event_isCollidedWithPlayerCharacters.call(this, x, y);
    };
})();
