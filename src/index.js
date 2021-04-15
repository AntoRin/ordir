const initialize = require("./init");
const { showHelp } = require("./utils/help");
const { handleError } = require("./utils/errorHandler");

const version = "1.3.6";

function beginInterface() {
   const allFlags = [
      "-v",
      "--version",
      "-h",
      "--help",
      "-y",
      "--yes",
      "-t",
      "--target",
      "-e",
      "--exclude",
      "-yt",
      "-ty",
      "-ye",
      "-ey",
   ];

   const flagMap = {
      version: ["-v", "--version"],
      help: ["-h", "--help"],
      options: [
         "-y",
         "--yes",
         "-t",
         "--target",
         "-e",
         "--exclude",
         "-yt",
         "-ty",
         "-ye",
         "-ey",
      ],
   };

   let flag = process.argv[2];

   function showVersion() {
      console.info(version);
      process.exit(0);
   }

   if (flag) {
      if (allFlags.includes(flag)) {
         flagMap.version.includes(flag) && showVersion();
         flagMap.help.includes(flag) && showHelp(flagMap);
         flagMap.options.includes(flag) && initialize();
      } else {
         handleError(`Unknown option: ${flag}`);
      }
   } else initialize();
}

module.exports = { beginInterface };
