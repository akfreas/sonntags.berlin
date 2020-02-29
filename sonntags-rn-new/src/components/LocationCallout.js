import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View
} from "react-native";
import moment from "moment";


const propTypes = {
    children: PropTypes.node.isRequired
};

export default class LocationCallout extends Component {
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.bubble}>
                    <View style={styles.amount}>
                        {this.props.children}
                    </View>
                </View>
                <View style={styles.arrowBorder}/>
                <View style={styles.arrow}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "flex-start",
      backgroundColor: "red",
  },
  bubble: {
    width: 140,
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    borderColor: "#007a87",
    borderWidth: 0.5,
  },
  amount: {
    flex: 1,
  },
  arrow: {
    backgroundColor: "transparent",
    borderWidth: 16,
    borderColor: "transparent",
    borderTopColor: "#ffffff",
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderWidth: 16,
    borderColor: "transparent",
    borderTopColor: "#007a87",
    alignSelf: "center",
    marginTop: -0.5,
  },
});
