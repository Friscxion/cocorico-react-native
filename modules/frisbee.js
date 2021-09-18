import Frisbee from "frisbee";

const PORT = "3000";
const frisbee=new Frisbee({
    //baseURI: "http://raspberrypi:"+PORT+"/"
    baseURI: "http://192.168.1.16:"+PORT+"/"
});


module.exports=frisbee;
