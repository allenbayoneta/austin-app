import {
  View,
  Pressable,
  StyleSheet,
  Text, TextInput,
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
import { PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

const DashboardPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [csvFileExists, setCsvFileExists] = useState(false);
  const [income, setIncome] = useState(null);
  const [expense, setExpense] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);


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
    setIncome(formatNumber(totalIncome));
    return totalIncome;
  };

  const getTotalExpenses = (csvData) => {
    const expenseRows = csvData.filter((row) => row[2] === "expense");
    const totalExpenses = expenseRows.reduce((total, row) => total + parseFloat(row[1]), 0);
    setExpense(formatNumber(totalExpenses));
    return totalExpenses;
  };

  const getCurrentBalance = (csvData) => {
    const totalIncome = getTotalIncome(csvData);
    const totalExpenses = getTotalExpenses(csvData);
    const currentBalance = totalIncome - totalExpenses;
    setBalance(formatNumber(currentBalance));
  };

  const formatNumber = (num) => {
    return num ? num.toLocaleString() : '0';
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [enteredPage, setEnteredPage] = useState('');
  const navigateToPage = () => {
    // Ensure that the entered page is a number within the page count range
    const pageNumber = Number(enteredPage.trim());
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
      setEnteredPage(''); // Clear the input field
    } else {
      // Handle error for invalid input or page number out of range
      alert(`Enter a number between 1 and ${pageCount}`);
    }
  };

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    setEnteredPage(currentPage.toString()); // Reset enteredPage to currentPage when not focused
  };

  const pageCount = Math.ceil(transactions.length / itemsPerPage);
  const tableHeaders = ['Name', 'Amount', 'Type', 'Date'];

  const [filterType, setFilterType] = useState('All');

  const currentTableData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredTransactions = transactions
      .filter((transaction) => {
        return filterType === 'All' || transaction.type === filterType.toLowerCase();
      })
      .slice(startIndex, endIndex);
    return filteredTransactions;
  };

  const goToNextPage = () => {
    setCurrentPage((page) => (page < pageCount ? page + 1 : page));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => (page > 1 ? page - 1 : page));
  };

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const data = [
    {
      name: 'Income',
      amount: income ? parseFloat(income.replace(/,/g, '')) : 0,
      color: '#6842ef',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Expense',
      amount: expense ? parseFloat(expense.replace(/,/g, '')) : 0,
      color: '#4172ef',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
  ];


  const screenWidth = Dimensions.get('window').width;



  const downloadAndParseCSV = async () => {
    try {
      const storageRef = ref(storage, `/dashboard/${user.uid}/dashboard.csv`);
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      const csvText = await response.text();
      const csvData = readString(csvText).data;
      const formattedData = csvData.slice(1).map(row => ({
        name: row[0],
        amount: formatNumber(parseFloat(row[1])),
        type: row[2],
        date: row[3],
      }));
      setTransactions(formattedData);

      console.log("CSV Data:", csvData);

      const totalIncome = getTotalIncome(csvData);
      const totalExpenses = getTotalExpenses(csvData);
      const currentBalance = totalIncome - totalExpenses;
      setBalance(formatNumber(currentBalance));


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
            <View style={styles.Srow}>
              <View style={styles.pieContainer}>
                <Text style={styles.chartHeaderText}>Sales Breakdown</Text>
                <PieChart
                  data={data}
                  width={width * 0.3} // Make sure the width is correct
                  height={150} // Adjust height if necessary
                  chartConfig={chartConfig}
                  accessor={'amount'}
                  backgroundColor={'transparent'}
                  paddingLeft={'10'}
                  center={[10, 10]} // Adjust the centering if necessary
                  absolute
                />
              </View>
              {/* <View style={styles.pieContainer}>
                <Text style={styles.chartHeaderText}>Sales Breakdown</Text>
                <PieChart
                  data={data}
                  width={width * 0.3} // Make sure the width is correct
                  height={150} // Adjust height if necessary
                  chartConfig={chartConfig}
                  accessor={'amount'}
                  backgroundColor={'transparent'}
                  paddingLeft={'10'}
                  center={[10, 10]} // Adjust the centering if necessary
                  absolute
                />
              </View> */}
            </View>
            <View style={styles.Trow}>
              {csvFileExists && transactions.length > 0 && (
                <View style={styles.tableContainer}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.tableHeader}>Detailed Summary</Text>
                    <View style={styles.filterContainer}>
                      <Picker
                        selectedValue={filterType}
                        style={styles.pickerStyle}
                        onValueChange={(itemValue, itemIndex) => setFilterType(itemValue)}>
                        <Picker.Item label="All" value="All" />
                        <Picker.Item label="Income" value="Income" />
                        <Picker.Item label="Expense" value="Expense" />
                      </Picker>
                    </View>
                  </View>
                  <ScrollView style={styles.tableScrollView}>
                    <Table borderStyle={{ borderWidth: 2, borderColor: AppStyles.color.accent }}>
                      <Row data={tableHeaders} style={styles.head} textStyle={styles.text} />
                      <Rows data={currentTableData().map(t => [t.name, t.amount, t.type, t.date])} textStyle={{ margin: 6 }} />
                    </Table>
                  </ScrollView>
                  <View style={styles.pagination}>
                    <Pressable onPress={goToPreviousPage} disabled={currentPage === 1}>
                      <View style={styles.paginationButton}>
                        <Text style={styles.paginationButtonText}>{"<"}</Text>
                      </View>
                    </Pressable>
                    <TextInput
                      style={styles.pageInput}
                      value={isFocused ? enteredPage : currentPage.toString()} // Display enteredPage when focused, otherwise currentPage
                      onChangeText={setEnteredPage}
                      placeholder="Page No."
                      keyboardType="number-pad"
                      returnKeyType="go"
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      onSubmitEditing={navigateToPage}
                    />
                    <Pressable onPress={goToNextPage} disabled={currentPage === pageCount}>
                      <View style={styles.paginationButton}>
                        <Text style={styles.paginationButtonText}>{">"}</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              )}

            </View>
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
    </ScrollView >
  )
}

export default DashboardPage
const { width } = Dimensions.get("window");
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
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: 'transparent',
    maxHeight: '100%', // Set a maximum height to occupy available space
  },
  paginationButton: {
    backgroundColor: AppStyles.color.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  paginationButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  pageInput: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 8,
    width: 50, // You can adjust the width as needed
    textAlign: 'center',
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppStyles.color.accent,
    // Remove paddingVertical if it's no longer necessary
    // alignSelf: 'flex-start' is not needed anymore
  },
  head: { height: 40, backgroundColor: AppStyles.color.accent },
  text: { margin: 6, fontWeight: 'bold', color: '#fff' },
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
  pickerStyle: {
    height: 30,
    // Set a fixed width or use 'auto' for automatic adjustment based on content
    width: 100,
  },
  FrowChartContainer: {
    marginHorizontal: 5,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: AppStyles.color.primary, // Set the background color similar to Current Balance
    borderColor: AppStyles.color.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width < 600 ? '80%' : width * 0.20, // Adjust width based on screen width
    height: 220, // Adjust height as necessary
    marginBottom: 10,
  },
  chartHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6842ef',
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
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
  },
  tableScrollView: {
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
  summaryHeader: {
    flexDirection: 'row', // Align children in a row
    justifyContent: 'space-between', // Space between the text and the picker
    alignItems: 'center', // Center items vertically
    width: '100%', // Take full width to accommodate space between items
    paddingHorizontal: 16, // Add horizontal padding if needed
    marginBottom: 10, // Optional: Add margin at the bottom for spacing
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
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
    alignSelf: 'center',
    marginVertical: 20,
  },
  FrowBalContainer: {
    marginHorizontal: 5,
    padding: 20,
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
    width: width < 600 ? '80%' : width * 0.20,
    height: 120, // Set width based on screen width
    marginBottom: 10, // Add margin at the bottom for spacing
  },
  FrowContainer: {
    marginHorizontal: 5,
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: "#000",
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: AppStyles.color.primary,
    borderColor: AppStyles.color.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width < 600 ? '80%' : width * 0.20, // Set width based on screen width
    height: 120,
    marginBottom: 10, // Add margin at the bottom for spacing
  },
  pieContainer: {
    margin: 5,
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: "#000",
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: AppStyles.color.primary,
    borderColor: AppStyles.color.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width < 600 ? '80%' : width * 0.30,
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
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
    alignSelf: 'center',
    marginVertical: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%", // Occupy the full width of the screen
    alignSelf: 'center',
    marginVertical: 20,
  },
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: 'transparent', // Set the background to transparent
  },
  filterContainer: {
    // Adjust the styling according to your app's theme
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    // The width can be set to auto or a fixed value depending on your design
  },

})