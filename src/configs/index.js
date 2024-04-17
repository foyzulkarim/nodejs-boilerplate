const dotenv = require("dotenv");
const fs = require("fs");

function loadAndValidateConfig(environment) {
  // Load environment variables (relative path goes one level up)
  const envPath = `../.env.${environment}`;
  if (!fs.existsSync(envPath)) {
    throw new Error(`Environment file not found: ${envPath}`);
  }

  // 2. Load config file
  const configFile = `config.${environment}.json`;
  if (!fs.existsSync(configFile)) {
    throw new Error(`Config file not found: ${configFile}`);
  }
  let config = JSON.parse(fs.readFileSync(configFile));

  // 3. Check for missing required values
  const missingParams = Object.entries(config)
    .filter(([key, obj]) => obj.required && !process.env[key] && !obj.value)
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

module.exports = loadAndValidateConfig;
