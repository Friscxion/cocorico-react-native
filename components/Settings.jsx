import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import {GRAY, ORANGE} from "../modules/constantes";
import close from '../assets/close.png'

export class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.frisbee=require('../modules/frisbee');

        this.state={
            value:""
        }
    }
    componentDidMount() {
        this.frisbee.get('/sunset_sunrise')
            .then((res)=> {
                console.log(res.body)
                let sunrise = res.body.sunrise;
                let sunset= res.body.sunset;
                sunrise = sunrise.split('T')[1].split('.')[0];
                sunset = sunset.split('T')[1].split('.')[0];
                this.setState({
                    sunrise: sunrise,
                    sunset: sunset,
                    sunsetBonus:res.body.sunsetAdd+"",
                    sunsetAddon:res.body.sunsetAdd+"",
                    sunriseBonus:res.body.sunriseAdd+"",
                    sunriseAddon:res.body.sunriseAdd+""
                })
            })
            .catch(console.error);
    }
    socketSetup(){
        this.socket=require("../modules/cocorico-socket");
        this.socket.on("status",(arg)=>{
            console.log("Status : "+arg)
        })
        this.socket.on("data",(arg)=>{
            console.log("Data : " +arg)
        })

        this.socket.on("connected",(arg)=>{
            this.socket.emit("data",  (response) => {
                console.log(new Date(response.sunset).getHours(),new Date(response.sunset).getMinutes());
            });
            this.socket.emit("ouvrir")
        })

        this.socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }


    onChangeInputSunset = (text) =>{
        this.setState({sunsetBonus:text});
    }

    onChangeInputSunrise = (text) =>{
        this.setState({sunriseBonus:text});
    }

    componentWillUnmount() {
       if(this.state.sunriseBonus!==this.state.sunriseAddon)
           this.frisbee.post("/sunrise", {
               headers: {
                   'Content-Type': "application/json"
               },
               body: {
                   data: parseInt(this.state.sunriseBonus)
               }
           })
        if(this.state.sunsetBonus!==this.state.sunsetAddon)
            this.frisbee.post("/sunset", {
                headers: {
                    'Content-Type': "application/json"
                },
                body: {
                    data: parseInt(this.state.sunsetBonus)
                }
            })
    }

    render() {
        return (
            <View style={styles.modal}>
                <TouchableOpacity onPress={this.props.body.changeModal} style={styles.viewclose}>
                    <Image style={styles.close} source={close}/>
                </TouchableOpacity>
                <View style={styles.viewhorraire}>
                    <Text style={styles.ip}>
                        Coucher :
                    </Text>
                   <View style={styles.sunview}>
                       <TextInput editable={false} style={styles.inputsec} value={this.state.sunset}/>
                       <Text style={styles.white}>+</Text>
                       <TextInput editable={this.state.sunsetAddon?true:false}  keyboardType={'numeric'} style={styles.inputtri} value={this.state.sunsetBonus} onChangeText={this.onChangeInputSunset}/>
                       <Text style={styles.white}>min</Text>
                   </View>
                    <Text style={styles.ip}>
                        Lever :
                    </Text>
                    <View style={styles.sunview}>
                        <TextInput editable={false}  style={styles.inputsec} value={this.state.sunrise}/>
                        <Text style={styles.white}>+</Text>
                        <TextInput editable={this.state.sunriseAddon?true:false} keyboardType = 'numeric' style={styles.inputtri} value={this.state.sunriseBonus} onChangeText={this.onChangeInputSunrise}/>
                        <Text style={styles.white}>min</Text>
                    </View>
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
        flex:2
    },
    ip:{
        fontSize:30,
        color:"white"
    },
    input:{
        backgroundColor: ORANGE,
        color:"white",
        width:"60%",
        padding:10,
        margin:10,
        borderRadius:20,
        borderWidth:1
    },
    viewhorraire:{
        flex:4,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
    },
    sunview:{
        flex:3,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },
    inputsec:{
        backgroundColor: ORANGE,
        color:"white",
        padding:10,
        width:"40%",
        borderRadius:20,
        borderWidth:1,
        marginHorizontal:5
    },
    inputtri:{
        backgroundColor: ORANGE,
        color:"white",
        padding:10,
        width:"20%",
        borderRadius:20,
        borderWidth:1,
        marginHorizontal:5
    },
    white:{
        color:"white"
    }
});
