import React, { createElement, Component } from 'react';
import { NetInfo, Platform } from 'react-native';

export default class NetInfos {
    constructor() {
        this.isConnected = true;
        this.handleConnectionChange = this.handleConnectionChange.bind(this);
        this.addListenning = this.addListenning.bind(this);
        this.removeListenning = this.removeListenning.bind(this);
        
        this.connectionInfo = {
            type: null,
            effectiveType: null
        }
        this.removeListenning();
        this.addListenning();
        // this.handleConnectionChange();


        // async function getConed(){
        //     var coned = await NetInfo.isConnected.fetch();
        //     alert('**********'+coned);
        //     setTimeout(() => {
        //         getConed();
        //     }, 1000*3);
        // }

        // getConed();
    }

    handleConnectionChange() {
        Promise.all([
            NetInfo.isConnected.fetch(),
            NetInfo.getConnectionInfo()
        ]).then(([isConnected, connectionInfo]) => {
            // debugger
            this.isConnected = isConnected;
            this.connectionInfo = connectionInfo;
            if(!isConnected){
                alert("请检查网络！");
            }
            // async function getConed(){
            //     var coned = await NetInfo.isConnected.fetch()      
            //     alert(isConnected + '----' + JSON.stringify(coned));
            // }
            // getConed();
        });
    };

    // async isCon(){
    //     if(!this.isConnected){
    //          this.isConnected = await NetInfo.isConnected.fetch()
    //     }
    //     return this.isConnected;
    // }

    addListenning(){
        NetInfo.addEventListener('connectionChange', this.handleConnectionChange);

        // NetInfo.isConnected.addEventListener('connectionChange', function(b){
        //     alert('isConnected::::'+b);
        // });
    }

    removeListenning(){
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleConnectionChange
        );
    }

}

