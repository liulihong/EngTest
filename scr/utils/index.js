import {env,define,error} from "../config"
import common from "./common"
import CurrNetInfo from "./netInfo"

module.exports = {
    SCREENWIDTH: define.SCREENWIDTH,
    SCREENHEIGHT: define.SCREENHEIGHT,
    PLATNAME: define.PLATNAME,
    COLORS: define.COLORS,
    CurrVersion: define.CurrVersion,
    DOWNLOADDOCUMENTPATH:define.downloadDest,
    SCREENRATE: define.screenRate,

    findErrorInfo:error.findErrorInfo,

    isLastIndex: common.isLastIndex,
    findPlayPath: common.findPlayPath,
    findPicturePath: common.findPicturePath,
    callOnceInInterval: common.callOnceInInterval,
    getTimeStr: common.getTimeStr,    
    getTimeCha: common.getTimeCha,
    
    showDevInfo: env.showDevInfo,
    Environmental: env.Environmental,
    DIS: env.DIS,

    netInfo: new CurrNetInfo(),
}