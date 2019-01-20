import React, {Component} from "react";

import {
    Image,
    Linking,
    Button,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Row,
    ListView
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default class HamburgerBars extends Component {
    render() {
        return(
            <TouchableOpacity 
                        onPress={this.props.onPress}
                        style={{padding: 7}}
                    >

                       <FontAwesome name={"bars"}
                           size={32}
                           style={{height: 44, width: 44}}
                       style={{color: "white"}}/>
            </TouchableOpacity>
        );
    }
}
