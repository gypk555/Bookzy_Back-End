import ex from "express";
import pg from "pg";
import cors from "cors"
import bodyParser from "body-parser";

const app=ex();
const port=5542;


app.use(cors());
app.use(bodyParser.json());

const db=new pg.Client({
    user:"bookzy_users",
    host:"dpg-ctj4ut5svqrc738651ag-a",
    database:"bookzy_dcx8",
    password:"LC4ywvV0PyuhhijQormcx51gcMFt0C2G",
    port:5432,
});

db.connect();

app.post("/signup",async(req,res)=>{
    console.log("signup");
    var x="";
    let firstname=req.body.fname;
    let lastname=req.body.lname;
    let email=req.body.mail;
    let phoneNo=req.body.number
    let username=req.body.uname;
    let password=req.body.password;
    try{
        const data=await db.query("select * from user_details where username=$1",[username]); 
        const r=data.rows;   
        if(r.length==0){
                    await db.query("insert into user_details values ($1,$2,$3,$4,$5,$6)",[firstname,lastname,username,email,phoneNo,password]); 
                    res.send("successfully registered");
                    console.log("successfully registered");
        }else{
            x="Username already exists.Please choose different one";
            res.send(x);
            console.log(x);
        }
    }catch(err){
        x="error";
        console.log("in catch block "+err);
        res.send(x);
    }
    
});


app.post("/login", async (req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    var  x="";
    console.log(username);
    console.log(password);
    try{
        const data=await db.query("select * from user_details where username=$1",[username]); 
        const r=data.rows;
        
        if(r.length==0){
            x="Invalid Username";
        }
        else{
            // for( let i=0 ;i<r.length; i++){
            //     console.log(r[i]);
            // }
            if(r[0].password==password){
                x=r[0].username ;
            }
            else{
                x="Invalid Password";
            }
        }
    }
    catch(err){
        x="error during fetching from DB";
        console.log(err);
    }

    res.send(x);
});

app.post("/addToCart",async (req,res)=>{
    let username=req.body.username;
    let id=req.body.id;
    try{
        await db.query("insert into cart values($1,$2)",[username,id]);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});


app.post("/removeToCart",async (req,res)=>{
    let username=req.body.username;
    let id=req.body.id;
    try{
        await db.query("delete from cart where username=$1 and id=$2",[username,id]);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
});

app.listen(port,()=>{
    console.log("server running on "+port);
});




