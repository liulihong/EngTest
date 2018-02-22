const $params = (obj = {}) => {
    let str = []
    for (let p in obj) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
    }
    return str.join("&")
}

let sesstionId = ''
export const setCookie = (id) => {
    sesstionId = id
}
const response = (obj) => {
    for (const iterator of obj.headers.values()) {
        if (iterator.includes('text/html;charset=UTF-8')) return obj.text()
        if (iterator.includes('application/json;charset=UTF-8')) return obj.json()
    }
    return obj.json()
}

export const fetchPost = (url, obj) => fetch(url, {
    method: 'POST',
    headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // "sid": sesstionId
    }),
    body: JSON.stringify(obj),
}).then(res => response(res))

export const fetchGet = (url, obj) => fetch(url + '?' + $params(obj), {
    "sid": sesstionId
}).then(res => response(res))