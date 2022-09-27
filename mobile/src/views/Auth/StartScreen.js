import React from 'react'
import Background from '../../components/Auth/Background'
import Logo from '../../components/Auth/Logo'
import Header from '../../components/Auth/Header'
import Button from '../../components/Auth/Button'
import Paragraph from '../../components/Auth/Paragraph'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  )
}
