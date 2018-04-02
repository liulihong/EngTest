import NavBar from '../components/navBar';
import utils from "../utils";
import { protocal } from "../request/requestUrl"

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
    WebView
} = ReactNative;

var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';

var TEXT_INPUT_REF = 'urlInput';
var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://m.facebook.com';

export default class WebViewPage extends React.Component {

    constructor() {
        super();
        this.state = {
            url: DEFAULT_URL,
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true,
          };
    }

    inputText = '';

  handleTextInputChange = (event) => {
    var url = event.nativeEvent.text;
    if (!/^[a-zA-Z-_]+:/.test(url)) {
      url = 'http://' + url;
    }
    this.inputText = url;
  };

    render() {
        return (
            <View style={styles.contain}>
                <NavBar navtitle="用户协议" isBack={true} navgation={this.props.navigation} />
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{ uri: protocal}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                />
            </View>
        );
    }

    goForward = () => {
        this.refs[WEBVIEW_REF].goForward();
      };
    
      reload = () => {
        this.refs[WEBVIEW_REF].reload();
      };
    
      onShouldStartLoadWithRequest = (event) => {
        // Implement any custom loading logic here, don't forget to return!
        return true;
      };
    
      onNavigationStateChange = (navState) => {
        this.setState({
          backButtonEnabled: navState.canGoBack,
          forwardButtonEnabled: navState.canGoForward,
          url: navState.url,
          status: navState.title,
          loading: navState.loading,
          scalesPageToFit: true
        });
      };
    
      onSubmitEditing = (event) => {
        this.pressGoButton();
      };
    
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    webView: {
        width:utils.SCREENWIDTH,
        // height:100,
        // backgroundColor:"red",
    },
});