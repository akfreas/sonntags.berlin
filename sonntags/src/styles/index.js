const React = require("react-native")
const constants = {
    actionColor: "#24CE84",
    primaryColor: "#FFFFFF",
    primaryColorNegative: "#000000",
    secondaryColor: "#EEA845",
    secondaryColorNegative: "#000000",
};

import {
  StyleSheet
} from "react-native";


var styles = StyleSheet.create({
    headerTitleStyle: {
        color: "black",
        fontFamily: "AGaramondPro-Regular",
        fontSize: 24

    },
    categoryTable: {

        backgroundColor: "#fff",
    },
    categoryListItemDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "rgb(233, 238, 255)",
    }, 
    locationListList: {
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    locationListItem: {
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "row",
        marginBottom: 1,
        height: 65,
    },
    locationListIcon: {
        padding: 0,

    },
    locationListIconContainer: {
        flex: 0.25,
        justifyContent: "center",
        alignItems: "center",
    },
    locationListTextContainer: {
        flex: 1.0,
        justifyContent: "center",
        alignItems: "flex-start",
    }, 
    locationListText: {
        textAlign: "center",
        marginLeft: 10,
        marginRight: 10,
        fontFamily: "AGaramondPro-Bold",
        fontSize: 20
    },
    locationList: {
        justifyContent: "center",
    },
    locationListItem: {
        padding: 10.0,
        height: 90.0,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white"
    },
    locationListItemDistanceContainer: {
        flex: 0.4,
        justifyContent: "center",
        alignItems: "center"
    },
    locationListItemTitleContainer: {
        flex: 1.0,
        //justifyContent: "start",
        alignItems: "flex-start",
    },
    locationSummaryViewDescriptionTitle: {
        fontFamily: "AGaramondPro-Regular",
    },
    locationSummaryViewDistanceText: {
        fontFamily: "AGaramondPro-Italic",
    },
    locationListItemTitleText: {

        fontFamily: "AGaramondPro-Bold",
        fontSize: 18
    },
    locationSummaryViewDescriptionText: {
        fontFamily: "AGaramondPro-Regular",
    },
    locationSummaryViewTitle: {
        fontFamily: "AGaramondPro-Italic",
         fontSize: 38
    }
})

module.exports = styles
module.exports.constants = constants;
