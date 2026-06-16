const path = require("path");
const Module = require("module");

const projectNodeModules = path.resolve(__dirname, "..", "node_modules");
const blockedParentReact = path.resolve(
  __dirname,
  "..",
  "..",
  "node_modules",
  "react",
);

Module._nodeModulePaths = function () {
  return [projectNodeModules];
};

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  const forceProject = (req) =>
    originalResolveFilename.call(
      this,
      req,
      { filename: path.join(projectNodeModules, ".keep"), paths: [projectNodeModules] },
      isMain,
      options,
    );

  if (
    request === "react" ||
    request === "react-dom" ||
    request.startsWith("react/") ||
    request.startsWith("react-dom/")
  ) {
    return forceProject(request);
  }

  const resolved = originalResolveFilename.call(
    this,
    request,
    parent,
    isMain,
    options,
  );

  if (typeof resolved === "string" && resolved.startsWith(blockedParentReact)) {
    return forceProject(request);
  }

  return resolved;
};

process.env.NODE_PATH = projectNodeModules;
