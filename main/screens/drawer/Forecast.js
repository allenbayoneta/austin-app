import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert
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
import Constants from 'expo-constants';

const ForecastPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [csvFileExists, setCsvFileExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const screenWidth = Dimensions.get("window").width;
  const file = 'forecast'

  const checkCsvFile = async () => {
    try {
      const storageRef = ref(storage, `/${file}/${user.uid}/${file}.csv`);
      await getDownloadURL(storageRef);
      setCsvFileExists(true);
    } catch (error) {
      setCsvFileExists(false);
    }
  };

  useEffect(() => {
    checkCsvFile();
  }, [user]);

  const onAddFile = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
    checkCsvFile();
  };

  const generateForecast = async (filePath) => {
    const apiUrl = 'https://allenbayonetea.pythonanywhere.com/generate_forecast ';
    //const apiUrl = 'http://localhost:5000/generate_forecast ';
    try {
      const formData = new FormData();
      const response = await fetch(filePath);
      const blob = await response.blob();

      if (Constants.platform.web) {
        formData.append('csvFile', blob, 'forecast.csv');
      } else if (Constants.platform.android || Constants.platform.ios) {
        formData.append('csvFile', {
          uri: filePath,
          name: 'forecast.csv',
          type: 'text/csv',
          data: blob,
        });
      } else {
        console.error('Unsupported platform');
        return null;
      }

      console.log(formData);

      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (apiResponse.status === 200) {
        const forecastValues = await apiResponse.json();
        console.log('Received forecast data:', forecastValues);
        return forecastValues;
      } else {
        console.error('API request failed with status:', apiResponse.status);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const downloadAndParseCSV = async () => {
    try {
      const storageRef = ref(storage, `/forecast/${user.uid}/forecast.csv`);
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      const csvText = await response.text();
      const initialForecast = await generateForecast(url);
      console.log(initialForecast);

      if (initialForecast === null) {
        return;
      }

      const parsedData = readString(csvText, {
        hasHeader: true,
        delimiter: ",",
      });

      const labels = [];
      const values = [];
      for (const row of parsedData.data) {
        const label = row[0];
        const value = parseFloat(row[1]);

        if (label && !isNaN(value)) {
          labels.push(label);
          values.push(value);
        }
      }

      const dataLength = labels.length;
      const labelsLast12 = labels.slice(dataLength - 12);
      const valuesLast12 = values.slice(dataLength - 12);

      const chartData = {
        labels: labelsLast12,
        datasets: [
          {
            data: valuesLast12,
          },
        ],
      };

      const combinedForecastData = {
        labels: ["1st", "2nd", "3rd", "4th", "5th", "6th"],
        datasets: [initialForecast],
      };

      console.log(combinedForecastData)
      setChartData(chartData);
      setForecastData(combinedForecastData);

    } catch (error) {
      console.error("Error downloading or parsing CSV:", error);
      Alert.alert('API Error', 'Failed to process forecast data from the server.');
    } finally {
      setLoading(false);
    }
  };

  const closeForecast = async () => {
    setChartData(null);
    setCsvFileExists(false);
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(104,66,239, ${opacity})`,
  };

  const formatXLabel = (label) => {
    const dateParts = label.split("-");
    const monthNumber = parseInt(dateParts[1], 10);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return `${monthNames[monthNumber - 1]}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <UploadPicker
          isVisible={isModalVisible}
          currentUser={user}
          onClose={onModalClose}
          folder={file}
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

        {csvFileExists && (
          <View style={{ marginVertical: 10, alignItems: "center" }}>
            <Text style={styles.messageText}>A file is available for forecasting.</Text>
            <Pressable
              style={[styles.predictButton, { marginTop: 10 }]}
              onPress={() => {
                setLoading(true);
                downloadAndParseCSV();
              }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : "Predict Sales"}
              </Text>
            </Pressable>
          </View>
        )}

        {loading && (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size="large"
            color={AppStyles.color.accent}
          />
        )}
        <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
          {chartData ? (
            <View>
              <Text style={styles.headerText}>Last 12 Months</Text>
              <LineChart
                data={chartData}
                width={screenWidth - 120}
                height={300}
                chartConfig={chartConfig}
                bezier
                formatXLabel={formatXLabel}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 10,
                  marginVertical: 8,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              />
              <Table borderStyle={{ borderWidth: 2, borderColor: AppStyles.color.accent }}>
                <Row data={['Month', 'Sales']} style={{ height: 40, backgroundColor: AppStyles.color.accent }} textStyle={{ margin: 6, fontWeight: 'bold', color: '#fff' }} />
                <Rows
                  data={chartData.labels.map((value, index) => ([
                    formatXLabel(value),
                    `${chartData.datasets[0].data[index].toFixed(2)}`
                  ]))}
                  textStyle={{ margin: 6 }}
                />
              </Table>
              {forecastData !== null ? (
                <View style={{ marginTop: 30 }}>
                  <Text style={styles.headerText}>Forecast of 6 months</Text>
                  <LineChart
                    data={forecastData}
                    width={screenWidth - 120}
                    height={300}
                    chartConfig={chartConfig}
                    bezier
                    xLabelsOffset={10}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      padding: 10,
                      marginVertical: 8,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                      marginBottom: 10,
                    }}
                  />
                  <Table borderStyle={{ borderWidth: 2, borderColor: AppStyles.color.accent }}>
                    <Row data={['Month', 'Forecast']} style={{ height: 40, backgroundColor: AppStyles.color.accent }} textStyle={{ margin: 6, fontWeight: 'bold', color: '#fff' }} />
                    <Rows
                      data={forecastData.labels.map((value, index) => ([
                        value,
                        `${forecastData.datasets[0].data[index].toFixed(2)}`
                      ]))}
                      textStyle={{ margin: 6 }}
                    />
                  </Table>
                </View>
              ) : (
                <Text style={styles.messageText}>Processing Forecast Please Wait.</Text>
              )}
              <View style={{ alignItems: "center", marginVertical: 30 }}>
                <Pressable style={styles.uploadButton} onPress={closeForecast}>
                  <Text style={styles.buttonText}>Close Graph</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Text style={styles.messageText}>Charts will be here.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ForecastPage;

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
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderColor: AppStyles.color.accent,
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 10,
    width: "90%",
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
    width: "90%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  predictButton: {
    backgroundColor: AppStyles.color.accent,
    width: "90%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
});
