/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/es/integration/react";
import { Image, Text } from "react-native";
import configureStore from './store';
import Router from './pages/router'
import getToken from  './request/getToken'
import utils from './utils'
// 引入启动页组件
// import SplashScreen from 'rn-splash-screen';
// import

let { store, persistor } = configureStore();

export default class App extends Component{
    constructor() {
        super(...arguments);
        this.setToken = this.setToken.bind(this);
        getToken(store, this.setToken);
        this.state = {
            hasToken: false,
            isLogin:false,
        };
    }
    setToken(obj) {
        // SplashScreen.hide();
        this.setState({
            hasToken: obj.hasToken,
            isLogin:obj.isLogin
        });
    }
    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <Router isLogin={this.state.isLogin}/>
                </PersistGate>
            </Provider>
    );
  }
}

// {this.state.hasToken ?  <Router isLogin={this.state.isLogin}/> : <Image
//     style={{width:utils.SCREENWIDTH , height:utils.SCREENHEIGHT}}
//     source={require('./imgs/web1.png')}
// />}
//{this.state.hasToken ? <Router /> : <LogRouter />}
// {rootState.userInfo && rootState.userInfo.logResult ? <Router /> : <LogRouter />}
