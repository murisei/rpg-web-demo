/*:
 * @target MZ
 * @plugindesc 地图缩放插件（支持放大与缩小）v1.0 by murisei
 * @author murisei
 *
 * @command Zoom
 * @text 缩放地图
 * @desc 设置地图缩放倍数（以玩家为中心）
 *
 * @arg scale
 * @type number
 * @min 0.1
 * @default 1.0
 * @desc 缩放倍数（1.0 为原始大小，2.0 为放大2倍）
 *
 * @command ZoomReset
 * @text 恢复原始缩放
 * @desc 将地图视角恢复为原始大小
 *
 * @help
 * 插件命令：
 * - Zoom scale: 2.0     => 放大地图视角到2倍
 * - ZoomReset           => 恢复为原始缩放（1.0）
 */

(() => {
  PluginManager.registerCommand("ZoomSimple", "Zoom", args => {
    const scale = Number(args.scale || 1.0);
    const x = $gamePlayer.screenX();
    const y = $gamePlayer.screenY();
    $gameScreen.setZoom(x, y, scale);
  });

  PluginManager.registerCommand("ZoomSimple", "ZoomReset", () => {
    const x = $gamePlayer.screenX();
    const y = $gamePlayer.screenY();
    $gameScreen.setZoom(x, y, 1.0);
  });
})();
