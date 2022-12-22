const express = require("express");
const bodyParser = require("body-parser");
 // does request and https needded anymore?
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
//require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// allow server to pull static page from my local files system
app.use(express.static("public"));

mailchimp.setConfig({
    //apiKey: process.env.API_KEY,
    apiKey: API_KEY,
    server: "us21", 
});


app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const listID = "52f2baf610";
    
    async function addMember() {
        const response = await mailchimp.lists.addListMember(listID, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }).then(
            (value) => {
                console.log("Successfully added contact as an audience member.");
                //console.log(value);
                res.sendFile(__dirname + "/success.html");
            },
            (reason) => {
                console.log(reason);
                res.sendFile(__dirname + "/failure.html");
            },
        );
    }
    addMember();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});


// token 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


// outdated code:

    // const data = {
    //         members: [
    //             {
    //                 email_adress: email,
    //                 status: "subscribed",
    //                 merge_fields: {
    //                     FNAME: firstName,
    //                     LNAME: lastName
    //                 }
    //             },
    //         ]
    //     };
    //     // turn JS to flatpack json
    //     const jsonData = JSON.stringify(data);
    
    //     const url = "https://us21.api.mailchimp.com/3.0/lists/52f2baf610";
    //     const options = {
    //         method: "POST",
    //         auth: "Hawa:f42e0dd2f20ee51f9c417f98ea0e7cf5-us21"
    //     }
       
    //     const request = https.request(url, options, (response) => {
    //         response.on("data", (data) => {
    //             console.log(JSON.parse(data));
    //         });
    //     });
    
    //     request.write(jsonData);
    //     request.end();


    
