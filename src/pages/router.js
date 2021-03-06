import React, { Component } from "react";
import { Image, DeviceEventEmitter, View, Text, Platform, BackHandler } from "react-native";
import TabBarItem from '../components/tabItem';
import HomePage from "./homePage";
import TaskPage from "./taskPage"
import MinePage from "./minePage";
import { StackNavigator, TabBarBottom, TabNavigator } from "react-navigation";
import Login from './loginPage';
import utils from '../utils';
import TestStart from "./testStart";
// import VideoTest from "./videoTest";
import VideoTest from "./examDoing";
import AnswerScreen from "./answerPage";
import Regist from './RegistPage';
import AnsweredDetail from './AnsweredDetail';
import WebViewScreen from "./protocalPage";
import JoinClass from "./JoinClass";
import Report from "./report";
import MineInfo from "./mofifyMineInfo";
import MineTxtInfo from "./motifyTxtInfo";
import PwdScreen from "./forgetPwdPage";
import { connect } from "react-redux";


let loadtimeInterval;
// let routeName;


class MainRoute extends Component {
    constructor() {
        super()
        this.changeNavigation = this.changeNavigation.bind();
        // this.onBackAndroid = this.onBackAndroid.bind();
        this.state = {
            // isloading: false,
            loadtxt: "正在加载共用音频",
        }
    }

    // componentWillMount() {
    //     if (Platform.OS === 'android') {
    //         BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    // }
    // onBackAndroid = () => {
    //     if (this.routeName === "HomePage" || this.routeName === "Login") {
    //         if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
    //             BackHandler.exitApp();
    //             return false;
    //         }
    //         this.lastBackPressed = Date.now();
    //         return true;
    //     }
    // };
    //组件卸载 播放停止
    // componentWillUnmount() {
    //     if (Platform.OS === 'android') {
    //         BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    // }

    componentDidMount() {
        // routeName = (this.props.isLogin === true) ? "HomePage" : "Login";
        DeviceEventEmitter.addListener('startDownloadSound', () => {
            clearInterval(loadtimeInterval);
            this.setState({
                isloading: true,
            });

            loadtimeInterval = setInterval(() => {
                this.setState({
                    loadtxt: "正在下载共用音频 " + (this.props.downLoadInfo ? this.props.downLoadInfo.progress : "0%"),
                });
            }, 100)
        })
        DeviceEventEmitter.addListener('endDownloadSound', () => {
            this.setState({
                isloading: false,
            });
            clearInterval(loadtimeInterval);
        })
    }

    changeNavigation(type, prevState, currenState) {
        // alert("更新路由");
        let routes = currenState.routes;
        //查找当前最上层页面路由
        let currRoute = routes[routes.length - 1];
        //上次路由最上层
        let lastRoute = prevState.routes[prevState.routes.length-1];
        // this.routeName = currRoute.routeName;
        if (currRoute.routeName === "HomePage" && currRoute.index === 0) {
            DeviceEventEmitter.emit('reloadVideoList',{isCheck:false});
        } else if (currRoute.routeName === "HomePage" && currRoute.index === 1) {
            DeviceEventEmitter.emit('reloadHomework');
        } else if(currRoute.routeName==="AnswerScreen"&&lastRoute.routeName==="AnsweredDetail"){
            DeviceEventEmitter.emit('reloadAnswerDetail');
        }
    }


    render() {
        return (
            [
                (this.props.isLogin === true) ?
                    <Navigator key={1} onNavigationStateChange={(prevState, currenState) => { this.changeNavigation(1, prevState, currenState) }} /> :
                    <LogRouter key={1} onNavigationStateChange={(prevState, currenState) => { this.changeNavigation(2, prevState, currenState) }} />,

                (this.state.isloading === true) ? <View key={2} style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    position: "absolute",
                    width: utils.SCREENWIDTH,
                    height: utils.SCREENHEIGHT,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text style={{
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: "500",
                    }}>{this.state.loadtxt}</Text>
                </View> : <View key={2} />

            ]
        )
    }
}

const mapStateToProps = (state) => {
    const downLoadInfo = state.videoList.downLoadInfo;
    return {
        downLoadInfo,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainRoute);


//多个选项卡
export const Tab = TabNavigator(
    {
        Home: {
            //对应的屏幕
            screen: HomePage,
            //用于屏幕的默认导航选项
            navigationOptions: (paramts) => ({
                //选项卡名称
                // tabBarLabel: '首页',
                header: null,
                title: '练习',
                //选项卡图标 focused：是否选中 tintColor：选中颜色
                tabBarIcon: ({ focused, tintColor }) => (
                    //自定义组件展示图标
                    <TabBarItem
                        slectIndex={1}
                        tintColor={tintColor}
                        focused={focused}
                        selectedImage={require("../imgs/tabIcon/icon_lx_click.png")}
                        normalImage={require("../imgs/tabIcon/icon_lx.png")}
                    />
                )
            })
        },
        Task: {
            //对应的屏幕
            screen: TaskPage,
            //用于屏幕的默认导航选项
            navigationOptions: ({ navigation }) => ({
                //选项卡名称
                // tabBarLabel: '首页',
                header: null,
                title: '作业',
                //选项卡图标 focused：是否选中 tintColor：选中颜色
                tabBarIcon: ({ focused, tintColor }) => (
                    //自定义组件展示图标
                    <TabBarItem
                        slectIndex={2}
                        tintColor={tintColor}
                        focused={focused}
                        selectedImage={require("../imgs/tabIcon/icon_zy_click.png")}
                        normalImage={require("../imgs/tabIcon/icon_zy.png")}
                    />
                )
            })
        },
        MyCenter: {
            //对应的屏幕
            screen: MinePage,
            //用于屏幕的默认导航选项
            navigationOptions: ({ navigation }) => ({
                //选项卡名称
                // tabBarLabel: '我的',
                header: null,
                title: '我',
                //选项卡图标 focused：是否选中 tintColor：选中颜色
                tabBarIcon: ({ focused, tintColor }) => (
                    //自定义组件展示图标
                    <TabBarItem
                        slectIndex={3}
                        tintColor={tintColor}
                        focused={focused}
                        selectedImage={require("../imgs/tabIcon/icon_my_click.png")}
                        normalImage={require("../imgs/tabIcon/icon_my.png")}
                    />
                )
            })
        },
    },
    //TabNavigatorConfig
    {
        tabBarComponent: TabBarBottom,//用作标签栏的组件（这是iOS上的默认设置），（这是Android上的默认设置）TabBarBottomTabBarTop
        tabBarPosition: 'bottom',//标签栏的位置可以是或'top''bottom'
        swipeEnabled: true,//是否允许在标签之间进行滑动
        animationEnabled: true,//是否在更改标签时动画
        lazy: true,//是否根据需要懒惰呈现标签，而不是提前制作
        tabBarOptions: {
            //ios
            activeTintColor: utils.COLORS.theme,//活动标签的标签和图标颜色
            activeBackgroundColor: utils.COLORS.background,//活动选项卡的背景颜色
            inactiveTintColor: utils.COLORS.theme1,//非活动标签的标签和图标颜色
            inactiveBackgroundColor: utils.COLORS.background,//非活动标签的背景颜色
            showLabel: true,//是否显示标签的标签，默认为true
            //style: {backgroundColor: 'blue',},//标签栏的样式对象
            labelStyle: { fontSize: 10, },//标签标签的样式对象
            tabStyle: { width: 100, },//标签栏的样式对象
            //android
            scrollEnabled: true,//是否启用可滚动选项卡

        },
    }
);


const Navigator = StackNavigator(
    {
        HomePage: {
            screen: Tab,
            //屏幕导航选项
            // navigationOptions: {
            // 	//设置隐藏标题。HeaderProps null
            //    header: null
            // },
            cardStyle: {
                backgroundColor: utils.COLORS.background,
            },
        },
        TestStart: {
            screen: TestStart,
            navigationOptions: {
                header: null,
            }
        },
        VideoTest: {
            screen: VideoTest,
            navigationOptions: {
                header: null,
            }
        },
        AnswerScreen: {
            screen: AnswerScreen,
            navigationOptions: {
                header: null,
            }
        },
        Regist: {
            screen: Regist,
            navigationOptions: {
                //设置隐藏标题。HeaderProps null
                header: null,
            },
        },
        AnsweredDetail: {
            screen: AnsweredDetail,
            navigationOptions: {
                //设置隐藏标题。HeaderProps null
                header: null,
            },
        },
        JoinClass: {
            screen: JoinClass,
            navigationOptions: {
                header: null,
            }
        },
        Report: {
            screen: Report,
            navigationOptions: {
                header: null,
            }
        },
        MineInfo: {
            screen: MineInfo,
            navigationOptions: {
                header: null,
            }
        },
        MineTxtInfo: {
            screen: MineTxtInfo,
            navigationOptions: {
                header: null,
            }
        },
        PwdScreen: {
            screen: PwdScreen,
            navigationOptions: {
                header: null,
            }
        },
    }
);

const LogRouter = StackNavigator(
    {
        Login: {
            screen: Login,
            navigationOptions: {
                //设置隐藏标题。HeaderProps null
                header: null,
                //禁止滑动返回
                gesturesEnabled: false,
            },
        },
        Regist: {
            screen: Regist,
            navigationOptions: {
                //设置隐藏标题。HeaderProps null
                header: null,
            },
        },
        PwdScreen: {
            screen: PwdScreen,
            navigationOptions: {
                header: null,
            }
        },
        WebViewScreen: {
            screen: WebViewScreen,
            navigationOptions: {
                header: null,
            }
        },
    },
);
