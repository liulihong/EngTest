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
const response = (responseObj) => {
    const obj = responseObj.clone();
    const str = JSON.stringify(obj.headers);
    if (str.includes('/json;')) return obj.json();
    else if (str.includes('/text;')) return obj.text();
    else return new Promise((resolve, reject) => {
        if (obj.status === 200 || obj.status === 204) resolve({ success: true });
        else reject('error');
    });
};

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