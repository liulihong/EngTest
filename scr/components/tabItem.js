import React, {Component} from "react";
import {Image,DeviceEventEmitter} from "react-native";

export default class TabBarItem extends Component {
    render() {
        
        let showImage = this.props.focused ? this.props.selectedImage : this.props.normalImage;
        if(this.props.focused){
            if(this.props.slectIndex===1){
                DeviceEventEmitter.emit('reloadVideoList');
            }else if(this.props.slectIndex===2){
                DeviceEventEmitter.emit('reloadHomework');
            }
        }
        return (
            <Image
                source={showImage}
                style={{ width: 22, height: 24}}
                // style={{tintColor: this.props.tintColor, width: 20, height: 24}}
            />
        );
    }
}