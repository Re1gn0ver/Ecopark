
import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
function ProfileOption({ title, icon, onPress }) {
    return <TouchableOpacity style={[styles.row, {
        borderBottomColor: "white",
        borderBottomWidth: 1,
        width: "100%",
        padding: 10,
        alignContent: "flex-start",
        alignItems: "center",
        justifyContent: "flex-start",
    }]}
        activeOpacity={0.3}
        onPress={onPress}
    >
        <Image
            style={{
                height: 30,
                width: 30,
                resizeMode: "contain"
            }}
            source={icon}
        />
        <View style={[styles.row, {
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
        }]}>
            <Text style={{
                fontFamily: "Quicksand-Bold",
                fontSize: 18,
                marginLeft: 10,
                color: "black",
            }}>
                {title}
            </Text>
            <Image
                style={{
                    height: 30,
                    width: 30,
                    resizeMode: "contain"
                }}
                source={require("../../../shared/img/profile-arrow.png")}
            />
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    row: {
        display: "flex",
        flexDirection: "row",
    },
    column: {
        display: "flex",
        flexDirection: "column",
    }
})

export default ProfileOption