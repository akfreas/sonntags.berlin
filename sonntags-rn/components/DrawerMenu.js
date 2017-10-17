import React, {Component} from 'react';

import {
    Image,
    Platform,
    Text,
    TouchableOpacity,
    Modal,
    View,
    StyleSheet,
    WebView,
    PropTypes
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import NavWebView from '../screens/NavWebView';
import Share, {ShareSheet, Button} from 'react-native-share';
import { StatusBar } from 'react-native'

import calendarDays from '../assets/images/calendardays.png';
import { 
    closeDrawer,
    setDrawerGesturesEnabled,
} from '../actions'

class DrawerMenu extends Component {


    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            displayedPage: {}
        };
    }

    showPage(title, uri) {
        this.props.setDrawerGesturesEnabled(false);
        this.setState({
            modalVisible: true,
            displayedPage: {
                title: title,
                uri:  uri,
        }});

    }


    addBusinessTapped() {
        this.showPage('Add Business', 'https://goo.gl/forms/XMG8yMHfzU0rZ4qH3')
    }

    aboutTapped() {
        this.showPage('About','https://sonntags.sashimiblade.com/');
    }

    feedbackTapped() {
        this.showPage('Give Feedback', 'https://goo.gl/forms/mBVANkMs4aT4rcEW2');
    }

    shareApp() {
        Share.open({
            title: "Sonntags",
            message: "Sunday shopping.",
            url: "http://sonntags.sashimiblade.com",
            subject: "Check out this app"
        });
    }

    cellComponentDef() {
        return [
            {title: 'Add Business', target: this.addBusinessTapped.bind(this)},
            {title: 'Feedback', target: this.feedbackTapped.bind(this)},
            {title: 'About', target: this.aboutTapped.bind(this)},
            {title: 'Share Sonntags', target: this.shareApp.bind(this)},
        ]
    }

    closeModal() {
        this.setState({modalVisible: false})
        this.props.setDrawerGesturesEnabled(true)
    }

    render() {
        return (
        <View style={{backgroundColor: '#EEA845', flex: 1}}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
            >
              <StatusBar barStyle = "dark-content" hidden = {false}/>
                <NavWebView 
                    uri={this.state.displayedPage.uri}
                    title={this.state.displayedPage.title}
                    rightButtonPressed={() => this.closeModal()}
                />
            </Modal>

                  <StatusBar barStyle = "light-content" hidden = {false}/>
                    <View style={{height: 100, /*overflow: 'hidden'*/}}>
                        <Image source={require('../assets/images/so-icon.png')} style={{
                            left: 0,
                            top: 0,
                            bottom: 0,
                            position: 'absolute',
                            height: '100%',
                            width: 100,
                            resizeMode: 'contain',
                        }}/>
                    </View>
                    <View style={{backgroundColor: 'white', height: 1, width: '100%'}}/>
                    {this.cellComponentDef().map((def) => {
                        return(
                            <TouchableOpacity key={def.title} onPress={def.target}>
                        <View style={{
                            height: 50, 
                            padding: 12,
                            alignSelf: 'stretch'}} key={def.title}>
                            <Text style={{
                                fontFamily: 'Lato-Bold',
                                color: 'white',
                                fontSize: 20
                            }}>{def.title}</Text>
                        </View> 
                    </TouchableOpacity>
                        )
                    })}
                   
            </View>
        )
    }

}



const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (title, uri) => {
            return dispatch(
                NavigationActions.navigate({
                    routeName: 'NavWebView',
                    params: {title: title, uri: uri}
                }));
        },
        closeDrawer: () => {
            return dispatch(closeDrawer());
        },
        setDrawerGesturesEnabled: (enabled) => {
            return dispatch(setDrawerGesturesEnabled(enabled));
        },
    }
}

export default connect(null, mapDispatchToProps)(DrawerMenu);
