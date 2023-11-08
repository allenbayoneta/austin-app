import { React, useState } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { auth } from "../../src/firebase";
import AppStyles from "../../constants/AppStyles";
import UploadPicker from "../../constants/Upload";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ForecastPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = auth.currentUser;
  const onAddFile = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <UploadPicker
        isVisible={isModalVisible}
        currentUser={user}
        onClose={onModalClose}
      />
      <View style={styles.uploadContainer}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            ! To do a sales forecast, make sure that the file uploaded would
            have a 'Sales' column.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.uploadButton} onPress={onAddFile}>
            <MaterialIcons name="upload-file" color="#fff" size={22} />
            <Text style={styles.buttonText}>Upload</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ForecastPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppStyles.color.background,
  },
  uploadContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderColor: AppStyles.color.accent,
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 10,
    width: "80%",
  },
  messageContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  messageText: {
    textAlign: "center",
    fontSize: 16,
    fontStyle: "italic",
    color: "grey",
  },
  buttonContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: AppStyles.color.accent,
    width: "80%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
