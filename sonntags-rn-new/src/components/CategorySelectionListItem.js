import React, {Component} from "react";

import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


var styles = require("../styles");

export default class CategorySelectionListItem extends Component {

    render() {

        let rowStyle = styles.locationListItem;
        let locationListIconContainerStyle = styles.locationListIconContainer;
        let iconColor = this.props.type.textColor ? this.props.type.textColor : styles.constants.primaryColor;
        let textColor = this.props.type.textColor ? this.props.type.textColor : "black";

        if (this.props.type.backgroundColor) {
            rowStyle = [rowStyle, {backgroundColor: this.props.type.backgroundColor}];
        }
        if (this.props.active) {
            locationListIconContainerStyle = [locationListIconContainerStyle, {margin: 10, borderRadius: 100, backgroundColor: styles.constants.secondaryColor}];
            iconColor = styles.constants.secondaryColorNegative;
        }

        return (
            <TouchableOpacity onPress={this.props.categorySelected}>
                <View style={rowStyle}>
                    <View style={locationListIconContainerStyle}>
                        {/* <Icon
                            style={styles.locationListIcon}
                            // name={this.props.type.iconName}
                            size={32}
                            color={iconColor}/>                         */}
                    </View>
                    <View style={styles.locationListTextContainer}>
                        <Text style={[{color: textColor}, styles.locationListText]}>{this.props.type.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}


