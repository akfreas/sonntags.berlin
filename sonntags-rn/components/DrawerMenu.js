import React, {Component} from 'react';

import {
    Image,
    Button,
    Platform,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    WebView,
    PropTypes
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import calendarDays from '../assets/images/calendardays.png';

class DrawerMenu extends Component {

    addBusinessTapped() {
        this.props.navigate('Add Business','https://goo.gl/forms/XMG8yMHfzU0rZ4qH3');
    }

    aboutTapped() {
        this.props.navigate('About','https://sonntags.sashimiblade.com/');
    }

    feedbackTapped() {
        this.props.navigate('Give Feedback', 'https://goo.gl/forms/mBVANkMs4aT4rcEW2');
    }

    cellComponentDef() {
        return [
            {title: 'Add Business', target: this.addBusinessTapped.bind(this)},
            {title: 'Feedback', target: this.feedbackTapped.bind(this)},
            {title: 'About', target: this.aboutTapped.bind(this)},
        ]
    }

    render() {
        return (
            <View style={{backgroundColor: '#EEA845', flex: 1}}>
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
            return dispatch(NavigationActions.navigate({routeName: 'NavWebView'}));
        }
    }
}

export default connect(null, mapDispatchToProps)(DrawerMenu);
