const path = require("path");
const minimist = require("minimist");
const { showHelp } = require("./utils/help");
const pkg = require("../package.json");
const initialize = require("./init");

const version = pkg.version;

function showVersion() {
   console.info(version);
   process.exit(0);
}

function main() {
   try {
      const parsedArgs = minimist(process.argv.slice(2), {
         boolean: ["version", "help", "yes"],
         alias: {
            v: "version",
            h: "help",
            y: "yes",
            t: "target",
            e: "exclude",
            d: "dest",
         },
      });

      if (parsedArgs.version) {
         showVersion();
         process.exit(0);
      } else if (parsedArgs.help) {
         showHelp();
         process.exit(0);
      } else {
         const params = [...parsedArgs._];

         const skipQuestions = !!parsedArgs.yes;

         const destPath = parsedArgs.dest || params.splice(-1)[0] || null;

         const targets = parsedArgs.target ? parsedArgs.target.split(",") : [];

         const exclusions = parsedArgs.exclude
            ? parsedArgs.exclude.split(",")
            : [];

         initialize({ skipQuestions, destPath, targets, exclusions });
      }
   } catch (error) {
      console.error(error);
      process.exit(1);
   }
}

module.exports = { main };
