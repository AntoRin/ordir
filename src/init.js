const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { handleError } = require("./utils/errorHandler");

async function getCustomDetails() {
   console.info(
      "Note: if you had chosen to exclude/target specific extensions, the preferences other than the required ones do not take effect"
   );
   try {
      let customDirectories = await inquirer.prompt([
         {
            type: String,
            name: "documents",
            message: "Name of the directory you wish to use for Documents:",
            default: "Documents",
         },
         {
            type: String,
            name: "images",
            message: "Name of the directory you wish to use for Images:",
            default: "Images",
         },
         {
            type: String,
            name: "videos",
            message: "Name of the directory you wish to use for Videos:",
            default: "Videos",
         },
         {
            type: String,
            name: "programs",
            message: "Name of the directory you wish to use for Programs:",
            default: "Programs",
         },
         {
            type: String,
            name: "archives",
            message: "Name of the directory you wish to use for Archives:",
            default: "Archives",
         },
         {
            type: String,
            name: "styles",
            message: "Name of the directory you wish to use for Styles:",
            default: "Styles",
         },
      ]);
      return customDirectories;
   } catch (error) {
      console.log(error);
      process.exit(0);
   }
}

async function initialize() {
   let directory = process.cwd();

   let flag = process.argv[2]?.toLowerCase();

   let folders = {
      documents: "Documents",
      images: "Images",
      videos: "Videos",
      programs: "Programs",
      archives: "Archives",
      styles: "Styles",
   };

   let targets = [];
   let exclusions = [];

   if (
      flag === "-t" ||
      flag === "--target" ||
      flag === "-ty" ||
      flag === "-yt"
   ) {
      let [argv1, argv2, thisFlag, ...requiredTargets] = process.argv;
      targets = requiredTargets.map(extension => extension.toLowerCase());
      let invalidExtension = targets.find(extension => extension[0] !== ".");
      if (invalidExtension) handleError("Invalid extension");
   }

   if (
      flag === "-e" ||
      flag === "--exclude" ||
      flag === "-ey" ||
      flag === "-ye"
   ) {
      let [argv1, argv2, thisFlag, ...requiredExclusions] = process.argv;
      exclusions = requiredExclusions.map(extension => extension.toLowerCase());
      let invalidExtension = exclusions.find(extension => extension[0] !== ".");
      if (invalidExtension) handleError("Invalid extension");
   }

   if (flag !== "-y" && flag !== "--yes" && !flag?.match(/^-y\D$|^-\Dy$/)) {
      let customFolderNames = await getCustomDetails();
      folders = customFolderNames;
   }

   let folderMap = {
      [folders["documents"]]: false,
      [folders["images"]]: false,
      [folders["videos"]]: false,
      [folders["programs"]]: false,
      [folders["archives"]]: false,
      [folders["styles"]]: false,
   };

   let files = fs.readdirSync(directory);

   for (let file of files) {
      let filePath = path.join(directory, file);
      let stat = fs.statSync(filePath);
      let fileName = path.basename(filePath);

      if (stat.isDirectory()) {
         if (fileName in folderMap) folderMap[fileName] = true;
      }
   }

   for (let file of files) {
      let filePath = path.join(directory, file);
      let stat = fs.statSync(filePath);
      let ext = path.extname(file).toLowerCase();
      let fileName = path.basename(filePath);

      if (targets.length > 0) {
         if (!targets.includes(ext)) continue;
      }

      if (exclusions.length > 0) {
         if (exclusions.includes(ext)) continue;
      }

      if (stat.isDirectory()) {
         if (fileName in folderMap) folderMap[fileName] = true;
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
               if (folderMap[folders.documents]) {
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.documents, fileName)
                  );
               } else {
                  fs.mkdirSync(path.join(directory, folders.documents));
                  folderMap[folders.documents] = true;
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.documents, fileName)
                  );
               }
               break;
            case ".jpg":
            case ".jpeg":
            case ".png":
            case ".svg":
               if (folderMap[folders.images]) {
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.images, fileName)
                  );
               } else {
                  fs.mkdirSync(path.join(directory, folders.images));
                  folderMap[folders.images] = true;
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.images, fileName)
                  );
               }
               break;
            case ".mp4":
            case ".mov":
            case ".wmv":
            case ".avi":
            case ".flv":
            case ".mkv":
               if (folderMap[folders.videos]) {
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.videos, fileName)
                  );
               } else {
                  fs.mkdirSync(path.join(directory, folders.videos));
                  folderMap[folders.videos] = true;
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.videos, fileName)
                  );
               }
               break;
            case ".exe":
               if (folderMap[folders.programs]) {
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.programs, fileName)
                  );
               } else {
                  fs.mkdirSync(path.join(directory, folders.programs));
                  folderMap[folders.programs] = true;
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.programs, fileName)
                  );
               }
               break;
            case ".zip":
            case ".rar":
               if (folderMap[folders.archives]) {
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.archives, fileName)
                  );
               } else {
                  fs.mkdirSync(path.join(directory, folders.archives));
                  folderMap[folders.archives] = true;
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.archives, fileName)
                  );
               }
               break;
            case ".css":
            case ".scss":
               if (folderMap[folders.styles]) {
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.styles, fileName)
                  );
               } else {
                  fs.mkdirSync(path.join(directory, folders.styles));
                  folderMap[folders.styles] = true;
                  fs.renameSync(
                     filePath,
                     path.join(directory, folders.styles, fileName)
                  );
               }
         }
      }
   }

   console.log("✨✨Clean working directory is happiness🎆🎆");
   process.exit(0);
}

module.exports = initialize;
