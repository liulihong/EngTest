import React, { Compnents, Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import NavBar from '../components/navBar';
import utils from "../utils";
import { Modify } from '../request/requestUrl';
import { fetchPost } from '../request/fetch';
import { LOGIN } from '../store/actionTypes';
import {connect} from 'react-redux';
import {motifyMyInfo} from '../store/actions';



class MineInfo extends Component {

    constructor(props) {
        super(props);
        this.submitInfo = this.submitInfo.bind(this);
        // this.endClick=this.endClick.bind(this);
        this.state = {
            text: "",
        }
    }

    //组件加载完成
    componentDidMount() {
        this.setState({
            text:this.props.navigation.state.params.Name,
        });
    }

    submitInfo() {
        if (this.state.text === "") {
            alert("您为输入姓名哦！");
            return;
        }
        this.props.motifyInfo({ Name: this.state.text },()=>{
            alert("恭喜，修改成功！");
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.contain}>
                <NavBar navtitle="编辑姓名" isBack={true} navgation={this.props.navigation} />
                <View style={styles.txtView}>
                    <TextInput
                        style={styles.txtInput}
                        multiline={true}
                        numberOfLines={4}
                        placeholder={"请输入姓名"}
                        placeholderTextColor={utils.COLORS.theme1}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />
                </View>

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

export default connect(mapStateToProps,mapDispatchToProps)(MineInfo);

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
        backgroundColor: "#cccccc",
        width: utils.SCREENWIDTH - 20,
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtInput: {
        margin: 1,
        padding: 10,
        width: utils.SCREENWIDTH - 22,
        height: 48,
        backgroundColor: "#ffffff",
        lineHeight: 48,
        alignSelf: "center",
    },
    button: {
        height: 45,
        width: utils.SCREENWIDTH * 0.85,
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