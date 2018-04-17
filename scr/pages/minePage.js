import React, { Compnents, Component } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, ScrollView } from 'react-native';
import Login from './loginPage';
import utils from "../utils";
import MineCell from "../components/mineCell";
import { connect } from "react-redux";
import { downFaild, saveDownUrl, saveExamPath, startDown } from "../store/actions";

class MineScreen extends Component {

    constructor(props) {
        super(props)
    }

    getArr() {
        const arr1 = ["修改资料", "消息中心", "安全中心", "我的班级", "版本检查", "意见建议", "退出登录"];
        const arr2 = [require("../imgs/mineIcon/my_icon_bj.png"), require("../imgs/mineIcon/my_icon_xxzx.png"), require("../imgs/mineIcon/my_icon_aqzx.png"), require("../imgs/mineIcon/my_icon_wjrbj.png"), require("../imgs/mineIcon/my_icon_bbjc.png"), require("../imgs/mineIcon/my_icon_yjjy.png"), require("../imgs/mineIcon/my_icon_tc.png")];

        let cellArr = [];
        for (let i = 0; i < arr1.length; i++) {
            let title = arr1[i];
            let imgurl = arr2[i];

            cellArr.push(<MineCell key={i} title={title} imgurl={imgurl} navigation={this.props.navigation} />)
        }
        return cellArr;
    }

    render() {
        let version = (utils.PLATNAME === "IOS") ? utils.version_ios : utils.version_android;
        return (

            <ScrollView>
                <View style={styles.contain}>
                    <ImageBackground
                        source={require("../imgs/mineIcon/my_bg.png")}
                        style={styles.headerImg}
                    >
                        <Text style={styles.navTitle}>我</Text>
                        <View style={styles.headContain}>
                            <Image
                                source={require("../imgs/mineIcon/my_icon_mr_x.png")}
                                style={{ width: 37, height: 55 }}
                            />
                        </View>
                        <Text style={styles.userPhone}>{(this.props.logResult && this.props.logResult !== undefined) ? this.props.logResult.LoginName : ""}</Text>
                    </ImageBackground>

                    <View style={{ marginTop: 15 }}>
                        {
                            this.getArr()
                        }
                    </View>

                    {/* <View style={{ height: 30, flexDirection: "row", alignItems: "center" }}>
                        <Text style={{color:utils.COLORS.theme1}}>{"v 1.0" + version}</Text>
                    </View> */}

                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    let logResult = state.userInfo.logResult
    return {
        logResult,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: utils.COLORS.background1
    },
    headerImg: {
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        width: utils.SCREENWIDTH,
        height: utils.SCREENWIDTH / 750 * 478
    },
    navTitle: {
        marginTop: 30,
        color: "#fff",
        fontSize: 18,
        fontWeight: "900"
    },
    headContain: {
        marginTop: 36,
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fff"
    },
    userPhone: {
        marginTop: 15,
        color: "#fff",
        fontSize: 18,
        fontWeight: "400"
    }
});