import { COOKIE, ERROR,LOGIN } from '../store/actionTypes';
import { fetchPost, setCookie } from "../request/fetch";
import { getCookie } from "../request/requestUrl";
import utils from  '../utils';
import { AsyncStorage } from "react-native";


export default (store, callback) => {
    const func = (token) => {
        store.dispatch({
            promise: fetchPost(getCookie, {
                "ClientName": utils.PLATNAME,
                "VersionCode": 2,
                "ProtocolVersion": 2,
                "LastSessionID": token
            }).then(res => {
                callback({hasToken:res.SessionID,isLogin:res.CurrentUser});
                if (!res.CurrentUser){
                    store.dispatch({type: LOGIN, result: {}})
                }
                AsyncStorage.setItem('token', res.SessionID)
                setCookie(res.SessionID);
                return res
            }),

            types: ['', COOKIE, ERROR]
        });
    };

    AsyncStorage.getItem('token').then((token) => func(token)).catch(() => func(''));

}

