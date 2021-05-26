import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import {GRAY, IPSTORE, ORANGE, PORT} from "./constantes";
import close from '../assets/close.png'

import Frisbee from "frisbee";

import AsyncStorage from "@react-native-async-storage/async-storage";



export class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            visible:false,
            value:"",
            sunrise:"",
            sunset:"",
            sunriseBonus:"",
            sunsetBonus:"",
            frisbee:null
        }
    }
    componentDidMount() {
        AsyncStorage.getItem(IPSTORE).then((ip)=>{
            this.setState({value:ip});
            const frisbee=new Frisbee({
                baseURI: 'http://'+ip+":"+PORT// optional
            });
            this.setState({frisbee:frisbee});
            this.state.frisbee.get('/sunrise_sunset')
                .then((res)=> {
                    let sunrise = res.body.sunrise;
                    let sunset= res.body.sunset;
                    sunrise = sunrise.split('T')[1].split('.')[0];
                    sunset = sunset.split('T')[1].split('.')[0];
                    this.setState({sunrise: sunrise, sunset: sunset})
                })
                .catch(console.error);;
            this.state.frisbee.get('/params')
                .then((res)=> {
                    let lever = res.body.lever+"";
                    let coucher= res.body.coucher+"";
                    this.setState({sunriseBonus: lever, sunsetBonus: coucher})
                })
                .catch(console.error);;
        })


    }

    escape= () => {
        this.props.body.changeModal();
    }

    onChangeInput = (text) => {
        AsyncStorage.setItem(IPSTORE,text);
        this.setState({value:text});
    }

    onChangeInputSunset = (text) =>{
        this.setState({sunsetBonus:text});
    }

    onChangeInputSunrise = (text) =>{
        this.setState({sunriseBonus:text});
    }
    componentWillUnmount() {
        const toPost = {lever:this.state.sunriseBonus,coucher:this.state.sunsetBonus}
        this.state.frisbee.post('/params',
            {
                body:toPost,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(resp=>console.log(resp.body))
            .catch(e=>console.log(e));
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
                <View style={styles.viewhorraire}>
                    <Text style={styles.ip}>
                        Coucher :
                    </Text>
                   <View style={styles.sunview}>
                       <TextInput editable={false} style={styles.inputsec} value={this.state.sunset}/>
                       <Text>+</Text>
                       <TextInput keyboardType = 'numeric' style={styles.inputtri} value={this.state.sunsetBonus} onChangeText={this.onChangeInputSunset}/>
                       <Text>min</Text>
                   </View>
                    <Text style={styles.ip}>
                        Lever :
                    </Text>
                    <View style={styles.sunview}>
                        <TextInput editable={false}  style={styles.inputsec} value={this.state.sunrise}/>
                        <Text>+</Text>
                        <TextInput keyboardType = 'numeric' style={styles.inputtri} value={this.state.sunriseBonus} onChangeText={this.onChangeInputSunrise}/>
                        <Text>min</Text>
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
    }
});
