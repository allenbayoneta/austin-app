import { useNavigation } from '@react-navigation/core'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AppStyles from '../constants/AppStyles'
import { auth, database, storage } from '../src/firebase'
import { ref, set, get, uploadString, getDownloadURL} from 'firebase/database'
import logo from '../assets/Au10GIF.png'
import { Platform, Keyboard } from 'react-native';

const AccountPage = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [roleName, setRoleName] = useState('')
    const [userUid, setUserUid] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState(null);
    
    const navigation = useNavigation()

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserUid(user.uid);
            const userRef = ref(database, 'users/' + user.uid);
            get(userRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setFirstName(userData.firstName);
                        setLastName(userData.lastName);
                        setCompanyName(userData.companyName);
                        setRoleName(userData.roleName);
                    }
                })
                .catch((error) => {
                    setError('Error fetching user data');
                    console.log(error.message)
                });
        }
    }, []);

    const handleDetails = async () => {
        try {
            const userRef = ref(database, 'users/' + userUid);

            const updatedUserDetails = {
                firstName,
                lastName,
                companyName,
                roleName,
            };

            await set(userRef, updatedUserDetails);
            navigation.replace('Home');
        } catch (error) {
            setError('Error updating user details');
            console.log(error.message)
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height"           
        onStartShouldSetResponder={() => Keyboard.dismiss()}
      >        
      <Image source={logo} style={styles.mainlogo} />
      <View style={styles.logoContainer}>
    <Text>
        Account Details
    </Text>
</View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={text => setFirstName(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={text => setLastName(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Company"
                    value={companyName}
                    onChangeText={text => setCompanyName(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Role"
                    value={roleName}
                    onChangeText={text => setRoleName(text)}
                    style={styles.input}
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.loginContainer}>
                <TouchableOpacity
                    onPress={handleDetails}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Save Details</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
    )
}

export default AccountPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppStyles.color.background
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
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
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
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    mainlogo: {
        height: 130,
        width: 130,
        borderRadius: 100,
        alignItems: 'baseline',
      },
});
