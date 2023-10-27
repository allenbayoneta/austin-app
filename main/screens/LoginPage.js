import { useNavigation } from '@react-navigation/core';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import AppStyles from '../constants/AppStyles';
import { auth } from '../src/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // State for login error
  const navigation = useNavigation();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        navigation.replace("Home");
      })
      .catch(error => {
        setLoginError("Email and Password don't match"); // Set the login error message
        setPassword('');
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.logoContainer}>
        <Text>
          A.U.S.T.I.N.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
          onKeyPress={handleKeyPress}
        />
        {loginError && (
          <Text style={styles.errorText}>{loginError}</Text>
        )}
      </View>

      <View style={styles.loginContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registerContainer}>
        <Text style={styles.text}>Not registered yet?</Text>
        <TouchableOpacity
          onPress={() => navigation.replace("Register")}
        >
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStyles.color.background,
  },
  logoContainer: {
    padding: 30,
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: AppStyles.color.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 11,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    paddingLeft: 10,
  },
  loginContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    backgroundColor: AppStyles.color.accent,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    marginRight: 5,
  },
  registerContainer: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
  },
  registerText: {
    color: AppStyles.color.accent,
    fontWeight: '700',
    fontSize: 14,
  },
});
