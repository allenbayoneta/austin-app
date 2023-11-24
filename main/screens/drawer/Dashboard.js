import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { auth, storage } from "../../src/firebase";
import AppStyles from "../../constants/AppStyles";
import UploadPicker from "../../constants/Upload";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState, useEffect } from "react";
import { readString } from "react-native-csv";
import { LineChart } from "react-native-chart-kit";
import { ref, getDownloadURL } from "firebase/storage";
import { Table, Row, Rows } from 'react-native-table-component';

const DashboardPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [csvFileExists, setCsvFileExists] = useState(false);
  const [income, setIncome] = useState(null);
  const [expense, setExpense] = useState(null);
  const [balance, setBalance] = useState(null);

  const user = auth.currentUser;
  const file = 'dashboard'


  const onModalClose = () => {
    setIsModalVisible(false);
    checkCsvFile();
    downloadAndParseCSV();
  };
  const onAddFile = () => {
    setIsModalVisible(true);
  };
  const checkCsvFile = async () => {
    try {
      const storageRef = ref(storage, `/${file}/${user.uid}/${file}.csv`);
      await getDownloadURL(storageRef);
      setCsvFileExists(true);
    } catch (error) {
      setCsvFileExists(false);
    }
  };
  const closeVisuals = async () => {
    setCsvFileExists(false);
  };

  const getTotalIncome = (csvData) => {
    const incomeRows = csvData.filter((row) => row[2] === "income");
    const totalIncome = incomeRows.reduce((total, row) => total + parseFloat(row[1]), 0);
    setIncome(totalIncome);
    return totalIncome;
  };

  const getTotalExpenses = (csvData) => {
    const expenseRows = csvData.filter((row) => row[2] === "expense");
    const totalExpenses = expenseRows.reduce((total, row) => total + parseFloat(row[1]), 0);
    setExpense(totalExpenses);
    return totalExpenses;
  };

  const getCurrentBalance = (csvData) => {
    const totalIncome = getTotalIncome(csvData);
    const totalExpenses = getTotalExpenses(csvData);
    const currentBalance = totalIncome - totalExpenses;
    setBalance(currentBalance);
  };




  const downloadAndParseCSV = async () => {
    try {
      const storageRef = ref(storage, `/dashboard/${user.uid}/dashboard.csv`);
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      const csvText = await response.text();
      const csvData = readString(csvText).data;

      console.log("CSV Data:", csvData);

      const totalIncome = getTotalIncome(csvData);
      const totalExpenses = getTotalExpenses(csvData);
      const currentBalance = totalIncome - totalExpenses;
      setBalance(currentBalance);


      console.log("Total Income:", totalIncome);
      console.log("Total Expenses:", totalIncome);
      console.log("Total Expenses:", totalIncome);

    } catch (error) {
      console.error("Error downloading or parsing CSV:", error);
    }
  };


  useEffect(() => {
    checkCsvFile();
    downloadAndParseCSV();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <UploadPicker
          isVisible={isModalVisible}
          currentUser={user}
          onClose={onModalClose}
          folder={file}
        />
        {csvFileExists ? (
          <View style={{ marginVertical: 30, width: '100%' }}>
            <View style={styles.Frow}>
              <View style={styles.FrowBalContainer}>
                <Text style={styles.balText}>Current Balance</Text>
                <Text style={styles.balance}>₱ {balance}</Text>
              </View>
              <View style={styles.FrowContainer}>
                <Text style={styles.Header}>Total Income</Text>
                <Text style={styles.total}>₱ {income}</Text>
              </View>
              <View style={styles.FrowContainer}>
                <Text style={styles.Header}>Total Expenses</Text>
                <Text style={styles.total}>₱ {expense}</Text>
              </View>
            </View>
            {/* <View style={styles.Srow}>
              <View style={styles.SrowContainer}>
                <Text style={styles.Header}>Pie graph</Text>
              </View>
              <View style={styles.SrowContainer}>
                <Text style={styles.Header}>summary</Text>
              </View>
            </View>
            <View style={styles.Trow}>
              <View style={styles.TableContainer}>
                <Text style={styles.Header}> SuperTable</Text>
              </View>
            </View> */}
            <View style={{ alignItems: "center", marginVertical: 30 }}>
              <Pressable style={styles.uploadButton} onPress={closeVisuals}>
                <Text style={styles.buttonText}>Close Visuals</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={[styles.messageText, { marginVertical: 30 }]}>Visualizations will be here. Please upload a CSV file with proper format.</Text>
        )}
        <View style={styles.uploadContainer}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              Upload file here.
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
    </ScrollView>
  )
}

export default DashboardPage

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: AppStyles.color.background,
  },
  uploadContainer: {
    marginVertical: 20,
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
  headerText: {
    color: AppStyles.color.accent,
    fontWeight: "bold",
    fontSize: 28,
  },
  Frow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
    alignSelf: 'center',
    marginVertical: 20,
  },
  FrowBalContainer: {
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 50,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: AppStyles.color.accent,
    borderColor: AppStyles.color.accent,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  FrowContainer: {
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: "#000",
    backgroundColor: AppStyles.color.primary,
    borderColor: AppStyles.color.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  balText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  Header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppStyles.color.accent,
  },
  total: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppStyles.color.accent,
  },
  Srow: {
    flexDirection: 'row',
    paddingHorizontal: '40%',
    paddingVertical: '3%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SrowContainer: {
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: '175%',
    paddingVertical: '120%',
    borderRadius: '20px'
  },
  Trow: {
    paddingHorizontal: '40%',
    paddingVertical: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  TableContainer: {
    borderWidth: 1,
    paddingHorizontal: '800%',
    paddingVertical: '300%',
    borderRadius: '20px'
  },
})