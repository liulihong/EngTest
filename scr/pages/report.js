import React, { Compnents, Component } from 'react';
import { View, Text, StyleSheet, TextInput,TouchableOpacity,Alert } from 'react-native';
import NavBar from '../components/navBar';
import utils from "../utils";
import { Report as report } from '../request/requestUrl';
import { fetchPost } from '../request/fetch';

export default class Report extends Component {

    constructor(props) {
        super(props);
        this.submitReport=this.submitReport.bind(this);
        // this.endClick=this.endClick.bind(this);
        this.state = {
            text: "",
        }
    }

    submitReport(){
        if(this.state.text===""){
            Alert.alert("","您还没有输入哦！");
            return;
        }
        let paramts={
            Content:this.state.text,
            UserID:this.props.navigation.state.params.UserID
        };
        fetchPost(report,paramts).then((result)=>{
            if(result.success===true){
                Alert.alert("","意见已提交,你还可以继续提交哦!");
                this.setState({text:"",});
            }else{
                Alert.alert("",utils.findErrorInfo(result));
            }
            
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.contain}>
                <NavBar navtitle="意见建议" isBack={true} navgation={this.props.navigation} />
                <View style={styles.txtView}>
                    <TextInput
                        style={styles.txtInput}
                        multiline={true}
                        numberOfLines={10}
                        placeholder={"赶紧提出意见吧，我们会更加完美的"}
                        placeholderTextColor={utils.COLORS.theme1}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>this.submitReport()}
                >
                    <Text style={styles.buttonText}>{"提交"}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // // 控制跳转
    // endClick() {
    //     const { navigate } = this.props.navigation;
    //     navigate('HomePage')
    // }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    txtView: {
        marginTop: 10,
        // padding:10,
        backgroundColor:"#cccccc",
        width: utils.SCREENWIDTH-20,
        height: 200,
    },
    txtInput: {
        margin: 1,
        padding:10,
        width: utils.SCREENWIDTH-22,
        height: 198,
        backgroundColor: "#ffffff",
    },
    button: {
        height: 45,
        width: utils.SCREENWIDTH*0.85,
        borderRadius: 6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        marginTop: 30,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },
});