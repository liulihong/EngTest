import React, { Component } from 'react';
import utils from './index';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import { Platform,PermissionsAndroid } from "react-native";

var RNFS = require('react-native-fs');

let currentTime = 0.0;//开始录音到现在的持续时间
let recording=false; //是否正在录音
let stoppedRecording= false; //是否停止了录音
let finished= false; //是否完成录音
let hasPermission=undefined; //是否获取权限

module.exports = {

    checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }
        const rationale = {
            'title': '获取录音权限',
            'message': 'XXX正请求获取麦克风权限用于录音,是否准许'
        };
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                // alert(result);     //结果: granted ,    PermissionsAndroid.RESULTS.GRANTED 也等于 granted
                return (result === true || PermissionsAndroid.RESULTS.GRANTED)
            })
    },

    getPermission(audioPath){
        // 页面加载完成后获取权限
        this.checkPermission().then((hasPermission1) => {
            hasPermission = hasPermission1;

            //如果未授权, 则执行下面的代码
            if (!hasPermission) return;


            this.prepareRecordingPath(audioPath);

            stoppedRecording=true;

            AudioRecorder.onProgress = (data) => {
                currentTime=Math.floor(data.currentTime);
            };

            AudioRecorder.onFinished = (data) => {
                if (Platform.OS === 'ios') {
                    this.finishRecording(data.status === "OK", data.audioFileURL);
                }
            };

        })
    },

    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 16000,
            Channels: 1,
            AudioQuality: "Low", //录音质量
            AudioEncoding: "lpcm", //录音格式
            // AudioEncodingBitRate: 32000 //比特率
        });
    },

    async startRecord(newAudioPath) {
        // 如果正在录音
        if (recording) {
            alert('正在录音中!');
            return;
        }
        //如果没有获取权限
        if (!hasPermission) {
            // this.getPermission(newAudioPath);
            alert('没有获取录音权限!');
            return;
        }

        //如果暂停获取停止了录音
        if (stoppedRecording) {
            this.prepareRecordingPath(newAudioPath);
        }
        recording=true;
        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    },

    async stopRecord() {
        // 如果没有在录音
        if (!recording) {
            // alert('没有录音, 无需停止!');
            return;
        }

        stoppedRecording=true;
        recording=false;

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this.finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    },

    async pauseRecord() {
        if (!recording) {
            alert('没有录音, 无需停止!');
            return;
        }
        stoppedRecording=true;
        recording=false;
        try {
            const filePath = await AudioRecorder.pauseRecording();

            // 在安卓中, 暂停就等于停止
            if (Platform.OS === 'android') {
                this.finishRecording(true, filePath);
            }
        } catch (error) {
            console.error(error);
        }
    },

    finishRecording(didSucceed, filePath) {
        finished=didSucceed;
        console.log('Finish');
        //console.log(Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath});
    }
}







