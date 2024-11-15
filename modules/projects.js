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
  return sequelize.sync();
}

function getAllProjects() {
  return Project.findAll({ include: [Sector] });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    Project.findOne({
      include: [Sector],
      where: { id: projectId },
    })
      .then((project) => {
        if (project !== null) {
          resolve(project);
        } else {
          reject("Unable to find requested project");
        }
      })
      .catch((error) => reject(error));
  });
}

function getProjectsBySector(sectorStr) {
  return new Promise((resolve, reject) => {
    Project.findAll({
      include: [
        {
          model: Sector,
          where: { sector_name: { [Sequelize.Op.iLike]: `%${sectorStr}%` } },
        },
      ],
    })
      .then((projects) => {
        if (projects !== null) {
          resolve(projects);
        } else {
          reject("Unable to find requested projects");
        }
      })
      .catch((error) => reject(error));
  });
}

function addProject(projectData) {
  return new Promise(async (resolve, reject) => {
    Project.create(projectData)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error.errors[0].message);
      });

    // await sequelize.query(
    //   `SELECT setval(pg_get_serial_sequence('"Projects"', 'id'), (SELECT MAX(id) FROM "Projects"))`
    // );
  });
}

function getAllSectors() {
  return Sector.findAll({});
}

function editProject(id, projectData) {
  return new Promise((resolve, reject) => {
    Project.update(projectData, { where: { id: id } })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error.errors[0].message);
      });
  });
}

function deleteProject(id) {
  return new Promise((resolve, reject) => {
    Project.destroy({
      where: { id: id },
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error.errors[0].message);
      });
  });
}

module.exports = {
  Initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  addProject,
  getAllSectors,
  editProject,
  deleteProject,
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
