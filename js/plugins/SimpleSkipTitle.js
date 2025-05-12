/*:
 * @target MZ
 * @plugindesc 简化版：启动游戏直接进入地图（跳过标题画面）v1.0
 * @author ChatGPT
 *
 * @help
 * 启动游戏自动跳转到数据库中设定的默认起始地图。
 */

(() => {
  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);
    if (!DataManager.isBattleTest() && !DataManager.isEventTest()) {
      SceneManager.goto(Scene_Map);
    }
  };
})();
