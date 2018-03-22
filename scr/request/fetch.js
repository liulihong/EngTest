const $params = (obj = {}) => {
    let str = []
    for (let p in obj) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
    }
    return str.join("&")
}

let sesstionId = ''
export const setCookie = (id) => {
    sesstionId = 'sid='+ id;
}
const response = (obj) => {
    for (const iterator of obj.headers.values()) {
        if (iterator.includes('text/html;charset=UTF-8')) return obj.text()
        if (iterator.includes('application/json;charset=UTF-8')) return obj.json()
        if (iterator.includes('text/plain;charset=UTF-8')) {
            return new Promise((resolve, reject) => {
                // 那就是没成功  接口不是200
                if (obj.status === 200 || obj.status===204) resolve({success: true})
                else reject('error')
            })
        }
    }
// 你要干啥 你不是说不是json么   先看一下是啥

    return obj.json();
}

export const fetchPost = (url, obj) => fetch(url, {
    method: 'POST',
    headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // "Cookie": sesstionId
    }),
    body: JSON.stringify(obj),
}).then(res => response(res))

export const fetchGet = (url, obj) => fetch(url + '?' + $params(obj), {
    // "sid": sesstionId
}).then(res => response(res))