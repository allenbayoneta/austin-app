import { useNavigation } from '@react-navigation/core';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import AppStyles from '../../constants/AppStyles';
import { storage } from '../../src/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome5 } from '@expo/vector-icons';



const UploadFile = (blobFile, fileName, isUploadCompletedCallback) => {
  if (!blobFile) return;
  const storageRef = ref(storage, `myDocs/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, blobFile);

  uploadTask.on(
    'state_changed',
    null,
    (error) => console.log(error),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        isUploadCompletedCallback(downloadURL);
      });
    }
  );
};

const OperationsPage = () => {
  const navigation = useNavigation();

  const [blobFile, setBlobFile] = useState(null);
  const [fileName, setFileName] = useState('No Files');
  const [isChoosed, setIsChoosed] = useState(false);
  const [uploadCompleted, isUploadCompleted] = useState(false);
  const [uploadStart, setUploadStart] = useState(false);

  useEffect(() => {
    if (uploadCompleted) {
      showToastWithGravityAndOffset('Document Saved Successfully');
      clearFiles();
    }
  }, [uploadCompleted]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result)
    if (result != null) {
      const response = await fetch(result.uri);
      const blob = await response.blob();
      setFileName(result.name);
      setBlobFile(blob);
      setIsChoosed(true);
    }
  };

  const clearFiles = () => {
    setFileName('No Files');
    setBlobFile(null);
    setIsChoosed(false);
  };

  const uploadFile = () => {
    if (blobFile) {
      showToastWithGravityAndOffset('Uploading File....');
      setUploadStart(true);
      UploadFile(blobFile, fileName, (downloadURL) => {
        clearFiles();
        showToastWithGravityAndOffset('Document Saved Successfully');
        // You can navigate to another screen here if needed.
        // navigation.navigate('AnotherScreen');
      });
    }
  };

  const showToastWithGravityAndOffset = (msg = '') => {
    alert(msg);
  };

  return (
    <View style={styles.container}>
      {uploadStart ? (
        <Text>Success</Text>
      ) : (
        <>
          <Text style={styles.textStyle}>{fileName}</Text>
          <View style={styles.btnContainer}>
            {isChoosed ? (
              <TouchableOpacity style={styles.btnStyle} onPress={() => uploadFile()}>
                <Text style={styles.btnTextStyle}>Upload</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.textStyle}>Choose a File -- </Text>
            )}
            <TouchableOpacity onPress={() => pickDocument()}>
              <FontAwesome5 name="file-upload" size={60} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default OperationsPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStyles.color.background,
  },
  textStyle: {
    padding: 10,
    fontSize: 18

  },
  btnStyle: {
    height: 50,
    width: 150,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnTextStyle: {
    color: 'white',
    fontSize: 20
  },
  btnContainer: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})