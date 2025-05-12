/*:
 * @target MZ
 * @plugindesc 全局滤镜插件,作用于菜单/地图/战斗场景 @Murisei
 * @author Murisei
 *
 * @command SetGlobalFilter
 * @text 设置全局滤镜
 * @desc 设置亮度、对比度、饱和度、色调等滤镜，永久作用于所有场景
 *
 * @arg contrast
 * @type number
 * @default 0.5
 * @decimals 2
 * @desc 对比度（根据亮度可适当拉大）
 *
 * @arg saturation
 * @type number
 * @default 0.5
 * @decimals 2
 * @desc 饱和度（建议0）
 *
 * @arg brightness
 * @type number
 * @default 0.5
 * @decimals 2
 * @desc 亮度（建议0.12-0.15）
 *
 * @arg hue
 * @type number
 * @default 0
 * @min -180
 * @max 180
 * @desc 色调旋转（角度）
 */

(() => {
    const pluginName = "GlobalPersistentFilter";

    let globalFilter = null;
    let lastSettings = {
        contrast: 1.0,
        saturation: 1.0,
        brightness: 1.0,
        hue: 0
    };

    // 创建滤镜
    function createGlobalFilter() {
        if (!globalFilter) {
            globalFilter = new PIXI.filters.ColorMatrixFilter();
        }
        applyFilterSettings(globalFilter, lastSettings);
        return globalFilter;
    }

    function applyFilterSettings(filter, settings) {
        filter.reset();
        filter.contrast(settings.contrast, true);
        filter.saturate(settings.saturation, true);
        filter.brightness(settings.brightness, true);
        if (settings.hue !== 0) {
            filter.hue(settings.hue, true);
        }
    }

    // 每个场景加载时附加滤镜
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function () {
        _Scene_Base_start.call(this);
        this.attachGlobalFilter();
    };

    Scene_Base.prototype.attachGlobalFilter = function () {
        const root = this.children[0]; // Scene base container
        if (!globalFilter) return;
        if (!root.filters) root.filters = [];
        if (!root.filters.includes(globalFilter)) {
            root.filters.push(globalFilter);
        }
    };

    // 插件命令：设置全局滤镜
    PluginManager.registerCommand(pluginName, "SetGlobalFilter", args => {
        lastSettings = {
            contrast: parseFloat(args.contrast),
            saturation: parseFloat(args.saturation),
            brightness: parseFloat(args.brightness),
            hue: parseFloat(args.hue)
        };

        if (!globalFilter) createGlobalFilter();
        applyFilterSettings(globalFilter, lastSettings);

        const currentScene = SceneManager._scene;
        if (currentScene && currentScene.attachGlobalFilter) {
            currentScene.attachGlobalFilter();
        }

        console.log(`[全局滤镜] 已设置：亮度=${lastSettings.brightness} 对比度=${lastSettings.contrast} 饱和度=${lastSettings.saturation} 色调=${lastSettings.hue}`);
    });
})();
