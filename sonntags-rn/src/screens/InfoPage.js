import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Linking
} from 'react-native';
import {create_i18n} from '../utilities';
import styles from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const fontStyle = {fontFamily: 'lato-regular', fontSize: 14, color: styles.constants.primaryColor};
var I18n = create_i18n();


export default class InfoPage extends Component {
    static navigationOptions = {
        title: I18n.t('about_screen_title')
    };


    openEmail = () => {
        Linking.openURL('mailto:alex@sashimiblade.com');
    }
 
    render() {
        return (
            <ScrollView style={{height: '100%', width: '100%'}} bounces={false} showScrollBars={false}>
                <View style={{backgroundColor: styles.constants.primaryColorNegative, flex: 1, flexDirection: 'column'}}>
                    <View style={{backgroundColor: styles.constants.primaryColor, flex: 1}}>
                        <Text style={{fontFamily: 'lato-bold', fontSize: 38, color: styles.constants.primaryColorNegative, padding: 10}}>
                            Be lazy.
                            Procrastinate. 
                            Support your local shops.
                        </Text>
                    </View>
                    <View style={{flexDirection: 'column', flex: 1}}>
                        <Text style={{fontFamily: 'lato-regular', fontSize: 28, color: styles.constants.primaryColor, padding: 10}}>
                            {
`Things happen spontaneously.
Shopping should be one of those things.`} 
                        </Text>
                        <Text style={{fontFamily: 'lato-regular', fontSize: 18, color: styles.constants.primaryColor, padding: 10}}>
                            That's why I made this app.
                        </Text>

                        <View style={{flex: 1}}>
                            <Image source={require('../../assets/images/painted_me.png')} style={{top: 0}}/>
                            <View style={{
                                backgroundColor: styles.constants.secondaryColor + 'CC', 
                                top: 400, 
                                height: 80, 
                                width: '100%', 
                                position: 'absolute', 
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{fontFamily: 'lato-bold', fontSize: 34, color: styles.constants.secondaryColorNegative}}>
                                    Alex Freas
                                </Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'center',  flex: 1, backgroundColor: styles.constants.primaryColor}}>
                            <Text style={{textAlign: 'center', fontFamily: 'lato-regular', color: styles.constants.primaryColorNegative, fontSize: 24, padding: 10}}>
                                Interested in hiring me for your project?
                            </Text>
                            <TouchableOpacity onPress={this.openEmail}>
                            <View style={{padding: 10, 
                                alignItems: 'center', 
                                borderRadius: 10, 
                                marginTop: 10, 
                                marginBottom: 10, 
                                marginRight: '15%', 
                                marginLeft: '15%', 
                                borderColor: styles.constants.primaryColorNegative,
                                borderWidth: 2.0
                            }}>
                                <Text style={{fontFamily: 'lato-bold', fontSize: 24, color: styles.constants.secondaryColorNegative}}>
                                    <Icon name={'email-outline'} size={24}/>
                                    {' '} Let's Talk.
                                </Text>
                            </View>
                            </TouchableOpacity>


                        </View>

                        <Text style={{fontFamily: 'lato-regular', fontSize: 18, color: styles.constants.primaryColor, padding: 10}}>
                            Some technical details...
                        </Text>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon style={[styles.locationGridIcon, {color: '#2DD1FC'}]}
                                    name={'react'}
                                    size={60}
                                />
                            </View>
                            <View style={{flex: 2, padding: 20}}>
                                <Text style={fontStyle}>
                                    Sonntags is built entirely using React Native.
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <View style={{flex: 2, padding: 20}}>
                                <Text style={[fontStyle]}>
                                    Hosting is provided by Contentful.
                                </Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Image source={require('../../assets/images/contentful-logo.png')} style={{width: 60, height: 60}}/>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 5}}>
                                <Image source={require('../../assets/images/mapbox-logo.png')} style={{resizeMode: 'contain', width: 100, height: 60,flex: 1}}/>
                            </View>
                            <View style={{flex: 2, padding: 20}}>
                                <Text style={[fontStyle]}>
                                    Map content provided by Mapbox.
                                </Text>
                            </View>
                        </View>


                    </View>


                </View>
            </ScrollView>
        );
    }
}
