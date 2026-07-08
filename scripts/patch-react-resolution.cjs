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

const projectRoot = path.resolve(__dirname, "..");
const originalNodeModulePaths = Module._nodeModulePaths;

Module._nodeModulePaths = function (from) {
  const paths = originalNodeModulePaths.call(this, from);
  return paths.filter(p => {
    const resolvedPath = path.resolve(p);
    const relative = path.relative(projectRoot, resolvedPath);
    return !relative.startsWith("..");
  });
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
