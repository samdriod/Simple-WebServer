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
const path = require("path");
const projectData = require("./modules/projects");

projectData.Initialize();

let app = express();
let HTTP_PORT = process.env.PORT || 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/views/about.html"));
});

app.get("/solutions/projects", async (req, res) => {
    try {
        if (req.query.sector === "Land%Sinks") {
            res.send(await projectData.getProjectsBySector("Land Sinks"));
          } else if (req.query.sector === "Industry") {
            res.send(await projectData.getProjectsBySector("Industry"));
          } else if (req.query.sector === "Transportation") {
            res.send(await projectData.getProjectsBySector("Transportation"));
          } else {
            res.send(await projectData.getAllProjects());
          }
    } catch (error) {
       res.status(404).send(error.message); 
    }
});

app.get("/solutions/projects/:id", async (req, res) => {
  try {
    res.send(await projectData.getProjectById(parseInt(req.params.id)));
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public/views/404.html"));
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening on ${HTTP_PORT}`);
});
