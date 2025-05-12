// @target MZ
// @plugindesc 事件可穿玩家但不穿墙 v2.0 by ChatGPT（修复玩家侧判断）
// @author GPT

(() => {
    // 为事件添加标志
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function (mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this._eventCanPassPlayer = false;
    };

    // 修改玩家是否与事件碰撞的判断
    const _Game_Player_isCollidedWithEvents = Game_Player.prototype.isCollidedWithEvents;
    Game_Player.prototype.isCollidedWithEvents = function (x, y) {
        return $gameMap.eventsXyNt(x, y).some(event => {
            // 如果事件设置了 _eventCanPassPlayer，则不会阻挡玩家
            return event.isNormalPriority() && !event._eventCanPassPlayer;
        });
    };

    // 修改事件是否与玩家碰撞的判断
    const _Game_Event_isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
    Game_Event.prototype.isCollidedWithPlayerCharacters = function (x, y) {
        // 如果事件可穿玩家，则忽略玩家碰撞
        if (this._eventCanPassPlayer) {
            return false;
        }
        return _Game_Event_isCollidedWithPlayerCharacters.call(this, x, y);
    };
})();
