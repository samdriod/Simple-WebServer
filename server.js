/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Samip Karki Student      ID: 141867234      Date: 2024/09/27
* Published URL: https://simple-web-server-one.vercel.app/
********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");

projectData.Initialize();

let app = express();
let HTTP_PORT = process.env.PORT || 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Assignment 2: Samip Kari - 141867234");
});

app.get("/solutions/projects", async (req, res) => {
    res.send(await projectData.getAllProjects());
});

app.get("/solutions/projects/id-demo", async (req, res) => {
    try {
        res.send(await projectData.getProjectById(1));
        // res.send(await projectData.getProjectById(100)); // invalid id
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/solutions/projects/sector-demo", async (req, res) => {
    try {
        res.send(await projectData.getProjectsBySector("Agriculture"));
        // res.send(await projectData.getProjectsBySector("Game")); // invalid sector
    } catch (error) {
        res.status(404).send(error.message);
    }
});


app.listen(HTTP_PORT, () => {
    console.log(`hello from ${HTTP_PORT}`)
});

