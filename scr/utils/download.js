import React, { Component } from 'react';


// import * as Config from './Config.js';
// import NetUtil from './NetUtil.js';
import RNFS from 'react-native-fs';



import Zip from '@remobile/react-native-zip';

// const ZipArchive = require('react-native-zip-archive')

let jobId = -1;
const downloadDestName = `${RNFS.MainBundlePath}/${((Math.random() * 1000) | 0)}.zip`;


module.exports = {
    download (){

        const progress = data => {
            const percentage = ((100 * data.bytesWritten) / data.contentLength) || 0;
            const text = `Progress ${percentage}%`;
            console.log(text);
        };
        const begin = res => {
            console.log('Download has begun' );
        };
        const progressDivider = 1;

        const ret = RNFS.downloadFile({
            fromUrl: 'http://github.com/liuxiaojun666/test-zip/archive/master.zip',
            toFile: downloadDestName,
            begin,
            progress,
            progressDivider
        });

        jobId = ret.jobId;

        ret.promise.then(res => {
            console.log("file download ");
            console.log(downloadDestName);
            console.log(res);

            // 调用解压函数
            this.unzipNewCourse();


        }).catch(err => {
            console.log(err)
            jobId = -1;
        });

    },

    unzipNewCourse() {
        Zip.unzip(downloadDestName, RNFS.DocumentDirectoryPath, (err)=>{
            if (err)
            {
                // 解压失败
                console.log('error')
            }
            else
            {

                // 解压成功，将zip删除
                // RNFS.unlink(downloadDestName).then(() => {
                // });
                console.log('success' + RNFS.DocumentDirectoryPath)
            }
        });


        jobId = -1;
    }
}