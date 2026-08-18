import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';

// Store the dereferenced OpenAPI document in memory
let parsedSpec: OpenAPI.Document | null = null;

/**
 * Loads, validates, and dereferences the OpenAPI specification file.
 * Dereferencing resolves all $refs so that the generator has a complete schema.
 * 
 * @param path Path to the YAML or JSON OpenAPI spec file.
 */
export async function loadSpec(path: string): Promise<void> {
  // We cast to OpenAPI.Document because SwaggerParser.dereference can return various types
  parsedSpec = await SwaggerParser.dereference(path) as OpenAPI.Document;
  
  const title = parsedSpec.info?.title || 'Unknown API';
  const version = parsedSpec.info?.version || 'unknown version';
  console.log(`[Ghost-Environment] OpenAPI spec loaded: ${title} (v${version})`);
}

export const initParser = loadSpec;

/**
 * Retrieves the loaded OpenAPI specification.
 * Throws an error if called before the spec is loaded.
 */
export function getSpec(): OpenAPI.Document {
  if (!parsedSpec) {
    throw new Error('OpenAPI spec is not loaded yet');
  }
  return parsedSpec;
}
