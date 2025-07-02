/**
 * 检查是否是url地址
 * @param str
 * @returns {boolean}
 */
export const isUrl = (str) => {
    if(typeof str !== 'string') return false
    return str.startsWith('http')
}

/**
 * 获取当前环境的erp应用baseURL
 * @param {string} type - erp的类型，必须是 'seller', 'service', 或 'app' 中的一个
 * @returns {string}
 */
export const getErpBaseUrl = (type,env) => {
    if(!type) return

    // const env = import.meta.env.VITE_NODE_ENV
    let urlObj
    if(env=='development' || env=='staging'){
        urlObj = {seller: 'sellerptest', service: 'servicerptest', app: 'apperp-test'}
    }else if(env == 'training'){
        urlObj = {seller: 'sellerptrain', service: 'servicerptrain1', app: 'apperptrain'}
    }else {
        urlObj = {seller: 'sellerpro', service: 'servicerp', app: 'apperp'}
    }
    return 'https://'+urlObj[type]+'.aeotrade.com'
}



/**
 * 将url参数转换为对象，url中需要带 ? 号
 * @param {string} url
 * @returns {Object}
 */
export const parseQueryString = (url) => {
    const queryString = url.split('?')[1]; // 获取查询字符串部分
    if (!queryString) {
        return {}; // 如果没有查询字符串，返回空对象
    }

    const params = queryString.split('&'); // 将参数分割成数组
    const result = {};

    for (const param of params) {
        const [key, value] = param.split('='); // 分割参数名和参数值
        result[key] = decodeURIComponent(value); // 解码特殊字符并存储到对象中
    }

    return result;
}

/**
 * 将对象转换为url字符串参数
 * @param {Object} params
 * @returns {string}
 */
export const buildQueryString = (params) => {
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    return queryString;
}

/**
 * 合并对象并去重，后面的对象覆盖前面的对象
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {Object}
 */
export const mergeAndDeduplicateObjects = (obj1, obj2) => {
    const mergedArray = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])];
    const mergedObject = {};

    for (const key of mergedArray) {
        if (obj1.hasOwnProperty(key)) {
            mergedObject[key] = obj1[key];
        }

        if (obj2.hasOwnProperty(key)) {
            mergedObject[key] = obj2[key];
        }
    }

    return mergedObject;
}
