import React, { Component } from 'react';
import utils from './index';
import { saveDownUrl } from '../store/actions';
import { connect } from "react-redux";
import RNFS from 'react-native-fs';

var Zip = require('@remobile/react-native-zip');
const downloadDest = utils.DOWNLOADDOCUMENTPATH; //下载之后保存的目录

// export default class Downloader {
//     constructor(path, docName, callback) {
//         this.path = path;
//         this.docName = docName;
//         this.callback = callback;
//     }

//     download() {
//         let that = this;
//         const progress = data => {
//             const percentage = ((100 * data.bytesWritten) / data.contentLength) || 0;
//             const text = `Progress ${percentage}%`;
//             callback({ "path": that.path, "docName": that.docName, "status": "downloading", "progress": percentage.toFixed(0) + " %" });
//             console.log(text);
//         };
//         const begin = res => {
//             callback({ "path": that.path, "docName": that.docName, "status": "start", "progress": "0%" });
//             console.log('Download has begun');
//         };
//         const progressDivider = 1;

//         const ret = RNFS.downloadFile({
//             fromUrl: that.path,
//             toFile: downloadDest + "/" + that.docName + ".zip",
//             begin,
//             progress,
//             progressDivider
//         });



//         ret.promise.then(res => {
//             console.log("file download ");
//             console.log(downloadDest);
//             console.log(res);
//             callback({ "path": that.path, "docName": that.docName, "status": "success", "progress": "处理中", unzip: "start" });
//             // 调用解压函数
//             this.unzipNewCourse(that.docName);

//         }).catch(err => {

//             callback({ "path": that.path, "docName": that.docName, "status": "faild", "progress": "0%" });
//             console.log(err)

//         });
//     }

//     unzipNewCourse(docName) {
//         const oriPath = downloadDest + "/" + docName + ".zip";
//         const newPath = downloadDest + "/" + docName;
//         Zip.unzip(oriPath, newPath, (err) => {
//             if (err) {
//                 debugger
//                 callback({ "path": path, "docName": docName, "status": "success", "progress": "0%", unzip: "faild" });
//                 // 解压失败
//                 console.log('error')
//             }
//             else {
//                 // //解压成功，将zip删除
//                 RNFS.unlink(oriPath).then(() => {
//                     callback({ "path": path, "docName": docName, "status": "success", "progress": "100%", unzip: "success" });
//                 });

//                 console.log('success__newPath==' + newPath);
//             }
//         });

//     }

// }

// let downloader = new Downloader(adsf,adf);
// downloader.callback = function(){};


module.exports = (path, docName, callback) => {// 参数写一下
    return {
        download() {
            // const progress = data => {
            //     const percentage = ((100 * data.bytesWritten) / data.contentLength) || 0;
            //     const text = `Progress ${percentage}%`;
            //     callback({ "path": path, "docName": docName, "status": "downloading", "progress": percentage.toFixed(0) + " %" });
            //     console.log(text);
            // };
            // const begin = res => {
            //     callback({ "path": path, "docName": docName, "status": "start", "progress": "0%" });
            //     console.log('Download has begun');
            // };
            const progressDivider = 1;

            const options = {
                fromUrl: path,
                toFile: downloadDest + "/" + docName + ".zip",
                begin:(res)=>{
                    callback({ "path": path, "docName": docName, "status": "start", "progress": "0%" });
                    console.log('Download has begun');
                },
                progress:(data)=>{
                    const percentage = ((100 * data.bytesWritten) / data.contentLength) || 0;
                    const text = `Progress ${percentage}%`;
                    callback({ "path": path, "docName": docName, "status": "downloading", "progress": percentage.toFixed(0) + " %" });
                    console.log(text);
                },
                progressDivider,
            }

            // const ret = RNFS.downloadFile({
            //     fromUrl: path,
            //     toFile: downloadDest + "/" + docName + ".zip",
            //     begin,
            //     progress,
            //     progressDivider,
            // });

            let ret;

            try{
                ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log("file download ");
                    console.log(downloadDest);
                    console.log(res);
                    callback({ "path": path, "docName": docName, "status": "success", "progress": "处理中", unzip: "start" });
                    // 调用解压函数
                    this.unzipNewCourse(docName);
    
                }).catch(err => {
                    callback({ "path": path, "docName": docName, "status": "faild", "progress": "0%" });
                    console.log(err)
                });
            }
            catch(error){

                callback({ "path": path, "docName": docName, "status": "faild", "progress": "0%" });
                console.log(error);
            }
            return ret;
        },

        unzipNewCourse(docName) {
            const oriPath = downloadDest + "/" + docName + ".zip";
            const newPath = downloadDest + "/" + docName;

            //如果原来存在目录  删掉原来目录  
            RNFS.unlink(newPath)
            .then(()=>{
                console.log('删除成功');
            })
            .catch((err)=>{
                console.log(err.message);
            })

            setTimeout(()=>{
                Zip.unzip(oriPath, newPath, (err) => {
                    if (err) {
                        callback({ "path": path, "docName": docName, "status": "success", "progress": "0%", unzip: "faild" });
                        // 解压失败
                        console.log('error')
                    }else {
                        // //解压成功，将zip删除
                        RNFS.unlink(oriPath).then(() => {
                            callback({ "path": path, "docName": docName, "status": "success", "progress": "100%", unzip: "success" });
                        });
    
                        console.log('success__newPath==' + newPath);
                    }
                },(progress)=>{
                    // callback({ "path": path, "docName": docName, "status": "success", "progress": "0%", unzip: "faild" });
                    console.log(progress);
                });
            },500)
            
        }
    }
}