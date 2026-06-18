/**
 * Remove .next — fixes "Cannot find module './vendor-chunks/@sanity.js'"
 * when the dev server cache is out of sync after schema or dependency changes.
 */
const fs = require("fs");
const path = require("path");

const nextDir = path.resolve(__dirname, "..", ".next");

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next cache");
} else {
  console.log("No .next cache to remove");
}
