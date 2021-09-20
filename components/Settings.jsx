import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import {GRAY, ORANGE} from "../modules/constantes";
import close from '../assets/close.png'

export class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.frisbee=require('../modules/frisbee');

        this.state={
            value:"",
            mounted:false
        }
    }
    componentDidMount() {
        this.setState({mounted:true});
        this.socketSetup();
    }
    componentWillUnmount() {
        this.state.mounted=false;
    }


    socketSetup(){
        this.socket=require("../modules/cocorico-socket");
        this.socket.on("data",(response)=>{
            console.log(this.state.mounted)
            if(!this.state.mounted)
                return;
            this.setData(response);
        })
        this.socket.emit("data",  this.setData)
    }

    setData = (response)=>{
        this.setState({
            sunrise: new Date(response.sunrise).toTimeString().split(" ")[0],
            sunset: new Date(response.sunset).toTimeString().split(" ")[0],
            sunsetBonus:response.set_addon+"",
            sunsetAddon:response.set_addon+"",
            sunriseBonus:response.rise_addon+"",
            sunriseAddon:response.rise_addon+""
        })
    }


    onChangeInputSunset = (text) => this.setState({sunsetBonus:text});

    onChangeInputSunrise = (text) => this.setState({sunriseBonus:text});

    save = () => {
        if(this.state.sunriseBonus!==this.state.sunriseAddon)
            this.socket.emit("setRiseAddon", this.state.sunriseBonus);
        if(this.state.sunsetBonus!==this.state.sunsetAddon)
            this.socket.emit("setSetAddon",this.state.sunsetBonus);
        this.props.body.changeModal();
    }

    render() {
        return (
            <View style={styles.modal}>
                <View style={{flexDirection:"row",justifyContent:"space-between",flex:0.5}}>
                    <TouchableOpacity onPress={this.save}>
                        <Image style={styles.close} source={close}/>
                    </TouchableOpacity>
                </View>
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
