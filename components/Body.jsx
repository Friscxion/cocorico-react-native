import React from "react";
import {ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import chicken from '../assets/chicken.png';
import settings from '../assets/settings.png';
import {GRAY, IPSTORE, LIGHT_GRAY, ORANGE, PORT} from "./constantes";
import Constants from 'expo-constants';
import {Settings} from "./Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ref = React.createRef();

export class Body extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            modal:false,
            request:false,
            status:""
        }
    }

    componentDidMount() {
       this.fetchStatus();
    }
    fetchStatus = ()=>{
        AsyncStorage.getItem(IPSTORE).then((ip) =>{
            if (ip===null) return;
            const query = 'http://'+ip+":"+PORT+'/status';
            fetch(query)
                .then(response => response.text())
                .then(resp => {
                    this.setState({status:resp})
                })
                .catch(error => {
                    this.setState({status:""})
                    console.error(error);
                });
        });
    }

    changeModal = ()=>{
        this.setState({modal:!this.state.modal});
        this.fetchStatus();
    }

    command= (type)=>{
        this.setState({request:true});

        AsyncStorage.getItem(IPSTORE).then((ip) =>{
            const query = 'http://'+ip+":"+PORT+'/'+type;
            let escape = false;
            fetch(query)
                .then(response => response.text())
                .then(resp => {
                    if (resp=='denied')escape=true;
                })
                .catch(error => {
                    escape=true;
                    //console.error(error);
                })
                .finally(()=>{
                    if(escape){
                        this.setState({request: false});
                        return;
                    }
                    this.refresh(ip);
            });
        });
    }
    refresh = (ip) =>{
        const query = 'http://'+ip+":"+PORT;
        fetch(query+'/pending')
            .then(response => response.text())
            .then(resp=> {
                if(resp==='denied'){
                    setTimeout(()=>{this.refresh(ip)},1000);
                }
                else{
                    this.setState({request:false})
                    fetch(query+'/status')
                        .then(response => response.text())
                        .then(resp => {
                            this.setState({status:resp})
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            })
            .catch(error => {
                console.error(error);
            });

    }
    getColor = ()=>{
        switch(this.state.status){
            case(""):
                return "gray";
            case("open"):
                return "green";
            case("closed"):
                return "red";
        }
    }
    getStatus = ()=>{
        switch(this.state.status){
            case(""):
                return "Inconnu";
            case("open"):
                return "Ouvert";
            case("closed"):
                return "Fermé";
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
                   <TouchableOpacity disabled={disabled} onPress={this.command.bind(this,'open')}>
                       <Text style={[styles.button,{backgroundColor: disabled?LIGHT_GRAY:ORANGE}]}>Ouvrir</Text>
                   </TouchableOpacity>
                </View>
                <View style={[styles.close,styles.flexCenter]}>
                    <TouchableOpacity disabled={disabled} onPress={this.command.bind(this,'close')}>
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
