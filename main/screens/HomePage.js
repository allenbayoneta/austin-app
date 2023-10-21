import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import AppStyles from '../constants/AppStyles'
import Icon from '../assets/icon.png'
import DashboardPage from './drawer/Dashboard'
import CalendarPage from './drawer/Calendar'
import OperationsPage from './drawer/Operations'
import SettingsPage from './drawer/Settings'
import 'react-native-gesture-handler'
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { SimpleLineIcons, MaterialIcons } from "@expo/vector-icons";


const Drawer = createDrawerNavigator();

const HomePage = () => {

    const navigation = useNavigation()

    return (
        <Drawer.Navigator
            drawerContent={
                (props) => {
                    return (
                        <SafeAreaView>
                            <View style={styles.drawerItems}>
                                <Image
                                    source={Icon}
                                    style={styles.profilePic}
                                />
                                <Text style={styles.username}>
                                    Bhenjie Cabario
                                </Text>
                                <Text
                                    style={styles.company}
                                >Smart Grocers Inc.</Text>
                            </View>
                            <DrawerItemList {...props} />
                            <View style={styles.logout}>
                                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.replace("Login")}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
                                </TouchableOpacity>
                            </View>

                        </SafeAreaView>
                    )
                }
            }
            screenOptions={{
                drawerStyle: {
                    backgroundColor: "white",
                    width: 250
                },
                headerStyle: {
                    backgroundColor: AppStyles.color.accent,
                },
                headerTintColor: "white",
                headerTitleStyle: {
                    fontWeight: "bold"
                },
                drawerLabelStyle: {
                    color: "black"
                }
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                options={{
                    drawerLabel: "Dashboard",
                    title: "Dashboard",
                    drawerIcon: () => (
                        <SimpleLineIcons name="home" size={20} color="#808080" />
                    )
                }}
                component={DashboardPage}
            />
            <Drawer.Screen
                name="Operations"
                options={{
                    drawerLabel: "Operations",
                    title: "Operations",
                    drawerIcon: () => (
                        <MaterialIcons name="dashboard-customize" size={20} color="#808080" />
                    )
                }}
                component={OperationsPage}
            />
            <Drawer.Screen
                name="Calendar"
                options={{
                    drawerLabel: "Calendar",
                    title: "Calendar",
                    drawerIcon: () => (
                        <MaterialIcons name="category" size={20} color="#808080" />
                    )
                }}
                component={CalendarPage}
            />
            <Drawer.Screen
                name="Settings"
                options={{
                    drawerLabel: "Settings",
                    title: "Settings",
                    drawerIcon: () => (
                        <SimpleLineIcons name="settings" size={20} color="#808080" />
                    )
                }}
                component={SettingsPage}
            />
        </Drawer.Navigator>
    );
}

export default HomePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppStyles.color.background,
    },
    drawerItems: {
        height: '50%',
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: "#f4f4f4",
        borderBottomWidth: 1,
        backgroundColor: AppStyles.color.accent,
    },
    profilePic: {
        height: 130,
        width: 130,
        borderRadius: 65,
    },
    username: {
        fontSize: 22,
        marginVertical: 3,
        fontWeight: "bold",
        color: "black"
    },
    company: {
        fontSize: 16,
        color: "#111"
    },
    logout:{
        marginTop: 100,
        marginLeft: 20,
    }
})