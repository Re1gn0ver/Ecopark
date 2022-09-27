import React from 'react'
import Background from '../../components/Auth/Background'
import Logo from '../../components/Auth/Logo'
import Header from '../../components/Auth/Header'
import Paragraph from '../../components/Auth/Paragraph'
import Button from '../../components/Auth/Button'

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph>
        Your amazing app starts here. Open you favorite code editor and start
        editing this project.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>
  )
}
