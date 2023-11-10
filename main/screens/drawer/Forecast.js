import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
} from "react-native"; // Import Button component
import { auth, storage } from "../../src/firebase";
import AppStyles from "../../constants/AppStyles";
import UploadPicker from "../../constants/Upload";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState, useEffect } from "react";
import { readString } from "react-native-csv";
import { LineChart } from "react-native-chart-kit";
import { ref, getDownloadURL } from "firebase/storage";

const ForecastPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [csvFileExists, setCsvFileExists] = useState(false);
  const user = auth.currentUser;
  const screenWidth = Dimensions.get("window").width;

  const checkCsvFile = async () => {
    try {
      const storageRef = ref(storage, `/forecast/${user.uid}/forecast.csv`);
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
    const apiUrl = 'http://127.0.0.1:5000/generate_forecast';

    try {
      const formData = new FormData();
      formData.append('csvFile', {
        uri: 'file://' + filePath,
        type: 'application/csv',
        name: 'csvFile',
      });
      formData.append('period', '12');
      console.log(formData)
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Received forecast data:', data);
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const downloadAndParseCSV = async () => {
    try {
      const storageRef = ref(storage, `/forecast/${user.uid}/forecast.csv`);
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      const csvText = await response.text();
      const urlText = await response.url;
      console.log(urlText);

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

      // const forecastData = {
      //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      //   datasets: [
      //     {
      //       data: [
      //         Math.random() * 1000,
      //         Math.random() * 1000,
      //         Math.random() * 1000,
      //         Math.random() * 1000,
      //         Math.random() * 1000,
      //         Math.random() * 1000,
      //       ],
      //     },
      //   ],
      // };

      setChartData(chartData);

      const initalForecast = generateForecast("/Users/abc/Downloads/forecast.csv");

      setForecastData(initalForecast);
      console.log(forecastData)

    } catch (error) {
      console.error("Error downloading or parsing CSV:", error);
    }
  };

  const closeForecast = async () => {
    setChartData(null);
    setCsvFileExists(false);
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(201,55,86, ${opacity})`,
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        {csvFileExists && (
          <Pressable style={styles.uploadButton} onPress={downloadAndParseCSV}>
            <Text style={styles.buttonText}>Predict Sales</Text>
          </Pressable>
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
                formatXLabel={(label) => {
                  const dateParts = label.split("-");
                  const monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
                  const month = parseInt(dateParts[1], 10) - 1;
                  return `${monthNames[month]}`;
                }}
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
              {/* <View style={{ marginTop: 30 }}>
                <Text style={styles.headerText}>Forecast of 6 months</Text>
                <LineChart
                  data={forecastData}
                  width={screenWidth - 100}
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
                  }}
                />
              </View> */}
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
});
