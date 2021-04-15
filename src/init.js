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
            name: "audio",
            message: "Name of the directory you wish to use for Audio files:",
            default: "Audio",
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
         {
            type: String,
            name: "code",
            message: "Name of the directory you wish to use for Code:",
            default: "Code",
         },
         {
            type: String,
            name: "database",
            message:
               "Name of the directory you wish to use for Database files:",
            default: "Database",
         },
         {
            type: String,
            name: "font",
            message: "Name of the directory you wish to use for Font files:",
            default: "Font",
         },
         {
            type: String,
            name: "misc",
            message:
               "Name of the directory you wish to use for miscellaneous files:",
            default: "Misc",
         },
      ]);
      return customDirectories;
   } catch (error) {
      console.log(error);
      process.exit(0);
   }
}

async function initialize() {
   try {
      let directory = process.cwd();

      let flag = process.argv[2]?.toLowerCase();

      let folders = {
         documents: "Documents",
         images: "Images",
         audio: "Audio",
         videos: "Videos",
         programs: "Programs",
         archives: "Archives",
         styles: "Styles",
         code: "Code",
         database: "Database",
         font: "Font",
         misc: "Misc",
      };

      let targets = [];
      let exclusions = [];
      let specialDirectoryInstance = false;
      let specialDirectory = null;

      if (
         flag === "-t" ||
         flag === "--target" ||
         flag === "-ty" ||
         flag === "-yt"
      ) {
         let [argv1, argv2, thisFlag, ...requiredTargets] = process.argv;
         if (
            requiredTargets.length > 1 &&
            !requiredTargets[requiredTargets.length - 1].startsWith(".")
         ) {
            specialDirectory = requiredTargets.splice(
               requiredTargets.length - 1,
               1
            )[0];
         }
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
         if (
            requiredExclusions.length > 1 &&
            !requiredExclusions[requiredExclusions.length - 1].startsWith(".")
         ) {
            specialDirectory = requiredExclusions.splice(
               requiredExclusions.length - 1,
               1
            )[0];
         }
         exclusions = requiredExclusions.map(extension =>
            extension.toLowerCase()
         );
         let invalidExtension = exclusions.find(
            extension => extension[0] !== "."
         );
         if (invalidExtension) handleError("Invalid extension");
      }

      if (
         flag !== "-y" &&
         flag !== "--yes" &&
         !flag?.match(/^-y\D$|^-\Dy$/) &&
         !specialDirectory
      ) {
         let customFolderNames = await getCustomDetails();
         folders = customFolderNames;
      }

      let folderMap = {
         [folders["documents"]]: false,
         [folders["images"]]: false,
         [folders["audio"]]: false,
         [folders["videos"]]: false,
         [folders["programs"]]: false,
         [folders["archives"]]: false,
         [folders["styles"]]: false,
         [folders["code"]]: false,
         [folders["database"]]: false,
         [folders["font"]]: false,
         [folders["misc"]]: false,
      };

      let filesAndDirs = fs.readdirSync(directory);
      let allFiles = [];

      for (let file of filesAndDirs) {
         let filePath = path.join(directory, file);
         let stat = fs.statSync(filePath);
         let fileName = path.basename(filePath);

         if (stat.isDirectory()) {
            if (fileName in folderMap) folderMap[fileName] = true;
            if (fileName === specialDirectory) specialDirectoryInstance = true;
         } else if (stat.isFile()) {
            allFiles.push(file);
         }
      }

      for (let file of allFiles) {
         let filePath = path.join(directory, file);
         let stat = fs.statSync(filePath);
         let ext = path.extname(file).toLowerCase();
         let fileName = path.basename(filePath);

         if (stat.isDirectory()) continue;

         if (targets.length > 0) {
            if (targets.includes(ext)) {
               if (specialDirectory) {
                  if (specialDirectoryInstance) {
                     fs.renameSync(
                        filePath,
                        path.join(directory, specialDirectory, fileName)
                     );
                     continue;
                  } else {
                     fs.mkdirSync(path.join(directory, specialDirectory));
                     specialDirectoryInstance = true;
                     fs.renameSync(
                        filePath,
                        path.join(directory, specialDirectory, fileName)
                     );
                     continue;
                  }
               }
            } else continue;
         }

         if (exclusions.length > 0) {
            if (!exclusions.includes(ext)) {
               if (specialDirectory) {
                  if (specialDirectoryInstance) {
                     fs.renameSync(
                        filePath,
                        path.join(directory, specialDirectory, fileName)
                     );
                     continue;
                  } else {
                     fs.mkdirSync(path.join(directory, specialDirectory));
                     specialDirectoryInstance = true;
                     fs.renameSync(
                        filePath,
                        path.join(directory, specialDirectory, fileName)
                     );
                     continue;
                  }
               }
            } else {
               continue;
            }
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
               case ".odt":
               case ".wpd":
               case ".xlsm":
               case ".odt":
               case ".xls":
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
               case ".ai":
               case ".bmp":
               case ".gif":
               case ".ico":
               case ".ps":
               case ".psd":
               case ".tif":
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
               case ".mp3":
               case ".wav":
               case ".wma":
               case ".aac":
               case ".flac":
               case ".aif":
               case ".cda":
               case ".ogg":
               case ".wpl":
               case ".mid":
               case ".midi":
               case ".mpa":
                  if (folderMap[folders.audio]) {
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.audio, fileName)
                     );
                  } else {
                     fs.mkdirSync(path.join(directory, folders.audio));
                     folderMap[folders.audio] = true;
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.audio, fileName)
                     );
                  }
                  break;
               case ".mp4":
               case ".mov":
               case ".wmv":
               case ".avi":
               case ".flv":
               case ".mkv":
               case ".3g2":
               case ".3gp":
               case ".h264":
               case ".m4v":
               case ".mpg":
               case ".rm":
               case ".swf":
               case ".vob":
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
               case ".apk":
               case ".bat":
               case ".bin":
               case ".cgi":
               case ".com":
               case ".gadget":
               case ".msi":
               case ".wsf":
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
               case ".7z":
               case ".tar":
               case ".deb":
               case ".arj":
               case ".pkg":
               case ".rpm":
               case ".tar.gz":
               case ".z":
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
                  break;
               case ".html":
               case ".js":
               case ".jsx":
               case ".java":
               case ".py":
               case ".vue":
               case ".jar":
               case ".c":
               case ".cgi":
               case ".class":
               case ".cpp":
               case ".cs":
               case ".h":
               case ".php":
               case ".py":
               case ".sh":
               case ".swift":
               case ".vb":
                  if (folderMap[folders.code]) {
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.code, fileName)
                     );
                  } else {
                     fs.mkdirSync(path.join(directory, folders.code));
                     folderMap[folders.code] = true;
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.code, fileName)
                     );
                  }
                  break;
               case ".csv":
               case ".dat":
               case ".db":
               case ".log":
               case ".mdb":
               case ".sav":
               case ".sql":
               case ".tar":
               case ".xml":
                  if (folderMap[folders.database]) {
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.database, fileName)
                     );
                  } else {
                     fs.mkdirSync(path.join(directory, folders.database));
                     folderMap[folders.database] = true;
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.database, fileName)
                     );
                  }
                  break;
               case ".fnt":
               case ".fon":
               case ".otf":
               case ".ttf":
                  if (folderMap[folders.font]) {
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.font, fileName)
                     );
                  } else {
                     fs.mkdirSync(path.join(directory, folders.font));
                     folderMap[folders.font] = true;
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.font, fileName)
                     );
                  }
                  break;
               default:
                  if (folderMap[folders.misc]) {
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.misc, fileName)
                     );
                  } else {
                     fs.mkdirSync(path.join(directory, folders.misc));
                     folderMap[folders.misc] = true;
                     fs.renameSync(
                        filePath,
                        path.join(directory, folders.misc, fileName)
                     );
                  }
                  break;
            }
         }
      }

      console.log(
         "✨✨A clean working directory is always something to be happy about🎆🎆"
      );
      process.exit(0);
   } catch (error) {
      handleError(
         "Encountered an error. Could be because this program does not have the right permissions to move files around. 😫"
      );
   }
}

module.exports = initialize;
