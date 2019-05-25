/**
 * XMLHttpRequest 请求 
 * learn: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @param {object} param {}
 * @param {string} param.url 请求路径
 * @param {string} param.method GET 或者 POST
 * @param {object} param.data 传参对象
 * @param {Function} param.success 成功回调 
 * @param {Function} param.fail 失败回调 
 * @param {number} param.overtime 超时检测毫秒数
 * @param {Function} param.timeout 超时回调
 */
function ajax(param) {
    if (typeof param !== 'object') return console.error('ajax 缺少请求传参');
    if (!param.method) return console.error('ajax 缺少请求类型 GET 或者 POST');
    if (!param.url) return console.error('ajax 缺少请求 url');
    
    /** XMLHttpRequest */
    var XHR = new XMLHttpRequest();
    /** 请求方法 */
    var method = param.method.toUpperCase();
    /** 请求链接 */
    var url = param.url;
    /** 请求数据 */
    var data = null;
    /** 超时检测 */
    var overtime = typeof param.overtime === 'number' ? param.overtime : 0;

    // 传参处理
    switch (method) {
        case 'POST':
            data = param.data ? JSON.stringify(param.data) : {};
            break;
    
        case 'GET':
            // 解析对象传参
            var send_data = '';
            for (var key in param.data) send_data += '&' + key + '=' + param.data[key];
            send_data = '?' + send_data.slice(1);
            url += send_data;
            break;
    }

    // 监听请求变化
    // XHR.status learn: http://tool.oschina.net/commons?type=5
    XHR.onreadystatechange = function () {
        if (XHR.readyState !== 4) return;
        if (XHR.status === 200 || XHR.status === 304) {
            if (typeof param.success === 'function') param.success(JSON.parse(XHR.responseText));
        } else {
            if (typeof param.fail === 'function') param.fail(XHR);
        }
    }
    
    // XHR.responseType = 'json';
    // 是否Access-Control应使用cookie或授权标头等凭据进行跨站点请求。
    // XHR.withCredentials = true;	
    XHR.open(method, url, true);
    // application/json
    // application/x-www-form-urlencoded
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');// application/x-www-form-urlencoded

    // 在IE中，超时属性只能在调用 open() 方法之后且在调用 send() 方法之前设置。
    if (overtime > 0) {
        XHR.timeout = overtime;
        XHR.ontimeout = function () {
            console.warn('ajax 请求超时 !!!');
            XHR.abort();
            if (typeof param.timeout === 'function') param.timeout(XHR);
        } 
    }

    XHR.send(data);
}

/**
 * 基础请求
 * @param {string} method 'post'|'get'
 * @param {string} url 接口
 * @param {object} data 传参对象
 * @param {Function} success 成功回调
 * @param {Function} fail 失败回调
 */
export function baseRequest(method, url, data, success, fail) {
    ajax({
        url: url,
        method: method,
        data: data,
        overtime: 5000,
        success: function (res) {
            if (typeof success === 'function') success(res);
        },
        fail: function (err) {
            let error = { message: '接口报错，请看 network ' };
            if (err.response.charAt(0) == '{') {
                error = JSON.parse(err.response);
            }
            if (typeof fail === 'function') fail(error);
        },
        timeout: function () {
            var error = {
                message: '请求超时'
            }
            if (typeof fail === 'function') fail(error);
        }
    });
}