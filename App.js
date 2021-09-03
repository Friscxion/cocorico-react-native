import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Body} from "./components/Body";
import {GRAY} from "./modules/constantes";

export default function App() {
  return (
    <View style={styles.container}>
      <Body/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"column",
    backgroundColor: GRAY,
  },
});
