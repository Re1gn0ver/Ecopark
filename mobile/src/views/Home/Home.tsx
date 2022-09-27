import React, { FunctionComponent } from 'react';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { Container } from '../../components/shared';
import { colors } from '../../components/colors';
import { Text } from 'react-native';

const HomeContainer = styled(Container)`
    background-color: ${colors.green};
    width: 100%; 
    flex: 1;
`;

const Home: FunctionComponent = () => {
    return (
        <HomeContainer>
            <StatusBar style='dark' />
            <Text>Home</Text>
        </HomeContainer>
    )
}

export default Home;


