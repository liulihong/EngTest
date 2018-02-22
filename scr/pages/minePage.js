import React,{ Compnents, Component } from 'react';
import { View ,Text, StyleSheet,Button } from 'react-native';
import Login from './loginPage';

export default class HomeScreen extends Component{

    constructor(props){
        super(props)
    }
    render() {
        return (
             
                <View>
                    <Text>This is home</Text>
                    <Button 
                        title='To Detail'
                        onPress={()=>this.props.navigation.navigate('Login')}
                    />
                    <Text>This is home</Text>
                </View>
        );
    }
}

const styles=StyleSheet.create({
    contain: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
});