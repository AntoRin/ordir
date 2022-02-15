const { existsSync } = require("fs");
const { readdir, stat, mkdir, rename } = require("fs/promises");
const path = require("path");
const inquirer = require("inquirer");

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

function defaultDirs() {
   return {
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
}

async function initialize({ skipQuestions, destPath, targets, exclusions }) {
   try {
      const currentDirectory = process.cwd();

      const folders =
         skipQuestions || destPath
            ? { ...defaultDirs(), destOverride: destPath }
            : await getCustomDetails();

      let existingFolders = {};

      const directoryItems = await readdir(currentDirectory);

      let filesMovedCount = 0;

      const moveToDirectory = async (dirCategory, source, dest) => {
         if (existingFolders[dirCategory] === undefined) {
            const directoryPath = path.join(
               currentDirectory,
               folders[dirCategory]
            );
            if (!existsSync(directoryPath)) {
               await mkdir(directoryPath);
            }
         }
         existingFolders[dirCategory] = true;

         await rename(source, dest);

         filesMovedCount++;
      };

      for (const item of directoryItems) {
         const filePath = path.join(currentDirectory, item);
         const fileName = path.basename(filePath);
         const stats = await stat(filePath);

         if (stats.isDirectory()) continue;

         const extension = path.extname(fileName).toLowerCase();

         if (targets.length && !targets.includes(extension)) continue;
         if (exclusions.length && exclusions.includes(extension)) continue;

         if (destPath) {
            const destination = path.join(
               currentDirectory,
               folders.destOverride,
               fileName
            );
            await moveToDirectory("destOverride", filePath, destination);
            continue;
         }

         switch (extension) {
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
            case ".xls": {
               const destination = path.join(
                  currentDirectory,
                  folders.documents,
                  fileName
               );
               await moveToDirectory("documents", filePath, destination);
               break;
            }

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
            case ".tif": {
               const destination = path.join(
                  currentDirectory,
                  folders.images,
                  fileName
               );
               await moveToDirectory("images", filePath, destination);
               break;
            }
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
            case ".mpa": {
               const destination = path.join(
                  currentDirectory,
                  folders.audio,
                  fileName
               );
               await moveToDirectory("audio", filePath, destination);
               break;
            }
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
            case ".vob": {
               const destination = path.join(
                  currentDirectory,
                  folders.videos,
                  fileName
               );
               await moveToDirectory("videos", filePath, destination);
               break;
            }
            case ".exe":
            case ".apk":
            case ".bat":
            case ".bin":
            case ".cgi":
            case ".com":
            case ".gadget":
            case ".msi":
            case ".wsf": {
               const destination = path.join(
                  currentDirectory,
                  folders.programs,
                  fileName
               );
               await moveToDirectory("programs", filePath, destination);
               break;
            }
            case ".zip":
            case ".rar":
            case ".7z":
            case ".tar":
            case ".deb":
            case ".arj":
            case ".pkg":
            case ".rpm":
            case ".tar.gz":
            case ".z": {
               const destination = path.join(
                  currentDirectory,
                  folders.archives,
                  fileName
               );
               await moveToDirectory("archives", filePath, destination);
               break;
            }
            case ".css":
            case ".scss": {
               const destination = path.join(
                  currentDirectory,
                  folders.styles,
                  fileName
               );
               await moveToDirectory("styles", filePath, destination);
               break;
            }
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
            case ".vb": {
               const destination = path.join(
                  currentDirectory,
                  folders.code,
                  fileName
               );
               await moveToDirectory("code", filePath, destination);
               break;
            }
            case ".csv":
            case ".dat":
            case ".db":
            case ".log":
            case ".mdb":
            case ".sav":
            case ".sql":
            case ".tar":
            case ".xml": {
               const destination = path.join(
                  currentDirectory,
                  folders.database,
                  fileName
               );
               await moveToDirectory("database", filePath, destination);
               break;
            }
            case ".fnt":
            case ".fon":
            case ".otf":
            case ".ttf": {
               const destination = path.join(
                  currentDirectory,
                  folders.font,
                  fileName
               );
               await moveToDirectory("font", filePath, destination);
               break;
            }
            default: {
               const destination = path.join(
                  currentDirectory,
                  folders.misc,
                  fileName
               );
               await moveToDirectory("misc", filePath, destination);
               break;
            }
         }
      }

      console.info(`✨✨${filesMovedCount} files moved🎆🎆`);
      process.exit(0);
   } catch (error) {
      error.code === "EBUSY"
         ? console.error("File open in another program. Close and try again")
         : console.log(error);

      process.exit(1);
   }
}

module.exports = initialize;
