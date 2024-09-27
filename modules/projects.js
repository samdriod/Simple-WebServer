const projectData = require("../data/projectData.json");
const secotorData = require("../data/sectorData.json");

let projects = [];

function Initialize() {
    projects = JSON.parse(JSON.stringify(projectData));

    let secMap = new Map();
    secotorData.forEach(sec => {
        secMap.set(sec.id, sec.sector_name);
    });

    projects.forEach(proj => {
        if (secMap.has(proj.sector_id)) {
            proj.sector = secMap.get(proj.sector_id);
        }
    });

    return Promise.resolve();
}

function getAllProjects() {
    return Promise.resolve(projects);
}

function getProjectById(projectId) {
    const matchedProj = projects.find(proj => proj.id === projectId);
    return matchedProj ? Promise.resolve(matchedProj) : Promise.reject(new Error("Unable to find requested project"));
}

function getProjectsBySector(sectorStr) {
    const matchedSec = projects.filter(proj =>
        proj.sector.toLowerCase().includes(sectorStr.toLowerCase())
        );
    return matchedSec.length != 0 ? Promise.resolve(matchedSec) : Promise.reject(new Error("Unable to find requested project"));
}

module.exports = {Initialize, getAllProjects, getProjectById, getProjectsBySector};
