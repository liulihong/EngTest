import React, { Component } from 'react';
import utils from './index';
import {saveDownUrl} from '../store/actions';
import {connect} from "react-redux";

var Zip = require('@remobile/react-native-zip');
const downloadDest=utils.DOWNLOADDOCUMENTPATH; //下载之后保存的目录

module.exports = (path, docName ,callback ) => {// 参数写一下
    let jobId = -1;
    // 是不是这个文件报的错啊 对  我点下载试题报的错

    return {
        download (){

            const progress = data => {
                const percentage = ((100 * data.bytesWritten) / data.contentLength) || 0;
                const text = `Progress ${percentage}%`;
                console.log(text);
            };
            const begin = res => {
                callback({"status":"start"});
                console.log('Download has begun' );
            };
            const progressDivider = 1;

            const ret = RNFS.downloadFile({
                fromUrl:path,
                toFile: downloadDest+"/"+docName+".zip",
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
                this.unzipNewCourse(docName);
                callback({"path":path,"docName":docName,"status":"success"});

            }).catch(err => {
                callback({"status":"faild"});
                console.log(err)
                jobId = -1;
            });
        },

        unzipNewCourse(docName) {
            const oriPath=downloadDest+"/"+docName+".zip";
            const newPath=downloadDest+"/"+docName;
            Zip.unzip(oriPath, newPath , (err)=>{
                if (err)
                {
                    // 解压失败
                    console.log('error')
                }
                else
                {
                    // //解压成功，将zip删除
                    RNFS.unlink(oriPath).then(() => {

                    });

                    console.log('success__newPath==' + newPath);
                }
            });
            jobId = -1;
        }
    }
}