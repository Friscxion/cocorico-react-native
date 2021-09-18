import React from "react";
import {ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
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
            status:"unknow"
        }
        this.socketSetup();
    }

    socketSetup(){
        this.socket=require("../modules/cocorico-socket");

        this.socket.on("status",(arg)=>{
            this.setState({status:arg})
        })
        this.socket.on("data",(arg)=>{
            console.log("Data : " +arg)
        })

        this.socket.on("connected",(arg)=>{
            this.socket.emit("data",  (response) => {
                console.log(new Date(response.sunset).getHours(),new Date(response.sunset).getMinutes());
            });
        })

        this.socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

    }

    changeModal = () => this.setState({modal:!this.state.modal});

    command= (type)=>{
        this.socket.emit(type)
    }
    refresh = () =>{
        let networkPromise = this.frisbee.get('/pending');
        let timeOutPromise = new Promise(function(resolve, reject) {
            setTimeout(resolve, 3000, 'Timeout Done');
        });
        let component = this;
        Promise.all([networkPromise, timeOutPromise])
            .then(function(value) {
                if(value[0].body==='denied')
                    component.refresh()
                else{
                    component.setState({request:false})
                    component.frisbee.get('/status')
                        .then((value)=>component.setState({status:value.body}))
                        .catch(console.error);
                }
        });
    }

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
                return ["Action en cours ",
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
        const disabled=this.state.request;
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
                    {this.state.request?<ActivityIndicator size={50} color={ORANGE} />:null}
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
    settingsView:{
        paddingTop:Constants.statusBarHeight+10,
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
