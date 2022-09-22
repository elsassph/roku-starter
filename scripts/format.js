const yargs = require("yargs");
const fs = require("fs");
const glob = require("glob");

// options
const argv = yargs.option("write", {
  description: "save changes",
  type: "boolean",
  default: false,
}).argv;
const { write } = argv;

function formatBrs() {
  const { Formatter } = require("brighterscript-formatter");
  const formatter = new Formatter();

  const formattingOptions = JSON.parse(
    fs.readFileSync("bsfmt.json").toString()
  );
  const targets = ["src/**/*.brs"];

  targets.forEach((target) => {
    glob(target, (err, files) => {
      if (err) throw err;
      let total = 0;
      let counter = 0;
      files.forEach((file) => {
        total++;
        const src = fs.readFileSync(file).toString();
        const formatted = formatter.format(src, formattingOptions);
        if (src !== formatted) {
          counter++;
          if (write) {
            console.log("Reformat:", file);
            fs.writeFileSync(file, formatted);
          } else {
            console.log("Needs reformat:", file);
          }
        }
      });
      console.log("Processed files: ", counter, "of", total);
    });
  });
}

console.log(`Format BRS files`, write ? "(write)" : "(dry run)");
formatBrs();
