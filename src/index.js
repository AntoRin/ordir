#!/usr/bin/env node

const initialize = require("./init");

const version = "1.1.0";

const allFlags = ["-v", "--version", "-h", "--help", "-y", "--yes"];

const flagMap = {
   version: ["-v", "--version"],
   help: ["-h", "--help"],
   options: ["-y", "--yes"],
};

let flag = process.argv[2];

function showVersion() {
   console.info(version);
   process.exit(0);
}

function showHelp() {
   console.log(
      "\n\n Use ordir to organize your current working directory by moving files into relevant folders.\n\n"
   );
   console.log("usage: ordir [<args>]\n\n");
   for (flag in flagMap) {
      console.log(`${flag}: [${flagMap[flag][0]}] [${flagMap[flag][1]}]`);
   }

   console.log(
      "\n\nIf you pass in the -y flag, you won't get to choose what directories you want relevant files to be moved in. If there are directories with the same names as defaults, relevant files will be moved accordingly.\n\n"
   );
   process.exit(0);
}

if (flag) {
   if (allFlags.includes(flag)) {
      flagMap.version.includes(flag) && showVersion();
      flagMap.help.includes(flag) && showHelp();
   } else {
      console.log("Unknown option:", flag);
      showHelp();
   }
}

initialize();
