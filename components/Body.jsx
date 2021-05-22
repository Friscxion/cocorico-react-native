import React from "react";
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import chicken from '../assets/chicken.png';
import settings from '../assets/settings.png';
import {IPSTORE, ORANGE, PORT} from "./constantes";
import Constants from 'expo-constants';
import {Settings} from "./Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ref = React.createRef();

export class Body extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            modal:false,
            request:false
        }
    }
    changeModal = ()=>{
        this.setState({modal:!this.state.modal});
    }

    openCoco = ()=>{
        AsyncStorage.getItem(IPSTORE).then((ip) =>{
            const query = 'http://'+ip+":"+PORT+'/open';
            console.log(query)
            fetch(query)
                .then(response => response.text())
                .then(responseJson => {
                    console.log(responseJson);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    closeCoco = () => {
        if(this.state.request) return;
        this.setState({request:true});
        AsyncStorage.getItem(IPSTORE).then((ip) =>{
            const query = 'http://'+ip+":"+PORT+'/close';
            console.log(query)
            fetch(query)
                .then(response => response.text())
                .then(responseJson => {
                    console.log(responseJson);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    render() {
        return(
            <View style={styles.container}>
                <Modal
                    style={{flex:0}}
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modal}>
                    <Settings body={this}/>
                </Modal>
                <View style={styles.settingsView}>
                    <TouchableOpacity style={styles.touchable}  onPress={this.changeModal}>
                        <Image style={styles.settings} source={settings}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.title,styles.flexCenter]}>
                    <Image source={chicken} style={styles.chicken}/>
                    <Text style={styles.titre}>Cocorico</Text>

                </View>
                <View style={[styles.open,styles.flexCenter]}>
                   <TouchableOpacity onPress={this.openCoco}>
                       <Text style={styles.button}>Ouvrir</Text>
                   </TouchableOpacity>
                </View>
                <View style={[styles.close,styles.flexCenter]}>
                    <TouchableOpacity onPress={this.closeCoco}>
                        <Text style={styles.button}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 6,
        flexDirection:"column"
    },
    flexCenter:{
        justifyContent:"center",
        alignItems:"center"
    },
    title:{
        flex:1,
    },
    open:{
        flex:2,
    },
    close:{
        flex:2,
    },
    titre:{
        fontSize:30,
        color:ORANGE
    },
    chicken:{
        maxHeight:100,
        maxWidth:100
    },
    button: {
        backgroundColor:ORANGE,
        paddingVertical:50,
        paddingHorizontal:100,
        fontSize: 30,
        fontFamily:"Roboto",
        color:"white",
        borderRadius:20
    },
    settings:{
        maxWidth: 50,
        maxHeight: 50
    },
    settingsView:{
        paddingTop:Constants.statusBarHeight+10,
        flex:0.4,
        padding:0
    },
    touchable:{
        maxHeight:50,
        maxWidth:50
    }

});
