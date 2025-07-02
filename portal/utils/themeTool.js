/**
 * 根据颜色，获取它的对比度颜色（白色或黑色）
 * @param e color
 * @returns {string}
 */
function getContrastColor(e) {
    let o = e.toLowerCase()
    let r = "";
    if (/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(o)) {
        if (o.length === 4) {
            let expandedColor = "#";
            for (let index = 1; index < 4; index += 1) {
                expandedColor += o.slice(index, index + 1).concat(o.slice(index, index + 1));
            }
            o = expandedColor;
        }
        let f = [];
        for (let t = 1; t < 7; t += 2){
            f.push(parseInt("0x" + o.slice(t, t + 2)));
        }
        r = .299 * f[0] + .587 * f[1] + .114 * f[2] >= 192 ? "#000" : "#fff"
    }
    return r
}

/**
 * 展开3位的16进制颜色，展开后为6位
 * @param e
 * @returns {*}
 */
function expandHexColor(e) {
    return 3 === (e = e.substring(1)).length && (e = e.replace(/(.)/g, "$1$1")), "#" + e
}

/**
 * 混合颜色，将两种颜色按比例混合
 * @param e startColor
 * @param r endColor
 * @param l ratio
 * @returns {*}
 */
function blendColors(e, r, l) {
    e = expandHexColor(e), r = expandHexColor(r), l = Math.max(Math.min(Number(l), 1), 0);
    let t = parseInt(e.substring(1, 3), 16), f = parseInt(e.substring(3, 5), 16), c = parseInt(e.substring(5, 7), 16),
        s = parseInt(r.substring(1, 3), 16), a = parseInt(r.substring(3, 5), 16), n = parseInt(r.substring(5, 7), 16),
        i = Math.round(t * (1 - l) + s * l), g = Math.round(f * (1 - l) + a * l), h = Math.round(c * (1 - l) + n * l);
    return i = ("0" + (i || 0).toString(16)).slice(-2), g = ("0" + (g || 0).toString(16)).slice(-2), h = ("0" + (h || 0).toString(16)).slice(-2), "#" + i + g + h
}

/**
 * 生成主题色变量
 * @param e result 结果
 * @param o primaryColor 主题色
 * @param l brightColor 白色
 * @param t darkColor 黑色
 * @param f contrastColor 主题色的对比色
 */
function generateThemeColors(e, o = "#409eff", l = "#ffffff", t = "#000000", f = "#000") {
    let c = {
        primary: o,
        success: "#67c23a",
        warning: "#e6a23c",
        danger: "#f56c6c",
        error: "#f56c6c",
        info: "#909399"
    };
    e["--el-color-white"] = l;
    e["--el-color-black"] = t;
    e["--el-color-primary"] = o;
    e["--el-bg-color"] = l;
    e["--el-bg-color-overlay"] = l;
    e["--el-bg-color-page"] = blendColors(l, o, 0.2);
    if ("#000" === f) {
        e["--el-text-color-primary"] = blendColors("#000000", "#ffffff", 0.2);
        e["--el-text-color-regular"] = blendColors("#000000", "#ffffff", 0.3);
        e["--el-text-color-secondary"] = blendColors("#000000", "#ffffff", 0.4);
        e["--el-text-color-placeholder"] = blendColors("#000000", "#ffffff", 0.5);
    } else if ("#fff" === f) {
        e["--el-text-color-primary"] = r("#ffffff", "#000000", 0.2);
        e["--el-text-color-regular"] = r("#ffffff", "#000000", 0.3);
        e["--el-text-color-secondary"] = r("#ffffff", "#000000", 0.4);
        e["--el-text-color-placeholder"] = r("#ffffff", "#000000", 0.5);
    } else {
        e["--el-text-color-primary"] = f;
        e["--el-text-color-regular"] = f;
        e["--el-text-color-secondary"] = f;
        e["--el-text-color-placeholder"] = f;
    }
    e["--el-fill-color"] = blendColors(l, o, 0.1);
    e["--el-fill-color-light"] = l;
    e["--el-fill-color-lighter"] = l;
    e["--el-fill-color-extra-light"] = l;
    e["--el-fill-color-dark"] = l;
    e["--el-fill-color-darker"] = l;
    e["--el-fill-color-blank"] = l;

    const s = "--el-color-";
    Object.keys(c).map((key => {
        for(let i = 1; i < 10; i++){
            e[`${s}${key}-light-${10 - i}`] = blendColors(l, c[key], 0.1 * i);
        }
        for(let i = 1; i < 10; i++){
            e[`${s}${key}-dark-${10 - i}`] = blendColors(l, c[key], 0.1 * i);
        }
    }))
}

/**
 * 16进行颜色转rgb数组
 * @param color
 * @returns {[number,number,number]|null}
 */
export const hexToRGBnumber = function (color) {
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
        color = color.substring(1);
        if (color.length == 3) {
            color = color.split('').map(function (c) {
                return c + c;
            }).join('');
        }
        color = '0x' + color;
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        return [r, g, b]
    } else if (/^rgb\((\d+), (\d+), (\d+)\)$/.test(color)) {
        const parts = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(color);
        const r = parseInt(parts[1]);
        const g = parseInt(parts[2]);
        const b = parseInt(parts[3]);
        return [r, g, b]
    } else {
        return null;
    }
}

export const getThemeData = function (o = {}) {
    o.themeColor = o.themeColor || "#409eff";
    o.brightColor = o.brightColor || "#fff";
    o.darkColor = o.darkColor || blendColors("#000", o.brightColor, 0.1);
    let contrastColor = getContrastColor(o.brightColor);
    let obj = {};
    generateThemeColors(obj, o.themeColor, o.brightColor, o.darkColor, contrastColor);
    return obj
};
