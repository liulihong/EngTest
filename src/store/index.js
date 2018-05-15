import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import promiseMiddleware from "./promise_middleware";
import { userInfo, videoList, detail } from "./reducer";
// import { createLogger } from "redux-logger";
import { AsyncStorage } from "react-native";
import { persistReducer, persistStore } from 'redux-persist';


const reducerVersion = '1'; //修改reducer时 如果修改了数据结构或类型  修改reducer版本号

const mainPersistConfig = {
    key: "root",
    storage: AsyncStorage,
    blacklist: []
};

// 创建reducer
let rootReducer = persistReducer(mainPersistConfig, combineReducers({ userInfo, videoList, detail }));


const middlewares = [];
middlewares.push(promiseMiddleware);

if (process.env.NODE_ENV === 'development') {
    //创建中间件logger
    const { logger } = require(`redux-logger`);
    middlewares.push(logger);
}

export default () => {

    let store = createStore(rootReducer, {}, compose(applyMiddleware(...middlewares)));
    let persistor = persistStore(store);

    AsyncStorage.getItem('reducerVersion').then((localVersion) => {

        if (localVersion !== reducerVersion) persistor.purge(['root']).then(() => AsyncStorage.setItem('reducerVersion', reducerVersion));

    }).catch(() => AsyncStorage.setItem('reducerVersion', reducerVersion));

    return { store, persistor };
};
