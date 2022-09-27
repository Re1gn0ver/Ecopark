import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { StatusBar } from 'expo-status-bar';
import { Container } from '../../components/shared';
import { colors } from '../../components/colors';
import Svg, { Path } from 'react-native-svg';
import BigText from '../../components/Texts/BigText';
import RegularText from '../../components/Texts/RegularText';
import SmallText from '../../components/Texts/SmallText';
import RegularButton from '../../components/Buttons/RegularButton';


const WelcomeContainer = styled(Container)`
    background-color: ${colors.green};
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const TopSection = styled.View`
    flex: 1;
    width: 100%;
    max-height: 55%;
`;

const TopImage = styled.Image`
    margin-top: 80px;
    width: 60%;
    height: 100%;
    resizeMode: contain;
    align-self: center;
`;

const BottomSection = styled.View`
    flex: 1;
    width: 100%;
    padding: 25px;
    justify-content: flex-end;
`;

const Welcome: FunctionComponent = () => {
    return (
        <>
            <StatusBar style="light" />
            <WelcomeContainer>
                <TopSection>
                    <TopImage source={require('../../../assets/ecopark-icon.png')} />
                </TopSection>
                <BottomSection>
                    <BigText textStyles={{ width: "70%", marginBottom: 25 }}>
                        Rent bike{"\n"}and have nice{"\n"}experience{"\n"}in Ecopark
                    </BigText>
                    <RegularText textStyles={{ marginBottom: 25 }}>
                        It never gets easier, you just go faster
                    </RegularText>
                    {/* <RegularButton textStyles={{ width: "70%" }}>Get Started</RegularButton> */}
                </BottomSection>
            </WelcomeContainer>
        </>
    );
}



export default Welcome;