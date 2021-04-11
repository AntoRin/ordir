const initialize = require("./init");

const version = "1.1.0";

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
   ];

   const flagMap = {
      version: ["-v", "--version"],
      help: ["-h", "--help"],
      options: ["-y", "--yes", "-t", "--target", "-e", "--exclude"],
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

      process.stdout.write("Options: ");
      for (let flag in flagMap) {
         flagMap[flag].forEach(option => process.stdout.write(` [${option}] `));
      }

      console.log(
         "\n\nIf you pass in the -y flag, you won't get to choose what directories you want relevant files to be moved in. If there are directories with the same names as defaults, relevant files will be moved accordingly.\n\n"
      );
      process.exit(0);
   }

   if (flag) {
      if (allFlags.includes(flag) || flag.match(/-y\D|-\Dy/)) {
         flagMap.version.includes(flag) && showVersion();
         flagMap.help.includes(flag) && showHelp();
         flagMap.options.includes(flag) && initialize();
         flag.match(/-y\D|-\Dy/) && initialize();
      } else {
         console.log("\n\nUnknown option:", flag);
         showHelp();
      }
   } else initialize();
}

module.exports = beginInterface;
