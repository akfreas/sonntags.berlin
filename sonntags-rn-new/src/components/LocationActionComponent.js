import React, {Component, PropTypes} from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


var styles = StyleSheet.create({
    shareAction: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    shareIcon: {
    },
});

export default class LocationActionComponent extends Component {


    actionIcon(iconName, action) {
        return (

                <View style={styles.shareAction}>
            <TouchableOpacity onPress={() => action()}>
                    <Icon
                        name={iconName}
                        size={32}
                    />
            </TouchableOpacity>

                </View>
        )

    }

    render() {
        return (
            <View style={{height: 44, flexDirection: "row"}}>
                {this.props.googleMapsAction && this.actionIcon("google-maps", this.props.googleMapsAction)}
                {this.props.shareAction && this.actionIcon("share-variant", this.props.shareAction)}
                {this.props.reviewAction && this.actionIcon("pencil", this.props.reviewAction)}
                {this.props.blockAction && this.actionIcon("block-helper", this.props.blockAction)}
            </View>

        )
    }

}
