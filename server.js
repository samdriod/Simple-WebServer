const express = require("express");
const projectData = require("./modules/projects");

projectData.Initialize();

console

let app = express();
let HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Assignment 2: Samip Kari - 141867234");
});

app.get("/solutions/projects", async (req, res) => {
    res.send(await projectData.getAllProjects());
});

app.get("/solutions/projects/id-demo", async (req, res) => {
    try {
        res.send(await projectData.getProjectById(100));
    } catch (error) {
        res.send(error.message);
    }
});

app.get("/solutions/projects/sector-demo", async (req, res) => {
    try {
        res.send(await projectData.getProjectsBySector("Agriculture"));
    } catch (error) {
        res.send(error.message);
    }
});


app.listen(HTTP_PORT, () => {
    console.log(`hello from ${HTTP_PORT}`)
});

