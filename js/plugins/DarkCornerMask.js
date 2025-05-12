/*:
 * @target MZ
 * @plugindesc 动态四角暗角遮罩，随缩放值淡入淡出（优化显示层级）
 * @author GPT
 */

(() => {
    const DarkVignette = {
        sprite: null,

        create() {
            const w = Graphics.width;
            const h = Graphics.height;
            const vignetteSize = 300;
            const maxAlpha = 1;

            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");

            function drawGradient(x, y, invertX, invertY) {
                const grad = ctx.createRadialGradient(
                    x, y, 0,
                    x, y, vignetteSize
                );
                grad.addColorStop(0, `rgba(0, 0, 0, ${maxAlpha})`);
                grad.addColorStop(1, `rgba(0, 0, 0, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.rect(
                    invertX ? x - vignetteSize : x,
                    invertY ? y - vignetteSize : y,
                    vignetteSize,
                    vignetteSize
                );
                ctx.fill();
            }

            drawGradient(0, 0, false, false);
            drawGradient(w, 0, true, false);
            drawGradient(0, h, false, true);
            drawGradient(w, h, true, true);

            // 用 PIXI.Texture 替代 Bitmap
            const texture = PIXI.Texture.from(canvas);
            this.sprite = new PIXI.Sprite(texture);
            this.sprite.zIndex = 9999;
            this.sprite.alpha = 0;
            this.sprite.anchor.set(0, 0);
            this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        },

        attachToScene(scene) {
            if (!this.sprite) {
                this.create();
            }

            if (!this.sprite) {
                console.warn('DarkVignette: sprite 创建失败');
                return;
            }

            if (!scene || typeof scene.addChild !== 'function') {
                console.warn('DarkVignette: 场景无效，无法 addChild');
                return;
            }

            if (!scene.children || scene.children.includes(this.sprite)) {
                // 已经添加过了，跳过
                return;
            }

            try {
                scene.addChild(this.sprite);
            } catch (e) {
                console.error('DarkVignette: 添加 sprite 时发生错误', e);
            }
        }
,

        update() {
            if (!this.sprite || !$gameScreen) return;
            const zoom = $gameScreen.zoomScale();
            const opacity = Math.min(Math.max((zoom - 1) / 3, 0), 1);
            this.sprite.alpha = opacity;
        }
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        DarkVignette.attachToScene(this);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        DarkVignette.update();
    };
})();
