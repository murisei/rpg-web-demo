/*:
 * @target MZ
 * @plugindesc 统一倾斜方向的抽象雨粒子（星露谷风格）by sudo（修正版）
 * @author sudo
 * @help
 * 所有雨滴将统一从右上倾斜落向左下，视觉方向与运动方向一致。
 */

(() => {
    const rainCount = 120;
    const particles = [];
    let rainLayer = null;
    let rainFrameCounter = 0;
    const rainUpdateInterval = 1; // 控制节奏，越大越“卡帧”


    // 控制雨滴速度和方向
    const WIND_X = -2;  // 向左
    const FALL_Y = 12;  // 向下

    class RainDrop extends PIXI.Graphics {
        constructor() {
            super();
            this.reset();
        }

        reset() {
            this.clear();
            this.x = Math.random() * Graphics.width + 100;
            this.y = -Math.random() * Graphics.height;

            this.alpha = 0.4 + Math.random() * 0.5;
            const length = 30 + Math.random() * 20;

            this._dx = WIND_X;
            this._dy = FALL_Y;

            // 画一条倾斜方向的线段（使用 lineTo）
            this.lineStyle(1, 0xffffff, this.alpha);
            this.moveTo(0, 0);
            this.lineTo(WIND_X / FALL_Y * length, length); // 按运动方向画出斜线
        }

        update() {
            if (!this.transform || !this.transform.position) return;

            this.x += this._dx;
            this.y += this._dy;

            if (this.y > Graphics.height || this.x < -50 || this.x > Graphics.width + 50) {
                this.reset();
            }
        }

    }

    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function () {
        _Scene_Map_createDisplayObjects.call(this);
        this.createRainLayer();
    };

    Scene_Map.prototype.createRainLayer = function () {
        rainLayer = new PIXI.Container();
        this._spriteset.addChild(rainLayer);

        for (let i = 0; i < rainCount; i++) {
            const drop = new RainDrop();
            rainLayer.addChild(drop);
            particles.push(drop);
        }

        const blur = new PIXI.filters.BlurFilter(1.0, 2);
        rainLayer.filters = [blur];
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);

        rainFrameCounter++;
        if (rainFrameCounter % rainUpdateInterval === 0) {
            for (const drop of particles) {
                drop?.update?.(); // 安全调用 update 方法，避免 null 报错
            }
        }
    };



})();
