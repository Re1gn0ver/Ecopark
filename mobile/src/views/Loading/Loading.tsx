import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
const Loading = () => {
    return (
        <View style={LoadingScreenStyles.backgroundCenter}>
            <Image
                style={LoadingScreenStyles.ecoIcon}
                source={require('../../../assets/logo-ecopark.png')} />
                <View style={{flex:0.05}}></View>
            <ActivityIndicator size="large" color="#71bf45" />
        </View>
    );
}

const LoadingScreenStyles = StyleSheet.create({
    backgroundCenter: {
        flexDirection: "column",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "fff",
    },
    ecoIcon: {
        width: 160,
        height: "auto",
        aspectRatio: 1.5,
        resizeMode: "contain",
    }
});

export default Loading;