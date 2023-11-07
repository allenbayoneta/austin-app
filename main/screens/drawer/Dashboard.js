import { useNavigation } from '@react-navigation/core'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AppStyles from '../../constants/AppStyles'
import { Picker } from '@react-native-picker/picker'


const DashboardPage = () => {

  const navigation = useNavigation()
  const [period, setPeriod] = useState()
  const handleValueChange=(itemValue, itemIndex) =>setPeriod(itemValue)

  return (
    <View style={styles.container}>
      <View style={styles.overview}>
        <View style={styles.ov}>
          <View><Text style={styles.ov2}>All Transaction</Text></View>
          <View>
            <Picker style={styles.picker} selectedValue={period} onValueChange={handleValueChange}>
              <Picker.Item label='Weekly' value="weekly" />
              <Picker.Item label='Monthly' value="monthly" />
              <Picker.Item label='Yearly' value="yearly" />
            </Picker>
          </View>
        </View>
        <View style={styles.supergraph}>
          <Text>graph</Text>
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
          Min
          <span>Salary</span>
          Max
        </View>
        <View style={styles.salaryitem}>
          <text>P 0000</text>
          <text>P 9999</text>
        </View>
        <View style={styles.expensetitle}>Min<span>Expense</span>Max</View>
        <View style={styles.expenseitem}>
          <text>P 0000</text>
          <text>P 9999</text>
        </View>
      </View>
    </View>
  )
}

export default DashboardPage

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: AppStyles.color.background,
  },
  overview: {
    width: '75%',
    margin: 30,
    borderWidth: 3,
    borderRadius: 20,
    justifyContent: 'top',
  },
  ov: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ov2: {
    width: '100%',
    fontSize: 20,
    fontWeight: 'bold',
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
    paddingVertical: '100px',
    paddingHorizontal: '130px',
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
    fontWeight: 600,
  },
  rev1: {
    marginLeft: '-140px',
    marginTop: '5px',
    fontWeight: 1200,
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
    fontWeight: 600,
  },
  loss2: {
    marginLeft: '-140px',
    marginTop: '5px',
    fontWeight: 1200,
  },
  history: {
    margin: '1rem 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
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
    width: '100%',
    marginBottom: '10px',
  },
  salarytitle:{
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontSize: '1.2rem',
    display: 'flex',
    marginBottom: '5px',
    marginTop: '20px',
  },
  salaryitem:{
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FCF6F9',
    shadowColor: '#171717',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: '1rem',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 200,
    fontSize: '1.6rem',
    marginBottom: '20px',
    marginTop: '5px',
  },
  expensetitle:{
    width: '90%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontSize: '1.2rem',
    display: 'flex',
    marginBottom: '5px',
    marginTop: '20px',
  },
  expenseitem:{
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FCF6F9',
    shadowColor: '#171717',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: '1rem',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 200,
    fontSize: '1.6rem',
    marginBottom: '20px',
    marginTop: '5px',
  },
})