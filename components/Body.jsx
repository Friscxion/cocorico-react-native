import React from "react";
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import chicken from '../assets/chicken.png';
import settings from '../assets/settings.png';
import {LIGHT_GRAY, ORANGE} from "../modules/constantes";
import Constants from 'expo-constants';
import {Settings} from "./Settings";
import LoadingDots from "react-native-loading-dots";


export class Body extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            modal:false,
            status:"unknow",
            online:false
        }
    }
    componentDidMount() {
        this.socketSetup();
    }

    socketSetup(){
        this.socket=require("../modules/cocorico-socket");

        this.socket.on("status",(arg)=>{
            this.setState({status:arg})
        })

        this.socket.on("connected",(args)=>{
            this.setState({online:true})
        });

        this.socket.on("connect_error", (err) => {
            this.setState({online:false})
            console.log(`connect_error due to ${err.message}`);
        });
    }

    changeModal = () => this.setState({modal:!this.state.modal});

    command = (type) => this.socket.emit(type)

    getColor = ()=>{
        switch(this.state.status){
            case("open"):
                return "green";
            case("closed"):
                return "red";
            case("pending"):
                return ORANGE;
            default:
                return "gray";
        }
    }

    getStatus = ()=>{
        switch(this.state.status){
            case("open"):
                return "Ouvert";
            case("closed"):
                return "Fermé";
            case("pending"):
                return ["Action en cours  ",
                    <LoadingDots
                        key={1}
                        colors={["#ffffff", ORANGE, "#ffffff", ORANGE]}
                        size={15}
                        bounceHeight={15}/>];
            default:
                return "Inconnu";
        }
    }

    render() {
        if(!this.state.online){
            return(
                <View style={styles.containerOffline}>
                    <Image source={require('../assets/chicken.png')} style={[styles.settingsLoading]} />
                    <Text style={styles.textLoading}>Connexion en cours</Text>
                    <LoadingDots
                        colors={["#ffffff", ORANGE, "#ffffff", ORANGE]}
                        size={15}
                        bounceHeight={15}/>
                </View>
            )
        }

        const disabled=(this.state.status==="pending"?true:false)||(this.state.status==="unknow"?true:false);
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
                <View style={[styles.status,styles.flexCenter]}>
                    <Text style={styles.statusTitle}>Statut</Text>
                    <Text style={[styles.statusText,{color:this.getColor()}]}>{this.getStatus()}</Text>
                </View>
                <View style={[styles.open,styles.flexCenter]}>
                   <TouchableOpacity disabled={disabled} onPress={this.command.bind(this,'ouvrir')}>
                       <Text style={[styles.button,{backgroundColor: disabled?LIGHT_GRAY:ORANGE}]}>Ouvrir</Text>
                   </TouchableOpacity>
                </View>
                <View style={[styles.close,styles.flexCenter]}>
                    <TouchableOpacity disabled={disabled} onPress={this.command.bind(this,'fermer')}>
                        <Text style={[styles.button,{backgroundColor: disabled?LIGHT_GRAY:ORANGE}]}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    containerOffline:{
        flex: 6,
        flexDirection:"column",
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        flex:1.5,
    },
    close:{
        flex:1.5,
    },
    titre:{
        fontSize:35,
        color:ORANGE,

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
    settingsLoading:{
        maxWidth: 100,
        maxHeight: 100,
        marginBottom:35
    },
    textLoading:{
        fontSize:20,
        color:"white",
        marginBottom:35
    },
    settingsView:{
        paddingTop:Constants.statusBarHeight,
        flex:0.4,
        padding:0
    },
    touchable:{
        maxHeight:50,
        maxWidth:50
    },
    status:{
        flex:1
    },
    statusTitle:{
        color:"white",
        fontWeight:"bold",
        fontSize:27
    },
    statusText:{
        fontSize:25
    }

});
