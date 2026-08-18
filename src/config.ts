/**
 * Configuration variables for Ghost-Environment.
 * These can be overridden using environment variables.
 */
export const PORT = process.env.PORT || 3000;
export const TARGET_URL = process.env.TARGET_URL || 'http://localhost:8080';
export const SPEC_PATH = process.env.SPEC_PATH || './sample-spec.yaml';

export const config = {
  PORT,
  TARGET_URL,
  SPEC_PATH
};
