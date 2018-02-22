import React,{Component} from 'react';
import {View,Text,Button,StyleSheet} from 'react-native';
import utils from '../utils';
import download from '../utils/download';

export default class VideoCard extends Component{

    downLoad(){
        download.download();
    }

    render(){
        return(
            <View style={styles1.contain1}>
                <Text>上次得分：4.5</Text>
                <Text>模拟试题1</Text>
                <Button title="下载" onPress={() => this.downLoad()} />
            </View>
        )
    }
}

const styles1=StyleSheet.create({
    contain1:{
        // flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'powderblue',
        width: '30%',
        height:utils.SCREENWIDTH*0.4,
        margin:utils.SCREENWIDTH*0.01
    }
});