const fs = require('fs');
const execNative = require('child_process').exec;

const wait = (t) => {
    return new Promise((resolve) => setTimeout(() => { resolve() }, t));
};

const exec = async (cmd) => {
    return new Promise((resolve, reject) => {
        execNative(cmd, (error, stdout, stderr) => {
            if (error) {
                reject({error, stdout, stderr});
            } else {
                resolve({error, stdout, stderr});
            }
        });
    });
};

const writeFile = async (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
};

const readFile = async (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
};

const getFiles = (testFolder) => {
    return new Promise((resolve, reject) => {
        fs.readdir(testFolder, (err, files) => {
            resolve(files);
        })
    });
};

module.exports = {
    wait,
    writeFile,
    readFile,
    exec,
    getFiles,
};