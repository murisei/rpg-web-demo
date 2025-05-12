/*:
 * @target MZ
 * @plugindesc �Զ������ؼ���ײ���� - Pixel Collision Area Plugin (for DotMoveSystem) + ���ӻ���ʾ @CodeCopilot
 *
 * @help
 * �÷���
 * 1. ���þ���������ײ����
 *    $gameMap.setPixelCollisionArea(x1, y1, x2, y2, isBlocked)
 *    - x1, y1, x2, y2: �������꣨��ͼ��λ = tile * 48��
 *    - isBlocked: true ��ʾ����ͨ�У�false ��ʾ�Ƴ��赲
 *
 * 2. ����������ʾ���¼��ű�����
 *    $gameMap._showPixelBlockDebug = true;
 *
 * ˵�������� DotMoveSystem.js�������������λ���ж��Ƿ�����赲����
 */


(() => {
  const _Game_Map_initialize = Game_Map.prototype.initialize;
  Game_Map.prototype.initialize = function() {
    _Game_Map_initialize.call(this);
    this._pixelBlockAreas = [];
    this._showPixelBlockDebug = false;
  };

  Game_Map.prototype.setPixelCollisionArea = function(x1, y1, x2, y2, isBlocked) {
    const area = { x1: Math.min(x1, x2), y1: Math.min(y1, y2), x2: Math.max(x1, x2), y2: Math.max(y1, y2) };
    if (isBlocked) {
      this._pixelBlockAreas.push(area);
    } else {
      this._pixelBlockAreas = this._pixelBlockAreas.filter(a =>
        a.x1 !== area.x1 || a.y1 !== area.y1 || a.x2 !== area.x2 || a.y2 !== area.y2
      );
    }
  };

  Game_Map.prototype.isInPixelBlock = function(x, y) {
    return this._pixelBlockAreas.some(area =>
      x >= area.x1 && x <= area.x2 && y >= area.y1 && y <= area.y2
    );
  };

  const _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
  Game_CharacterBase.prototype.canPass = function(x, y, d) {
    if (this === $gamePlayer) {
      const pixelX = this._realX * 48 + 24;
      const pixelY = this._realY * 48 + 24;
      if ($gameMap.isInPixelBlock(pixelX, pixelY)) return false;
    }
    return _Game_CharacterBase_canPass.call(this, x, y, d);
  };

  // ���ӻ����Բ�
  const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
  Spriteset_Map.prototype.createUpperLayer = function() {
    _Spriteset_Map_createUpperLayer.call(this);
    this._pixelBlockDebugLayer = new Sprite_PixelBlockOverlay();
    this.addChild(this._pixelBlockDebugLayer);
  };

  class Sprite_PixelBlockOverlay extends Sprite {
    constructor() {
      super(new Bitmap(Graphics.width, Graphics.height));
      this.z = 9;
    }

    update() {
      super.update();
      if (!$gameMap._showPixelBlockDebug) {
        this.bitmap.clear();
        return;
      }
      this.bitmap.clear();
      this.drawBlocks();
    }

    drawBlocks() {
      const tw = 48, th = 48;
      const ox = $gameMap.displayX() * tw;
      const oy = $gameMap.displayY() * th;
      this.bitmap.paintOpacity = 100;
      this.bitmap.fillAll();
      for (const area of $gameMap._pixelBlockAreas) {
        const x = area.x1 - ox;
        const y = area.y1 - oy;
        const w = area.x2 - area.x1;
        const h = area.y2 - area.y1;
        this.bitmap.fillRect(x, y, w, h, "rgba(255,0,0,0.4)");
      }
    }
  }
})();
