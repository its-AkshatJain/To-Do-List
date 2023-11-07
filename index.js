import express from "express";
import bodyParser from "body-parser";

const app=express();
const port= 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var tasks=[];
var works=[];

// For Today Page
app.get("/",(req,res)=>{
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    var date=today.toLocaleDateString("en-US", options);

    res.render("today.ejs",{
        currentDate : date,
        dataOfTask: tasks
    });
})

// For Work Page
app.get("/work",(req,res)=>{
    res.render("work.ejs",{
        dataOfWork: works
    });
})

// For Today Page
app.post("/",(req,res)=>{
    var dataToday= req.body["task"];
    tasks.push(dataToday);

    res.redirect("/");
})

// For Work Page
app.post("/work",(req,res)=>{
    var dataWork= req.body["work"];
    works.push(dataWork);

    res.redirect("/work");
})

app.listen(port,()=>{
    console.log(`Listening on the port ${port}`)
})