import React, { Compnents, Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,Alert } from 'react-native';
import NavBar from '../components/navBar';
import utils from "../utils";
import { Modify } from '../request/requestUrl';
import { fetchPost } from '../request/fetch';
import { LOGIN } from '../store/actionTypes';
import {connect} from 'react-redux';
import {motifyMyInfo} from '../store/actions';

class MineTxtInfo extends Component {

    constructor(props) {
        super(props);
        this.submitInfo = this.submitInfo.bind(this);
        // this.endClick=this.endClick.bind(this);
        this.state = {
            text: "",
            navTitle: "",
            placeholder: "",
        }
    }

    //组件加载完成
    componentDidMount() {
        let placeholder="";
        let navTitle="";
        let text="";
        if( this.props.navigation.state.params.type === "姓名" ){
            placeholder="请输入姓名(1-10个字符)";
            navTitle="编辑姓名";
            text=this.props.logResult.Name?this.props.logResult.Name:"";
        }else if( this.props.navigation.state.params.type === "学籍号" ){
            placeholder="请输入学籍号";
            navTitle="编辑学籍号";
            text=this.props.logResult.NO?this.props.logResult.NO:"";
        }else if( this.props.navigation.state.params.type === "学校" ){
            placeholder="请输入学校";
            navTitle="编辑学校";
            text=this.props.logResult.School?this.props.logResult.School:"";
        }else if( this.props.navigation.state.params.type === "班级" ){
            placeholder="请输入班级名称";
            navTitle="编辑班级名称";
            text=this.props.logResult.Class?this.props.logResult.Class:"";
        }
        this.setState({
            placeholder,
            navTitle,
            text,
        });
    }

    submitInfo() {
        if (this.state.text === "") {
            Alert.alert("",this.state.placeholder);
            return;
        }
        let paramts={};
        if( this.props.navigation.state.params.type === "姓名" ){
            paramts={ Name: this.state.text };
        }else if( this.props.navigation.state.params.type === "学籍号" ){
            paramts={ NO: this.state.text };
        }else if( this.props.navigation.state.params.type === "学校" ){
            paramts={ School: this.state.text };
        }else if( this.props.navigation.state.params.type === "班级" ){
            paramts={ Class: this.state.text };
        }
        this.props.motifyInfo(paramts,(res)=>{
            this.props.navigation.goBack();
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.contain}>
                <NavBar navtitle={this.state.navTitle} isBack={true} navgation={this.props.navigation} />
                {/* <ScroolView> */}
                <View style={styles.txtView}>
                    <TextInput
                        underlineColorAndroid = {'transparent'}
                        style={styles.txtInput}
                        multiline={false}
                        placeholder={this.state.placeholder}
                        // placeholderTextColor={utils.COLORS.theme1}
                        onChangeText={(text) => {
                            if(text.length>10 && this.props.navigation.state.params.type === "姓名" ){
                                this.setState({ text:text.substring(0,10) })
                            }else
                                this.setState({ text })
                        }}
                        value={this.state.text}
                    />
                </View>
                {/* </ScroolView> */}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.submitInfo()}
                >
                    <Text style={styles.buttonText}>{"确定"}</Text>
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



const mapStateToProps = (state) => {
    let logResult=state.userInfo.logResult
    return {
        logResult,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        motifyInfo : (paramts,callBack) => {
            dispatch(motifyMyInfo(paramts,callBack))
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(MineTxtInfo);

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    txtView: {
        marginTop: utils.SCREENRATE*10,
        // padding:10,
        backgroundColor: "#cccccc",
        width: utils.SCREENWIDTH - utils.SCREENRATE*20,
        height: utils.SCREENRATE*50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtInput: {
        margin: 1,
        padding: utils.SCREENRATE*10,
        width: utils.SCREENWIDTH - utils.SCREENRATE*22,
        height: utils.SCREENRATE*48,
        backgroundColor: "#ffffff",
        // lineHeight: 48,
        alignSelf: "center",
        // textAlign:"center",
    },
    button: {
        height: utils.SCREENRATE*45,
        width: utils.SCREENWIDTH * 0.85,
        borderRadius: utils.SCREENRATE*6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        marginTop: utils.SCREENRATE*30,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: utils.SCREENRATE*18
    },
});