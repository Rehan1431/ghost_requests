import { getSpec } from './parser';
import { OpenAPIV3 } from 'openapi-types';

function openApiPathToRegex(openApiPath: string): RegExp {
  const regexString = openApiPath.replace(/{[^}]+}/g, '([^/]+)');
  return new RegExp(`^${regexString}/?$`);
}

export function findMatchingSchema(reqPath: string, method: string): OpenAPIV3.SchemaObject | null {
  const spec = getSpec() as OpenAPIV3.Document;
  
  if (!spec.paths) return null;

  const normalizedMethod = method.toLowerCase();

  for (const [pathStr, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;
    
    const regex = openApiPathToRegex(pathStr);
    
    if (regex.test(reqPath)) {
      const operation = (pathItem as any)[normalizedMethod] as OpenAPIV3.OperationObject;
      if (operation && operation.responses) {
        
        const response200 = operation.responses['200'] as OpenAPIV3.ResponseObject;
        
        if (response200 && response200.content && response200.content['application/json']) {
          return response200.content['application/json'].schema as OpenAPIV3.SchemaObject;
        }
      }
    }
  }

  return null;
}
