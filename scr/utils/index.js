import {env,define,error} from "../config"
import common from "./common"

module.exports = {
    SCREENWIDTH: define.SCREENWIDTH,
    SCREENHEIGHT: define.SCREENHEIGHT,
    PLATNAME: define.PLATNAME,
    COLORS: define.COLORS,
    CurrVersion: define.CurrVersion,
    DOWNLOADDOCUMENTPATH:define.downloadDest,

    findErrorInfo:error.findErrorInfo,

    isLastIndex: common.isLastIndex,
    findPlayPath: common.findPlayPath,
    findPicturePath: common.findPicturePath,
    callOnceInInterval: common.callOnceInInterval,
    
    showDevInfo: env.showDevInfo,
}