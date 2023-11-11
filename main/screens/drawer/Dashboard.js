import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import AppStyles from '../../constants/AppStyles';

const DashboardPage = () => {
  const navigation = useNavigation();
  const [period, setPeriod] = useState();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const handleScreenResize = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    Dimensions.addEventListener('change', handleScreenResize);

    return () => {
      Dimensions.removeEventListener('change', handleScreenResize);
    };
  }, []);

  const handleValueChange = (itemValue, itemIndex) => setPeriod(itemValue);

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        data: [2000, 4500, 28000, 8000, 990, 4300],
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.overview}>
          <View style={styles.ov}>
            <View>
              <Text style={styles.ov2}>All Transaction</Text>
            </View>
            <View>
              <Picker
                style={styles.picker}
                selectedValue={period}
                onValueChange={handleValueChange}>
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
                <Picker.Item label="Yearly" value="yearly" />
              </Picker>
            </View>
          </View>
          <View style={styles.supergraph}>
            <LineChart
              data={chartData}
              width={screenWidth * 0.6}
              height={screenWidth * 0.5}
              yAxisLabel="P"
              chartConfig={{
                backgroundColor: AppStyles.color.background,
                backgroundGradientFrom: AppStyles.color.background,
                backgroundGradientTo: AppStyles.color.background,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(40, 60, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 80, 150, ${opacity})`,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
            />
          </View>
        </View>
        <View style={styles.iris}>
          <View style={[styles.revenue, styles.shadow1]}>
            <Text style={styles.rev}>Total Income</Text>
            <Text style={styles.rev1}>------</Text>
          </View>
          <View style={[styles.loss, styles.shadow1]}>
            <Text style={styles.loss1}>Total Expenses</Text>
            <Text style={styles.loss2}>------</Text>
          </View>
        </View>
        <View style={styles.history}>
          <h2>Recent History</h2>
          <View style={styles.histcontainer}>
            <text>Title</text>
            <text>P 0000</text>
          </View>
          <View style={styles.histcontainer}>
            <text>Title</text>
            <text>P 0000</text>
          </View>
          <View style={styles.histcontainer}>
            <text>Title</text>
            <text>P 0000</text>
          </View>
          <View style={styles.salarytitle}>
            <Text style={styles.titleText}>Min</Text>
            <Text style={styles.titleText}>Income</Text>
            <Text style={styles.titleText}>Max</Text>
          </View>
          <View style={styles.salaryitem}>
            <text>P 0000</text>
            <text>P 5000</text>
            <text>P 9999</text>
          </View>
          <View style={styles.expensetitle}>
            <Text style={styles.titleText}>Min</Text>
            <Text style={styles.titleText}>Income</Text>
            <Text style={styles.titleText}>Max</Text>
          </View>
          <View style={styles.expenseitem}>
            <text>P 0000</text>
            <text>P 5000</text>
            <text>P 9999</text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardPage;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: AppStyles.color.background,
  },
  overview: {
    width: '70%',
    margin: 20,
    borderWidth: 3,
    borderRadius: 20,
    justifyContent: 'center',
  },
  ov: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ov2: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Archivo',
  },
  picker: {
    paddingHorizontal: '10px',
    width: '100%',
    color: 'black',
    borderColor: 'black',
    borderWidth: '2px',
    borderRadius: '5px',
  },
  supergraph: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'pink',
    borderWidth: 2,
    borderRadius: 15,
  },
  iris: {
  },
  revenue: {
    width: '75%',
    backgroundColor: 'white',
    paddingVertical: '45px',
    paddingHorizontal: '150px',
    borderRadius: 8,
  },
  shadow1: {
    shadowColor: '#171717',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  rev: {
    marginLeft: '-140px',
    marginTop: '-35px',
    fontWeight: 'bold',
    fontFamily: 'Archivo',
  },
  rev1: {
    marginLeft: '-140px',
    marginTop: '5px',
    fontWeight: 'bold',
    fontFamily: 'Archivo',
  },

  loss: {
    marginTop: 5,
    paddingVertical: '45px',
    paddingHorizontal: '150px',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  loss1: {
    marginLeft: '-140px',
    marginTop: '-35px',
    fontWeight: 'bold',
    fontFamily: 'Archivo',
  },
  loss2: {
    marginLeft: '-140px',
    marginTop: '5px',
    fontWeight: 'bold',
    fontFamily: 'Archivo',
  },
  history: {
    margin: '1rem 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    fontFamily: 'Archivo',
    fontWeight: 'bold',
  },
  histcontainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    backgroundColor: '#FCF6F9',
    shadowColor: '#171717',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: '1rem',
    borderRadius: '20px',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
    fontFamily: 'Archivo',
  },
  salarytitle: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: '1.2rem',
    display: 'flex',
    marginBottom: '5px',
    marginTop: '20px',
    fontFamily: 'Archivo',
    fontWeight: 'bold',
  },
  salaryitem:{
    width: '80%',
    flexDirection: 'row',
    backgroundColor: '#FCF6F9',
    shadowColor: '#171717',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: '1rem',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontWeight: 200,
    fontSize: '1.6rem',
    marginBottom: '20px',
    marginTop: '5px',
    fontFamily: 'Archivo',
  },
  expensetitle: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontSize: '1.2rem',
    display: 'flex',
    marginBottom: '5px',
    marginTop: '20px',
    fontFamily: 'Archivo',
    fontWeight: 'bold',
  },
  expenseitem:{
    width: '80%',
    flexDirection: 'row',
    backgroundColor: '#FCF6F9',
    shadowColor: '#171717',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: '1rem',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontWeight: 200,
    fontSize: '1.6rem',
    marginBottom: '20px',
    marginTop: '5px',
    fontFamily: 'Archivo',
  },
  titleText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginLeft: -5, 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
})
