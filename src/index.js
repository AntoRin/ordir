#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

let directory = process.cwd();

let folderMap = {
    Documents: false,
    Images: false,
    Videos: false,
    Programs: false,
    Archives: false,
};

let files = fs.readdirSync(directory);

for (let file of files) {
    let filePath = path.join(directory, file);
    let stat = fs.statSync(filePath);
    let fileName = path.basename(filePath);

    if (stat.isDirectory()) {
        if (fileName in  folderMap)
            folderMap[fileName] = true;
    }
}

for (let file of files) {
    let filePath = path.join(directory, file);
    let stat = fs.statSync(filePath);
    let ext = path.extname(file).toLocaleLowerCase();
    let fileName = path.basename(filePath);

    if (stat.isDirectory()) {
        if (fileName in  folderMap)
            folderMap[fileName] = true;
    }

    if (stat.isFile()) {

        switch (ext) {
            case ".txt":
            case ".docx":
            case ".doc":
            case ".pdf":
            case ".ppt":
            case ".pptx":
            case ".xlsx":
                if (folderMap.Documents) {
                    fs.renameSync(filePath, path.join(directory, "Documents", fileName));
                } else {
                    fs.mkdirSync(path.join(directory, "Documents"));
                    folderMap.Documents = true;
                    fs.renameSync(filePath, path.join(directory, "Documents", fileName));
                }
                break;
            case ".jpg":
            case ".JPG":
            case ".jpeg":
            case ".png":
            case ".svg":
                if (folderMap.Images) {
                    fs.renameSync(filePath, path.join(directory, "Images", fileName));
                } else {
                    fs.mkdirSync(path.join(directory, "Images"));
                    folderMap.Images = true;
                    fs.renameSync(filePath, path.join(directory, "Images", fileName));
                }
                break;
            case ".mp4":
            case ".mov":
            case ".wmv":
            case "avi":
            case ".flv":
            case ".mkv":
                if (folderMap.Videos) {
                    fs.renameSync(filePath, path.join(directory, "Videos", fileName));
                } else {
                    fs.mkdirSync(path.join(directory, "Videos"));
                    folderMap.Videos = true;
                    fs.renameSync(filePath, path.join(directory, "Videos", fileName));
                }
                break;
            case ".exe":
                if (folderMap.Programs) {
                    fs.renameSync(filePath, path.join(directory, "Programs", fileName));
                } else {
                    fs.mkdirSync(path.join(directory, "Programs"));
                    folderMap.Programs = true;
                    fs.renameSync(filePath, path.join(directory, "Programs", fileName));
                }
                break;
            case ".zip":
            case ".rar":
                if (folderMap.Archives) {
                    fs.renameSync(filePath, path.join(directory, "Archives", fileName));
                } else {
                    fs.mkdirSync(path.join(directory, "Archives"));
                    folderMap.Archives = true;
                    fs.renameSync(filePath, path.join(directory, "Archives", fileName));
                }
                break;
        }
    }
}

console.log("Jordan B. Peterson is proud!✔👍");