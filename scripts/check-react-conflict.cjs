const path = require("path");
const fs = require("fs");

const projectReact = path.resolve(__dirname, "..", "node_modules", "react", "package.json");
const parentReact = path.resolve(__dirname, "..", "..", "node_modules", "react", "package.json");

function readVersion(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")).version;
  } catch {
    return null;
  }
}

const projectVersion = readVersion(projectReact);
const parentVersion = readVersion(parentReact);

if (parentVersion && projectVersion && parentVersion !== projectVersion) {
  console.warn(
    [
      "",
      "⚠️  Conflicting React install detected outside this project:",
      `    ${path.dirname(parentReact)} (${parentVersion})`,
      `    Project React: ${projectVersion}`,
      "",
      "    This causes: Cannot read properties of null (reading 'useContext')",
      "",
      "    Fix: remove or rename C:\\Users\\91857\\Documents\\node_modules",
      "         (and Documents\\package-lock.json if unused), then restart dev.",
      "",
    ].join("\n"),
  );
}
