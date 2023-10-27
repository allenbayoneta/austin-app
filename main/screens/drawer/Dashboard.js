import { useNavigation } from '@react-navigation/core'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AppStyles from '../../constants/AppStyles'
import { Picker } from '@react-native-picker/picker'


const DashboardPage = () => {

  const navigation = useNavigation()
  const [period,setPeriod] = useState()
  const handleValueChange=(itemValue, itemIndex) => setPeriod(itemValue)

  return (
    <View style={styles.container}>

      <View style={styles.overview}>

        <View style={styles.ov}>

          <View><Text style={styles.ov2}>Overview</Text></View>

          <View>
            <Picker
              style={styles.picker}
              selectedValue={period}
              onValueChange={handleValueChange}>
              <Picker.Item label="Weekly" value="week" />  /*Dropdown labels*/
              <Picker.Item label="Monthly" value="month" />
              <Picker.Item label="Yearly" value="year" />
            </Picker>
          </View>

        </View>

        <View style={styles.supergraph}>
          <Text>graph</Text>
        </View>
      </View>

      <View style={styles.iris}>

        <View style={[styles.revenue, styles.shadow1]}>

          <Text style={styles.rev}>Revenue</Text>
          <Text style={styles.rev1}>50,000</Text>
        </View>

        <View style={[styles.loss, styles.shadow1]}>
          <Text style={styles.loss1}>Loss</Text>
          <Text style={styles.loss2}>50,000</Text>
        </View>

      </View>
    </View>
  )
}

export default DashboardPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: AppStyles.color.background,

  },
  overview: {
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
    fontSize: 20,
    fontWeight: 'bold',
  

  },
  picker: {
    width: '100%',
    color: 'black',
    borderColor: 'black',
    borderWidth: '3px',
    borderRadius: '10px',
  },
  supergraph: {
    paddingVertical: '100px',
    paddingHorizontal: '130px',

  },
  iris: {
  },
  revenue: {
    backgroundColor: 'white',
    paddingVertical: '50px',
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
 
  },
  rev1: {
    marginLeft: '-140px',
    marginTop: '5px',
 
  },

  loss: {
    marginTop: 5,
    paddingVertical: '50px',
    paddingHorizontal: '150px',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  loss1: {
    marginLeft: '-140px',
    marginTop: '-35px',
   
  },
  loss2: {
    marginLeft: '-140px',
    marginTop: '5px',

  },
})