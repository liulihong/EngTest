import React,{ Compnents, Component } from 'react';
import { View ,Text, StyleSheet ,Image } from 'react-native';
import Login from '../components/login';
import { StackNavigator } from 'react-navigation';
import Route from  './router'

export default class HomeScreen extends Component{

    constructor(props){
        super(props);
        // this.endClick=this.endClick.bind(this);
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.contain}>
                {/*<Text style={{fontSize:30}}>英语听说考</Text>*/}
                {/*<Image*/}
                    {/*style={{width:'80%',height:200,marginTop:10}}*/}
                    {/*source={require('../imgs/web1.png')}*/}
                {/*/>*/}
                {/*<Login nextClick={() => {this.endClick()}}/>*/}
                {/*<Login {...this.props}/>*/}
                <Login navigation={this.props.navigation} />
            </View>
        );
    }

    // // 控制跳转
    // endClick() {
    //     const { navigate } = this.props.navigation;
    //     navigate('HomePage')
    // }
}

const styles=StyleSheet.create({
    contain: {
        // flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
});