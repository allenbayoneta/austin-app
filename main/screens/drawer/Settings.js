import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import AppStyles from '../../constants/AppStyles';

const SettingsPage = () => {
  const navigation = useNavigation();

  const [notificationEnabled, setNotificationEnabled] = React.useState(true);

  const toggleNotificationSetting = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>App Settings</Text>
      <View style={styles.settingContainer}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={notificationEnabled}
          onValueChange={toggleNotificationSetting}
        />
      </View>
      <Pressable
        style={styles.settingContainer}
        onPress={() => navigation.navigate('PrivacySettings')}
      >
        <Text style={styles.settingLabel}>Privacy</Text>
      </Pressable>
      <Pressable
        style={styles.settingContainer}
        onPress={() => navigation.navigate('AccountSettings')}
      >
        <Text style={styles.settingLabel}>Account</Text>
      </Pressable>

    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppStyles.color.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: AppStyles.color.accent,
    borderRadius: 8,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 18,
  },
});
