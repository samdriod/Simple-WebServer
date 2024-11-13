// const projectData = require("../data/projectData.json");
// const sectorData = require("../data/sectorData.json");

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

const Sector = sequelize.define(
  "Sector",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sector_name: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: Sequelize.STRING,
    feature_img_url: Sequelize.STRING,
    summary_short: Sequelize.TEXT,
    intro_short: Sequelize.TEXT,
    impact: Sequelize.TEXT,
    original_source_url: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Sector.hasMany(Project, {foreignKey: "sector_id"});
Project.belongsTo(Sector, { foreignKey: "sector_id" });

function Initialize() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getAllProjects() {
  return Promise.resolve(projects);
}

function getProjectById(projectId) {
  const matchedProj = projects.find((proj) => proj.id === projectId);
  return matchedProj
    ? Promise.resolve(matchedProj)
    : Promise.reject(new Error("Unable to find requested project"));
}

function getProjectsBySector(sectorStr) {
  const matchedSec = projects.filter((proj) =>
    proj.sector.toLowerCase().includes(sectorStr.toLowerCase())
  );
  return matchedSec.length != 0
    ? Promise.resolve(matchedSec)
    : Promise.reject(new Error("Unable to find requested project"));
}

module.exports = {
  Initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
};
// sequelize
//   .sync()
//   .then(async () => {
//     try {
//       await Sector.bulkCreate(sectorData);
//       await Project.bulkCreate(projectData);

//       await sequelize.query(
//         `SELECT setval(pg_get_serial_sequence('"Sectors"', 'id'), (SELECT MAX(id) FROM "Sectors"))`
//       );
//       await sequelize.query(
//         `SELECT setval(pg_get_serial_sequence('"Projects"', 'id'), (SELECT MAX(id) FROM "Projects"))`
//       );

//       console.log("-----");
//       console.log("data inserted successfully");
//     } catch (err) {
//       console.log("-----");
//       console.log(err.message);
//     }

//     process.exit();
//   })
//   .catch((err) => {
//     console.log("Unable to connect to the database:", err);
//   });
