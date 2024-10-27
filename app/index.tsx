import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
    GoogleSigninButton
  } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';


const index = () => {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    GoogleSignin.configure({
    webClientId: '750548797583-8oj6srrg71vqugjovck2elr95s6p5ipd.apps.googleusercontent.com',
    });

  // Somewhere in your code
  const signIn = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token\
      const response = await GoogleSignin.signIn();

      console.log('response', response);

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(response.data?.idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
    };

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if (!user) {
        return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signIn}
            />
        </SafeAreaView>
        )
  } 

  const navigation = useNavigation();
    return (
        <View style={{justifyContent:'center', flex: 1, alignItems: 'center'}}>
        <Text>Welcome {user.email}</Text>
        <TouchableOpacity onPress={() => auth().signOut()}>
            <Text>Sign-out</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('two')}>
            <Text>Go to Another Tab</Text>
        </TouchableOpacity>

        </View>
    );

}

export default index