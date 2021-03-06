const DEV = "development";//开发
const TEST1 = "test_n";//内网测试
const TEST2 = "test_w";//外网测试
const DIS = "distribute";//发布

const Environmental = TEST2;


// const hostUrl = 'http://139.196.111.38:8084';
// const hostUrl = 'http://192.168.12.150:28071';//小英电脑
// const hostUrl = 'http://tsk.eqd.17work.cn';//192.168.12.8
// const hostUrl = 'http://tsk.demo.17work.cn';//外网测试账号
// const hostUrl = 'http://tsk.17work.com.cn';//外网测试账号
// const hostUrl = 'https://tsk.dev.17work.com.cn';//测试
// const hostUrl = 'http://39.107.247.196:17800';//测试
// const hostUrl = 'http://tsk.eqd.17work.cn:17000';//测试
let hostUrl = "";
switch (Environmental) {
    case DEV:
        hostUrl = 'http://192.168.12.153:2382';//小英电脑
        break;
    case TEST1:
        hostUrl = 'http://tsk.eqd.17work.cn';//内网测试
        break;
    case TEST2:
        hostUrl = 'http://39.107.247.196:17900';//外网测试
        break;
    case DIS:
        hostUrl = 'http://39.107.247.196:17800';//发布
        break;
    default:
        break;
}

//开发环境提示信息
const showDevInfo = (devInfo) => {
    // debugger
    if (process.env.NODE_ENV === "development") {
        alert(devInfo);
    }
}


module.exports = {
    DEV,
    TEST1,
    TEST2,
    DIS,
    Environmental,
    hostUrl,
    showDevInfo,
}
