const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const logger = require("../libraries/log/logger");
const schema = require("./config.schema");

class Config {
  constructor() {
    if (!Config.instance) {
      logger.info("Loading and validating config for the first time...");
      this.config = this.loadAndValidateConfig();
      Config.instance = this;
      logger.info("Config loaded and validated");
    }

    return Config.instance;
  }

  loadAndValidateConfig() {
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

    const sharedConfigFile = path.join(__dirname, "config.shared.json");
    if (fs.existsSync(sharedConfigFile)) {
      const sharedConfig = JSON.parse(fs.readFileSync(sharedConfigFile));
      config = { ...sharedConfig, ...config };
    }

    const finalConfig = {};
    for (const key in schema.describe().keys) {
      if (process.env.hasOwnProperty(key)) {
        finalConfig[key] = process.env[key]; // Prioritize environment variables
      } else if (config.hasOwnProperty(key)) {
        finalConfig[key] = config[key]; // Fallback to config file value
      }
    }

    // 4. load the schema file
    if (!schema) {
      throw new Error(`Schema file not found`);
    }

    const { error, value: validatedConfig } = schema.validate(finalConfig);
    if (error) {
      const missingProperties = error.details.map((detail) => detail.path[0]);
      throw new Error(
        `Config validation error: missing properties ${missingProperties}`,
      );
    }
    return validatedConfig;
  }

  static getInstance() {
    if (!Config.instance) {
      new Config();
    }
    return Config.instance;
  }
}

module.exports = Config.getInstance().config;
