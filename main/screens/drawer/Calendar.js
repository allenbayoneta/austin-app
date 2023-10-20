import { useNavigation } from '@react-navigation/core'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import AppStyles from '../../constants/AppStyles'

const CalendarPage = () => {

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>Calendar</Text>
    </View>
  )
}

export default CalendarPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStyles.color.background,
  }
})