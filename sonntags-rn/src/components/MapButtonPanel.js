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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



class MapButtonPanel extends Component {


    renderButtons() {
        var components = this.props.buttons.map((buttonConfig) => {
            return (
                <View 
                    key={buttonConfig.icon}
                        style={{
                        flex: 1, 
                        justifyContent: 'center', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        width: '100%'}}>

                    <TouchableOpacity onPress={buttonConfig.target}>
                        <Icon name={buttonConfig.icon} color='white' style={{}} size={21}/>
                    </TouchableOpacity>
                </View>
            );
        });
        return (components);
    }

    render() {
        let bgColor = this.props.backgroundColor ? this.props.backgroundColor : '#3BB9BD';
        let panelHeight = this.props.buttons.length * 66.0;
        return (
                <View style={{
                    backgroundColor: bgColor, 
                    alignItems: 'center', 
                    flexDirection: 'column',
                    borderRadius: 10,
                    right: 0,
                    marginLeft: 10,
                    paddingRight: 10,
                    top: 0, 
                    height: panelHeight, 
                    width: 60
                }}>
                {this.renderButtons()} 
                </View>
        );
    }

}

export default MapButtonPanel;
