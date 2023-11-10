import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { React, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { storage } from "../src/firebase";
import { ref, uploadBytes } from "firebase/storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AppStyles from "./AppStyles";

export default function UploadPicker({ isVisible, currentUser, onClose }) {
  const [blobFile, setBlobFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const user = currentUser;

  const clearFiles = () => {
    setFileName(null);
    setBlobFile(null);
    setUploadSuccess(null);
    setUploadFailed(null);
  };

  const pickDocument = async () => {
    let document = await DocumentPicker.getDocumentAsync({
      type: ["application/vnd.ms-excel", "text/csv"],
    });
    if (document != null) {
      const response = await fetch(document.assets[0].uri);
      const blob = await response.blob();
      setFileName(document.assets[0].name);
      setBlobFile(blob);
    }
  };

  const uploadFile = async () => {
    if (blobFile) {
      if (user) {
        const userId = user.uid;
        const storageRef = ref(storage, `forecast/${userId}/forecast.csv`);
        const uploadTask = uploadBytes(storageRef, blobFile);
        try {
          await uploadTask;
          setUploadSuccess(true);
          setFileName(null);
          setBlobFile(null);
        } catch (error) {
          setUploadFailed(true);
          console.error("Error uploading file:", error);
        }
      } else {
        console.error("User not authenticated.");
      }
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Upload a File</Text>
          <Pressable
            onPress={() => {
              onClose();
              clearFiles();
            }}
          >
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        <View style={styles.modalView}>
          <View style={styles.mainContainer}>
            <View style={styles.selectContainer}>
              <Text style={styles.messageText}>Accepts .CSV and .XLS</Text>
              <Pressable style={styles.selectButton} onPress={pickDocument}>
                <Text style={styles.buttonText}>Select File</Text>
              </Pressable>
              {fileName ? (
                <View style={styles.fileNameContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.fileNameText}
                  >
                    {fileName.length > 8
                      ? fileName.substring(0, 8) + "..."
                      : fileName}
                  </Text>
                  <Pressable onPress={clearFiles}>
                    <MaterialIcons name="close" color="#000" size={16} />
                  </Pressable>
                </View>
              ) : null}
            </View>
            <View style={styles.uploadContainer}>
              <Pressable style={styles.uploadButton} onPress={uploadFile}>
                <MaterialIcons name="upload-file" color="#fff" size={40} />
                <Text style={styles.uploadButtonText}>Upload</Text>
              </Pressable>
              {uploadSuccess && (
                <Text style={styles.successText}>Upload Successfully</Text>
              )}
              {uploadFailed && (
                <Text style={styles.failText}>Upload Failed</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "80%",
  },
  modalView: {
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainer: {
    height: "5%",
    backgroundColor: AppStyles.color.accent,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    flex: 1,
    borderColor: AppStyles.color.accent,
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 10,
    height: "100%",
  },
  messageText: {
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
  },
  fileNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    justifyContent: "space-between",
  },
  selectButton: {
    margin: 20,
    borderColor: AppStyles.color.accent,
    width: "80%",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  uploadContainer: {
    alignItems: "center",
    padding: 15,
    flex: 1,
  },
  uploadButton: {
    backgroundColor: AppStyles.color.accent,
    width: "80%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  successText: {
    marginTop: 5,
    color: "green",
    fontSize: 16,
  },
  failText: {
    marginTop: 5,
    color: "red",
    fontSize: 16,
  },
});
