/*********************************************************************************
 * BTI325 – Assignment 5
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Samip Karki Student      ID: 141867234      Date: 2024/19/01
 * Published URL: https://climatesolutions.vercel.app/
 * URL maybe subject to change please pull from github and check the README for latest URL
 ********************************************************************************/
const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

require("dotenv").config();
require("pg");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

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
    if (Object.keys(req.query).length === 0) {
      data = await projectData.getAllProjects();
    } else if (req.query.sector === "Land Sinks") {
      data = await projectData.getProjectsBySector("Land Sinks");
    } else if (req.query.sector === "Industry") {
      data = await projectData.getProjectsBySector("Industry");
    } else if (req.query.sector === "Transportation") {
      data = await projectData.getProjectsBySector("Transportation");
    } else {
      throw new Error("Invalid sector");
    }
    res.render(path.join(__dirname, "/public/views/projects.ejs"), {
      projects: data,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).render(path.join(__dirname, "public/views/404.ejs"), {
      message: `No projects found for sector: ${req.query.sector}.`,
    });
  }
});

app.get("/solutions/projects/:id", async (req, res) => {
  try {
    let data = await projectData.getProjectById(parseInt(req.params.id));
    res.render(path.join(__dirname, "/public/views/project.ejs"), {
      project: data,
    });
  } catch (error) {
    res.status(404).render(path.join(__dirname, "public/views/404.ejs"), {
      message: "Unable to find requested project.",
    });
  }
});

app.use((req, res, next) => {
  res.render(path.join(__dirname, "public/views/404.ejs"), {
    message: "I'm sorry, we're unable to find what you're looking for.",
  });
});

projectData
  .Initialize()
  .then((message) => {
    console.log("Data loaded");
    app.listen(HTTP_PORT, () => {
      console.log(`Listening on ${HTTP_PORT}`);
    });
  })
  .catch((error) => console.error(`Data not loaded, Error: ${error.message}`));
