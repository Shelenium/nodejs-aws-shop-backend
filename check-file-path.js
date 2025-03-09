const fs = require("fs");
const path = require("path");

try {
  const props = {
    sourcePath: "./dist/assets",
    exclude: [],
    extraHash: "custom-hash",
  };

  // Resolve path and prepare options
  const resolvedPath = path.resolve(__dirname, props.sourcePath);
  const fingerprintOptions = {
    ...props,
    exclude: [".is_custom_resource", ...(props.exclude ?? [])],
    extraHash: props.extraHash ? `${props.extraHash}` : undefined,
  };

  console.log("Resolved Path:", resolvedPath);
  console.log("Fingerprint Options:", fingerprintOptions);

  // Check if the source path exists
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Cannot find asset at ${resolvedPath}`);
  }

  console.log("File exists at path:", resolvedPath);
} catch (err) {
  console.error(err.message);
}
