import React, {Component} from "react";
import {Image,DeviceEventEmitter} from "react-native";


export default class TabBarItem extends Component {

    render() {
        
        let showImage = this.props.focused ? this.props.selectedImage : this.props.normalImage;
        
        return (
            <Image
                source={showImage}
                style={{ width: 22, height: 24}}
                // style={{tintColor: this.props.tintColor, width: 20, height: 24}}
            />
        );
    }
}