import React from "react";
import {ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import chicken from '../assets/chicken.png';
import settings from '../assets/settings.png';
import {IPSTORE, LIGHT_GRAY, ORANGE, PORT} from "./constantes";
import Constants from 'expo-constants';
import {Settings} from "./Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Frisbee from "frisbee";



export class Body extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            modal:false,
            request:false,
            status:"",
            frisbee:null
        }
    }

    componentDidMount() {
       this.fetchStatus();
    }

    fetchStatus = ()=>{
        AsyncStorage.getItem(IPSTORE).then((ip) =>{
            if (ip===null) return;
            const frisbee=new Frisbee({
                baseURI: 'http://'+ip+":"+PORT// optional
            });
            this.setState({frisbee:frisbee});
            // this is a simple example using `.then` and `.catch`
            this.state.frisbee.get('/status')
                .then((res)=>this.setState({status:res.body}))
                .catch(console.error);
        });
    }

    changeModal = ()=>{
        this.setState({modal:!this.state.modal});
        if(this.state.modal){
            this.fetchStatus();
        }

    }

    command= (type)=>{
        this.setState({request:true});
        let escape = false;
        this.state.frisbee.get('/'+type)
            .then((res)=> {
                if (res.body==='denied')escape=true;
            })
            .catch((error)=>{
                escape=true
            }) .finally(()=>{
                if(escape){
                    this.setState({request: false});
                    return;
                }
                this.refresh();
            });
    }
    refresh = () =>{
        let networkPromise = this.state.frisbee.get('/pending');
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
                    component.state.frisbee.get('/status')
                        .then((value)=>component.setState({status:value.body}))
                        .catch(console.error);
                }
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
