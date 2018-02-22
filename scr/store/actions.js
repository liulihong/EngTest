import { LOGIN} from './actionTypes';
import { fetchGet, fetchPost } from "../request/fetch";
import { getCookie as cookie ,login} from "../request/requestUrl";

// export const increase = (name) => ({ type: INCREASE, name });
// export const decrease = (name) => ({ type: DECREASE, name });
// export const reset = (name, initVal) => ({ type: RESET, initVal, name });

export const Login = (obj) => {
    return {
        // promise : fetchPost(login,obj).then(res =>res),
        promise : fetchPost(login,obj).then(res =>{
            return res;
        }),
        types: ['',LOGIN,'']
    }
}

// export const getMovieList = () => {
//     return {
//         // promise: fetchGet(cookie).then(res => {
//         //     return res
//         // }),
//         // types: ['',GETVIDEOLIST, '']
//     }
// }

