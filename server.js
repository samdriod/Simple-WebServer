/*********************************************************************************
 * BTI325 – Assignment 4
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Samip Karki Student      ID: 141867234      Date: 2024/09/27
 * Published URL: https://climatesolutions.vercel.app/
 * URL maybe subject to change please pull from github and check the README for latest URL
 ********************************************************************************/
const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

projectData.Initialize();

let app = express();
let HTTP_PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public/views"));

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "/public/views/home.ejs"));
});

app.get("/about", (req, res) => {
  res.render(path.join(__dirname, "/public/views/about.ejs"));
});

app.get("/solutions/projects", async (req, res) => {
  try {
    let data;
    if (req.query.sector === "Land Sinks") {
      data = await projectData.getProjectsBySector("Land Sinks");
    } else if (req.query.sector === "Industry") {
      data = await projectData.getProjectsBySector("Industry");
    } else if (req.query.sector === "Transportation") {
      data = await projectData.getProjectsBySector("Transportation");
    } else {
      data = await projectData.getAllProjects();
    }
    res.render(path.join(__dirname, "/public/views/projects.ejs"), {
      projects: data,
    });
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
  res.render(path.join(__dirname, "public/views/404.ejs"));
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening on ${HTTP_PORT}`);
});
