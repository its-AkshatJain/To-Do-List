import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";


const app=express();
const port= 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.connect("mongodb+srv://admin-akshat:akshat1234@cluster0.8s1y9cq.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
    name : String,
})
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to the To Do list",
})
const item2 = new Item({
    name: "Hit + to add items",
})
const item3 = new Item({
    name: " <-- Hit this to delete items",
})

const defaultValues  = [item1,item2,item3];

const listSchema = new mongoose.Schema({
    name: String,
    items:[itemsSchema],
})
const List = mongoose.model("List", listSchema);

// For Today Page
//For current date
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var date=today.toLocaleDateString("en-US", options);
app.get("/",(req,res)=>{

    Item.find().then((result)=>{
        if(result.length === 0){
            Item.insertMany(defaultValues).then((result)=>{
                console.log(result);
            }).catch((errror)=>{
                console.error("error");
            });
            // res.redirect("/");
        }else{
            res.render("today.ejs",{
                currentDate : date,
                dataOfTask: result
            });
        }
    }).catch((error)=>{
        console.error(error);
    })
})

app.get("/:customListName", (req,res)=>{
    // console.log(req.params.customListName);
    const customListName = _.capitalize(req.params.customListName);

    //Using FindOne
    List.findOne({name : customListName}).then((foundList)=>{
        if(!foundList){
            // console.log("Does not exist");
            //create new list
            const list = new List({
                name : customListName,
                items: defaultValues
            }); 
            list.save();
            res.redirect("/" + customListName);
        }
        else{
            // console.log("Exist");
            res.render("list.ejs",{
                listTitle : foundList.name,
                newListItem: foundList.items,
            });
        }
    // Using Find
    // List.find({name : customListName}).then((foundList)=>{
    //     if(foundList.length === 0){
    //         // console.log("Does not exist");
    //         //create new list
    //         const list = new List({
    //             name : customListName,
    //             items: defaultValues
    //         }); 
    //         list.save();
    //         res.redirect("/" + customListName);
    //     }
    //     else{
    //         // console.log("Exist");
    //         res.render("list.ejs",{
    //             listTitle : foundList[0].name,
    //             newListItem: foundList[0].items,
    //         });
    //     }
    }).catch((error)=>{
        console.error(error);
    })
})




// For Today Page
app.post("/",(req,res)=>{
    // var dataToday= req.body["newItem"];
    // newItem.push(dataToday);

    // console.log(req.body);
    // console.log(req.body.list);
    // console.log(req.body.newItem);
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName,
    });
    if(listName === date){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name : listName}).then((foundList)=>{
            // console.log(foundList);
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
})

app.post("/delete", (req,res)=>{
    // console.log(req.body.taskCompleted);
    const checkedBoxID = req.body.taskCompleted; 
    const listName =req.body.list;

    if(listName === date){
        // Item.deleteOne({_id: checkedBoxID});
        Item.findByIdAndDelete(checkedBoxID).then((result)=>{
            // console.log(result);
            res.redirect("/");
        }).catch((error)=>{
            console.error(error);
        });
    }else{
                                  //  condition, updates 
        List.findOneAndUpdate({name : listName},{$pull: {items : {_id : checkedBoxID}}}).then((foundList)=>{
            res.redirect("/" + listName);
        }).catch((error)=>{
            console.error(error);
        })
    }
    
})

app.listen(port,()=>{
    console.log(`Listening on the port ${port}`)
})