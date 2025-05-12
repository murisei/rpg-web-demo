/*:
 * @target MZ
 * @plugindesc 为指定事件添加锐化滤镜，支持动态缩放时增强。by ChatGPT
 * @author ChatGPT
 * @help
 * 使用方式：
 * 在事件页的备注中添加 <SharpenFilter> 可启用锐化滤镜
 * 
 * 可通过事件脚本设置锐化强度：
 * this.character(事件ID)._sharpenStrength = 1.0;
 * 
 * 默认强度为 0.5
 */

(() => {
  const tag = 'SharpenFilter';

  function createSharpenFilter(strength = 0.5) {
    const fragment = [
      "precision mediump float;",
      "varying vec2 vTextureCoord;",
      "uniform sampler2D uSampler;",
      "uniform float strength;",
      "void main(void) {",
      "  vec2 px = vec2(1.0) / vec2(textureSize(uSampler, 0));",
      "  vec4 color = texture2D(uSampler, vTextureCoord);",
      "  vec4 sum = vec4(0.0);",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2(-1.0, -1.0)) * -1.0;",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2( 0.0, -1.0)) * -1.0;",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2( 1.0, -1.0)) * -1.0;",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2(-1.0,  0.0)) * -1.0;",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2( 0.0,  0.0)) * 9.0;",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2( 1.0,  0.0)) * -1.0;",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2(-1.0,  1.0)) * -1.0;",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2( 0.0,  1.0)) * -1.0;",
      "  sum += texture2D(uSampler, vTextureCoord + px * vec2( 1.0,  1.0)) * -1.0;",
      "  gl_FragColor = mix(color, sum, strength);",
      "}"
    ].join("\n");
    return new PIXI.Filter(undefined, fragment, { strength: strength });
  }

  function hasSharpenTag(event) {
    if (!event || !event.note) return false;
    return event.note.includes(`<${tag}>`);
  }

  const _Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    _Sprite_Character_update.call(this);
    this.updateSharpenFilter();
  };

  Sprite_Character.prototype.updateSharpenFilter = function() {
    const character = this._character;
    if (!character || !(character instanceof Game_Event)) return;

    const event = character.event();
    if (!hasSharpenTag(event)) return;

    if (!this._sharpenFilter) {
      const strength = character._sharpenStrength || 0.5;
      this._sharpenFilter = createSharpenFilter(strength);
      this.filters = this.filters || [];
      this.filters.push(this._sharpenFilter);
    }

    const target = character._sharpenStrength || 0.5;
    if (this._sharpenFilter.uniforms.strength !== target) {
      this._sharpenFilter.uniforms.strength = target;
    }
  };
})();
