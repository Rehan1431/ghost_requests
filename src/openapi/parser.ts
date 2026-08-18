import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';

let parsedSpec: OpenAPI.Document | null = null;

export async function loadSpec(path: string): Promise<void> {
  parsedSpec = await SwaggerParser.dereference(path) as OpenAPI.Document;
  
  const title = parsedSpec.info?.title || 'Unknown API';
  const version = parsedSpec.info?.version || 'unknown version';
  console.log(`[Ghost-Environment] OpenAPI spec loaded: ${title} (v${version})`);
}

export const initParser = loadSpec;

export function getSpec(): OpenAPI.Document {
  if (!parsedSpec) {
    throw new Error('OpenAPI spec is not loaded yet');
  }
  return parsedSpec;
}
