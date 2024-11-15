/*********************************************************************************
 * BTI325 – Assignment 5
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Samip Karki Student      ID: 141867234      Date: 2024/10/15
 * Published URL: https://simple-web-server-iota.vercel.app/
 * URL maybe subject to change please pull from github and check the README for latest URL
 ********************************************************************************/
const express = require("express");
const path = require("path");
const projects = require("./modules/projects");
const exp = require("constants");

async function main() {
  await projects.Initialize();

  let app = express();
  let HTTP_PORT = process.env.PORT || 3000;

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
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
        data = await projects.getAllProjects();
      } else if (req.query.sector === "Land Sinks") {
        data = await projects.getProjectsBySector("Land Sinks");
      } else if (req.query.sector === "Industry") {
        data = await projects.getProjectsBySector("Industry");
      } else if (req.query.sector === "Transportation") {
        data = await projects.getProjectsBySector("Transportation");
      } else if (req.query.sector === "Electricity") {
        data = await projects.getProjectsBySector("Electricity");
      } else if (req.query.sector === "Food, Agriculture, and Land Use") {
        data = await projects.getProjectsBySector(
          "Food, Agriculture, and Land Use"
        );
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
      let data = await projects.getProjectById(parseInt(req.params.id));
      res.render(path.join(__dirname, "/public/views/project.ejs"), {
        project: data,
      });
    } catch (error) {
      res.status(404).render(path.join(__dirname, "public/views/404.ejs"), {
        message: "Unable to find requested project.",
      });
    }
  });

  app.get("/solutions/addProject", async (req, res) => {
    const sectorData = await projects.getAllSectors();
    res.render(path.join(__dirname, "/public/views/addProject.ejs"), {
      sectors: sectorData,
    });
  });

  app.post("/solutions/addProject", async (req, res) => {
    try {
      await projects.addProject(req.body);
      res.redirect(303, "/solutions/projects");
    } catch (error) {
      res.render(path.join(__dirname, "/public/views/500.ejs"), {
        message: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    }
  });

  app.get("/solutions/editProject/:id", async (req, res) => {
    try {
      const proj = await projects.getProjectById(req.params.id);
      const sectorData = await projects.getAllSectors();
      res.render(path.join(__dirname, "/public/views/editProject.ejs"), {
        sectors: sectorData,
        project: proj,
      });
    } catch (error) {
      res.render(path.join(__dirname, "/public/views/404.ejs"), {
        message: error,
      });
    }
  });

  app.post("/solutions/editProject", async (req, res) => {
    try {
      await projects.editProject(req.body.id, req.body);
      res.redirect(303, "/solutions/projects");
    } catch (error) {
      res.render(path.join(__dirname, "/public/views/500.ejs"), {
        message: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    }
  });

  app.get("/solutions/deleteProject/:id", async (req, res) => {
    try {
      await projects.deleteProject(req.params.id);
      res.redirect(303, "/solutions/projects");
    } catch (error) {
      res.render(path.join(__dirname, "/public/views/500.ejs"), {
        message: `I'm sorry, but we have encountered the following error: ${error}`,
      });
    }
  });

  app.use((req, res, next) => {
    res.render(path.join(__dirname, "public/views/404.ejs"), {
      message: "So sorry, we're unable to find what you're looking for.",
    });
  });

  app.listen(HTTP_PORT, () => {
    console.log(`Listening on ${HTTP_PORT}`);
  });
}

try {
  main().then(() =>
    console.log(`
--------------------------
Main Execution Successful.
--------------------------
  `)
  );
} catch (error) {
  console.error(`Encountered error: ${error.message}`);
}
