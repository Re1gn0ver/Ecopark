import React from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";

// custom components

import { StackScreenProps } from "@react-navigation/stack";
import CardSection from "../../components/Cards/CardSection";
import { colors } from "../../components/colors";
import { Container } from "../../components/shared";
import { RootStackParamList } from "../../navigators/RootStack";

const MainContainer = styled(Container)`
  background-color: ${colors.lightgrey};
  width: 100%;
  flex: 1;
`;

const cardData = [
  {
    id: 1,
    title: "Card 1",
    logo: require("../../assets/images/logo.png"),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: "₫100",
  }
];

type Props = StackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: Props) => {
  return (
    <MainContainer>
      <StatusBar style="dark" />
      <CardSection data={cardData} />
    </MainContainer>
  );
};

export default Home;