import * as fs from "fs";
import * as path from "path";

const ASSETS_DIR = path.resolve(__dirname, "../../src/assets/promises");
console.log("ASSETS_DIR resolved to:", ASSETS_DIR);
if (fs.existsSync(ASSETS_DIR)) {
  console.log("Directory exists! Contents:");
  console.log(fs.readdirSync(ASSETS_DIR));
} else {
  console.log("Directory does NOT exist!");
}
