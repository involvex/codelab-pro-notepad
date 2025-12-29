/**
 * Configuration Management for CodeLab Pro
 * Supports .codelabrc.json, environment variables, and CLI arguments
 */

import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  server: {
    port: 3000,
    host: '0.0.0.0',
    maxAge: 31536000, // Cache duration in seconds (1 year)
  },
  editor: {
    defaultTheme: 'dracula',
    defaultLanguage: 'javascript',
    fontSize: 14,
    tabSize: 2,
    wordWrap: false,
    lineNumbers: true,
    minimap: true,
    autoSave: false,
    autoSaveDelay: 1000, // milliseconds
  },
  plugins: {
    enabled: true,
    autoLoad: true,
    directory: './plugins',
  },
  security: {
    allowRemotePlugins: false,
    trustedDomains: [],
  },
};

/**
 * Load configuration from file, environment, and CLI args
 */
export function loadConfig(rootDir) {
  let config = { ...DEFAULT_CONFIG };

  // 1. Load from .codelabrc.json if it exists
  const configPath = join(rootDir, '.codelabrc.json');
  if (existsSync(configPath)) {
    try {
      const fileContent = readFileSync(configPath, 'utf8');
      const fileConfig = JSON.parse(fileContent);
      config = mergeDeep(config, fileConfig);
      console.log(`✓ Loaded config from ${configPath}`);
    } catch (error) {
      console.warn(`⚠ Failed to load config file: ${error.message}`);
    }
  }

  // 2. Override with environment variables
  if (process.env.CODELAB_PORT) {
    config.server.port = parseInt(process.env.CODELAB_PORT, 10);
  }
  if (process.env.CODELAB_HOST) {
    config.server.host = process.env.CODELAB_HOST;
  }
  if (process.env.CODELAB_THEME) {
    config.editor.defaultTheme = process.env.CODELAB_THEME;
  }
  if (process.env.CODELAB_PLUGINS_DIR) {
    config.plugins.directory = process.env.CODELAB_PLUGINS_DIR;
  }

  // 3. Override with CLI arguments
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--port' || arg === '-p') {
      config.server.port = parseInt(args[++i], 10);
    } else if (arg === '--host' || arg === '-h') {
      config.server.host = args[++i];
    } else if (arg === '--theme') {
      config.editor.defaultTheme = args[++i];
    } else if (arg === '--no-plugins') {
      config.plugins.enabled = false;
    }
  }

  return config;
}

/**
 * Deep merge two objects
 */
function mergeDeep(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Create a default config file
 */
export function createDefaultConfig(rootDir) {
  const configPath = join(rootDir, '.codelabrc.json');

  if (existsSync(configPath)) {
    console.log(`Config file already exists: ${configPath}`);
    return false;
  }

  const content = JSON.stringify(DEFAULT_CONFIG, null, 2);

  try {
    writeFileSync(configPath, content, 'utf8');
    console.log(`✓ Created default config file: ${configPath}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to create config file: ${error.message}`);
    return false;
  }
}

/**
 * Display current configuration
 */
export function displayConfig(config) {
  console.log('\n📋 Current Configuration:\n');
  console.log('Server:');
  console.log(`  Port: ${config.server.port}`);
  console.log(`  Host: ${config.server.host}`);
  console.log(`  Cache Max-Age: ${config.server.maxAge}s`);
  console.log('\nEditor:');
  console.log(`  Theme: ${config.editor.defaultTheme}`);
  console.log(`  Language: ${config.editor.defaultLanguage}`);
  console.log(`  Font Size: ${config.editor.fontSize}px`);
  console.log(`  Tab Size: ${config.editor.tabSize}`);
  console.log(`  Word Wrap: ${config.editor.wordWrap}`);
  console.log(`  Line Numbers: ${config.editor.lineNumbers}`);
  console.log('\nPlugins:');
  console.log(`  Enabled: ${config.plugins.enabled}`);
  console.log(`  Auto-load: ${config.plugins.autoLoad}`);
  console.log(`  Directory: ${config.plugins.directory}`);
  console.log('');
}
