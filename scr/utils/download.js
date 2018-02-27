import React, { Component } from 'react';
import utils from './index';


// import * as Config from './Config.js';
// import NetUtil from './NetUtil.js';
// import RNFS from 'react-native-fs';
var RNFS = require('react-native-fs');


// import Zip from '@remobile/react-native-zip';
var Zip = require('@remobile/react-native-zip');

// const ZipArchive = require('react-native-zip-archive')

let jobId = -1;
const downloadDest=(utils.PLATNAME=="IOS")?RNFS.DocumentDirectoryPath:RNFS.ExternalDirectoryPath;

// const downloadDestName = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.zip`;
// const downloadDest = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.zip`;
// const downloadDest=RNFS.ExternalDirectoryPath + "/aa.zip";

module.exports = {
    download (obj){
        // const downloadDestName = RNFS.DocumentDirectoryPath+"/OriFiles/"+obj.SecTitle+".zip";
        const progress = data => {
            const percentage = ((100 * data.bytesWritten) / data.contentLength) || 0;
            const text = `Progress ${percentage}%`;
            console.log(text);
        };
        const begin = res => {
            console.log('Download has begun' );
        };
        const progressDivider = 1;

        const fromurl="http://192.168.12.150:28071/"+obj.DownPath;
        const ret = RNFS.downloadFile({
            // fromUrl: 'http://github.com/liuxiaojun666/test-zip/archive/master.zip',
            fromUrl:fromurl,
            toFile: downloadDest+"/"+obj.SecTitle+".zip",
            begin,
            progress,
            progressDivider
        });

        jobId = ret.jobId;

        ret.promise.then(res => {
            console.log("file download ");
            console.log(downloadDest);
            console.log(res);

            // 调用解压函数
            this.unzipNewCourse(obj);


        }).catch(err => {
            console.log(err)
            jobId = -1;
        });

    },

    unzipNewCourse(obj) {
        // const downloadDestName = RNFS.DocumentDirectoryPath+"/"+obj.SecTitle+".zip";
        const oriPath=downloadDest+"/"+obj.SecTitle+".zip";
        const newPath=downloadDest+"/"+obj.SecTitle;
        Zip.unzip(oriPath, newPath , (err)=>{
            if (err)
            {
                // 解压失败
                console.log('error')
            }
            else
            {

                //解压成功，将zip删除
                RNFS.unlink(oriPath).then(() => {

                });
                console.log('success__newPath==' + newPath);
            }
        });
        jobId = -1;
    }
}