import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import {GRAY, IPSTORE, ORANGE} from "./constantes";
import close from '../assets/close.png'

import AsyncStorage from "@react-native-async-storage/async-storage";



export class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            visible:false,
            value:""
        }
    }
    componentDidMount() {
        AsyncStorage.getItem(IPSTORE).then((ip)=>{
            this.setState({value:ip});
        })
    }

    escape= () => {
        this.props.body.changeModal();
    }

    onChangeInput = (text) => {
        AsyncStorage.setItem(IPSTORE,text);
        this.setState({value:text})
    }

    render() {
        return (
            <View style={styles.modal}>
                <TouchableOpacity onPress={this.escape} style={styles.viewclose}>
                    <Image style={styles.close} source={close}/>
                </TouchableOpacity>
                <View style={styles.viewip}>
                    <Text style={styles.ip}>
                        IP Raspberry :
                    </Text>
                    <TextInput style={styles.input} value={this.state.value} onChangeText={this.onChangeInput}/>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    modal:{
        backgroundColor:GRAY,
        flex:1
    },
    close:{
        margin:10,
        maxWidth:40,
        maxHeight:40
    },
    viewclose:{
        flex:0.5,

    },
    viewip:{
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        flex:6
    },
    ip:{
        fontSize:30
    },
    input:{
        backgroundColor: ORANGE,
        color:"white",
        width:"60%",
        padding:10,
        margin:10,
        borderRadius:20,
        borderWidth:1
    }
});
