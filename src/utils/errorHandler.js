function handleError(error) {
   console.error(error);
   console.log("use [--help] to show help");
   process.exit(1);
}

module.exports = { handleError };
