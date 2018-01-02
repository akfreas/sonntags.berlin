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

import {create_i18n} from '../utilities';

var I18n = create_i18n();

import calendarDays from '../../assets/images/calendardays.png';
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
        this.showPage(I18n.t('add_business'), 'https://goo.gl/forms/XMG8yMHfzU0rZ4qH3')
    }

    aboutTapped() {
        this.showPage(I18n.t('about'),'https://sonntags.sashimiblade.com/');
    }

    feedbackTapped() {
        this.showPage(I18n.t('give_feedback'), 'https://goo.gl/forms/mBVANkMs4aT4rcEW2');
    }

    shareApp() {
        Share.open({
            title: "Sonntags",
            message: I18n.t('share_message'),
            url: "http://sonntags.sashimiblade.com",
            subject: I18n.t('share_subject'),
        });
    }

    cellComponentDef() {
        return [
            {title: I18n.t('add_business'), target: this.addBusinessTapped.bind(this)},
            {title: I18n.t('give_feedback'), target: this.feedbackTapped.bind(this)},
            {title: I18n.t('about'), target: this.aboutTapped.bind(this)},
            {title: I18n.t('share'), target: this.shareApp.bind(this)},
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
                onRequestClose={() => {}}
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
                        <Image source={require('../../assets/images/so-icon.png')} style={{
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