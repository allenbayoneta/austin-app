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
        <View style={styles.Frow}>
          <View style={styles.FrowBalContainer}>
            <Text style={styles.balText}>Current Balance</Text>
            <Text style={styles. balance}></Text>
          </View>
          <View style={styles.FrowContainer}>
            <Text style={styles.Header}>Total Income</Text>
            <Text style={styles.total}></Text>
          </View>
          <View style={styles.FrowContainer}>
            <Text style={styles.Header}>Total Income</Text>
            <Text style={styles.total}></Text>
          </View>
        </View>
        <View style={styles.Srow}>
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
  Frow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '35%',
    paddingVertical: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  FrowBalContainer: {
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: '50%',
    paddingVertical: '25%',
    borderWidth: 1,
    borderRadius: '20px', 
    backgroundColor: AppStyles.color.accent,
  },
  FrowContainer: {
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: '50%',
    paddingVertical: '25%',
    borderWidth: 1,
    borderRadius: '20px',
  },
  balText: {

  },
  Srow: {
    flexDirection: 'row',
    paddingHorizontal: '40%',
    paddingVertical: '3%' ,
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
    paddingVertical: '5%' ,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  TableContainer: {
    borderWidth: 1,
    paddingHorizontal: '800%',
    paddingVertical: '300%' , 
    borderRadius: '20px'
  },
}) 