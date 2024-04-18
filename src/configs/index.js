const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

function loadAndValidateConfig() {
  const environment = process.env.NODE_ENV || "development";

  // 1. Load environment file from one level up and using __dirname
  const envFile = `.env.${environment}`;
  const envPath = path.join(__dirname, "..", envFile);
  if (!fs.existsSync(envPath)) {
    throw new Error(`Environment file not found: ${envPath}`);
  }
  dotenv.config({ path: envPath });

  // 2. Load config file based on environment
  // Construct the path to the config file
  const configFile = path.join(__dirname, `config.${environment}.json`);

  // Check if the file exists before trying to read it
  if (!fs.existsSync(configFile)) {
    throw new Error(`Config file not found: ${configFile}`);
  }

  let config = JSON.parse(fs.readFileSync(configFile));

  // 3. Check for missing required values
  const missingParams = Object.entries(config)
    .filter(([key, obj]) => {
      return obj.required && !process.env[key] && !obj.value;
    })
    .map(([key, obj]) => key);

  if (missingParams.length > 0) {
    throw new Error(
      `Missing required configuration values: ${missingParams.join(", ")}`,
    );
  }

  // 4. Prepare final config (prioritize env vars)
  for (const [key, obj] of Object.entries(config)) {
    config[key] = process.env[key] || obj.value;
  }

  return config;
}

module.exports = { config: loadAndValidateConfig() };
