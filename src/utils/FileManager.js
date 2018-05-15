import RNFS from 'react-native-fs';



module.exports={
    /*将文本写入本地 txt*/
    writeFile() {
        // create a path you want to write to
        const path = RNFS.MainBundlePath + '/test.txt';

        // write the file
        RNFS.writeFile(path, '这是一段文本，YES', 'utf8')
            .then((success) => {
                console.log('path', path);
            })
            .catch((err) => {
                console.log(err.message);
            });
    },
    /*读取txt文件内容*/
    readFile(path,callBack) {
        // create a path you want to delete
        // const path = RNFS.MainBundlePath + '/test.txt';

        return RNFS.readFile(path)
            .then((result) => {
                // console.log(result);
                callBack(result);//返回result是对的  但是是存的字符串

                // let dataDic=JSON.parse(result);
                // callBack(dataDic);//返回dataDic就报错了

            })
            .catch((err) => {
                console.log(err.message);

            });
    },
    /*在已有的txt上添加新的文本*/
    appendFile() {
        const path = RNFS.MainBundlePath + '/test.txt';

        return RNFS.appendFile(path, '新添加的文本', 'utf8')
            .then((success) => {
                console.log('success');
            })
            .catch((err) => {
                console.log(err.message);

            });
    },
    /*删除文件*/
    deleteFile() {
        // create a path you want to delete
        const path = RNFS.MainBundlePath + '/test.txt';

        return RNFS.unlink(path)
            .then(() => {
                console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                console.log(err.message);
            });
    }
}



// import FileManager from 'react-native-filesystem';
//
// const filePath = 'myFilePath/Test.txt';
//
//
// module.exports={
//     /*写入内容到文件*/
//     writeFile(filePath){
//         const obj = {'key':'value'};
//         //  json转字符串
//         FileManager.writeToFile(filePath, JSON.stringify(obj))
//             .then((data)=>{
//                 console.log('写入成功', data); // data 为bool类型   TRUE or FALSE
//             })
//             .catch((data)=>{
//                 console.log('写入失败', data);
//             });
//     },
//     /*读取文件*/
//     readFile(filePath){
//         FileManager.readFile(filePath)
//             .then((data)=>{
//                 //字符串转json
//                 console.log('读取成功', JSON.parse(data)); // data 为 txt 文件里面的内容
//             })
//             .catch((data)=>{
//                 console.log('读取失败', data);
//             });
//     },
//     /*删除文件*/
//     deleteFile(filePath){
//         FileManager.delete(filePath)
//             .then((data)=>{
//                 console.log('删除成功', data); // data 为bool类型   TRUE or FALSE
//             })
//             .catch((data)=>{
//                 console.log('删除失败', data);
//             });
//     },
//     /*是否存在文件*/
//     isExistFile(filePath){
//         FileManager.fileExists(filePath)
//             .then((data)=>{
//                 console.log('是否存在文件', data); // data 为bool类型   TRUE or FALSE
//             })
//             .catch((data)=>{
//                 console.log('是否存在文件失败', data);
//             });
//     },
//     /*返回绝对路径*/
//     absoluteFile(filePath){
//         const absoluteFile = FileManager.absolutePath(filePath);
//         console.log('absoluteFile = ', absoluteFile);
//     }
// }

