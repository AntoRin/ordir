function showHelp(flagMap) {
   console.log(
      "\n\n Use ordir to organize your current working directory by moving files into relevant folders.\n\n"
   );
   console.log("usage: ordir [<args>]\n\n");

   process.stdout.write("Options: ");
   for (let flag in flagMap) {
      flagMap[flag].forEach(option => process.stdout.write(` [${option}] `));
   }

   console.log(
      "\n\nHint: use the -t or --target flag to target files with a specific extension. Similarly, you can use the -e or --exclude flag to exclude files with a specific extension\n"
   );

   console.log(
      "\nBy default the files you target with -t try to find one of the default directories. If you want to override this behavior and want files with specific extensions to be placed in a file of your choice, specify the name of a directory by the end of the file list. This can be done with -e as well."
   );

   console.log(
      "\nYou can combine target or exclude with the -y flag to perform a specific action while skipping defaults: [-ty] or [-ey]\n"
   );

   console.log(
      "\n\nIf you pass in the -y flag, you won't get to choose what directories you want relevant files to be moved in. If there are directories with the same names as defaults, relevant files will be moved accordingly.\n\n"
   );
   process.exit(0);
}

module.exports = { showHelp };
