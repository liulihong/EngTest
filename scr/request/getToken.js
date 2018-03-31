import { COOKIE, ERROR,LOGIN } from '../store/actionTypes';
import { fetchPost, setCookie } from "../request/fetch";
import { getCookie } from "../request/requestUrl";
import utils from  '../utils';
import { AsyncStorage } from "react-native";
import SplashScreen from "rn-splash-screen";


export default (store, callback) => {
    const func = (token) => {
        store.dispatch({
            promise: fetchPost(getCookie, {
                "ClientName": utils.PLATNAME,
                "VersionCode": 1,
                "ProtocolVersion": 2,
                "LastSessionID": token
            }).then(res => {
                if(res.ErrorCode!==undefined){
                    alert(utils.findErrorInfo(res));
                }

                callback({hasToken:res.SessionID,isLogin:res.CurrentUser});

                if (!res.CurrentUser){
                    store.dispatch({type: LOGIN, result: {}})
                }

                AsyncStorage.setItem('token', res.SessionID);

                setCookie(res.SessionID);

                SplashScreen.hide();

                return res
            }),

            types: ['', COOKIE, ERROR]
        });
    };

    AsyncStorage.getItem('token').then((token) => func(token)).catch(() => func(''));

}

