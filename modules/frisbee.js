import Frisbee from "frisbee";

const PORT = "3000";
const frisbee=new Frisbee({
    baseURI: "http://raspberrypi:"+PORT+"/"
});


module.exports=frisbee;
