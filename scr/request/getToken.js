import { COOKIE, ERROR,LOGIN } from '../store/actionTypes';
import { fetchPost, setCookie } from "../request/fetch";
import { getCookie } from "../request/requestUrl";
import utils from  '../utils';
import { AsyncStorage,Alert ,Linking} from "react-native";
import SplashScreen from "rn-splash-screen";


export default (store, callback) => {
    let version=(utils.PLATNAME==="IOS") ? utils.version_ios : utils.version_android;
    const func = (token) => {
        store.dispatch({
            promise: fetchPost(getCookie, {
                "ClientName": utils.PLATNAME,
                "VersionCode": version,
                "ProtocolVersion": 2,
                "LastSessionID": token,
            }).then(res => {
                
                if(res.ErrorCode!==undefined){
                    Alert.alert("",utils.findErrorInfo(res));
                }

                if ((res.LastClientVersion > version)) {
                    Alert.alert('有新版本', '更新说明：' + res.LastClientText,
                        [
                            { text: "暂不更新", onPress: () => { } },
                            {
                                text: "立即更新", onPress: () => {
                                    
                                    Linking.canOpenURL(res.UploadUrl).then(supported => {
                                        if (supported) {
                                            Linking.openURL(res.UploadUrl);
                                        } else {
                                            alert("打不开下载地址哦！");
                                        }
                                    })

                                }
                            },
                        ]
                    );
                } 

                callback({hasToken:res.SessionID,isLogin:(res.CurrentUser!==null)});

                if (!res.CurrentUser){
                    store.dispatch({type: LOGIN, result: null})
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

