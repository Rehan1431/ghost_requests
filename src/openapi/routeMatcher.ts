import { getSpec } from './parser';
import { OpenAPIV3 } from 'openapi-types';

/**
 * Converts an OpenAPI path template into a regular expression.
 * Example: "/users/{id}" -> /^/users/([^/]+)/?$/
 * 
 * @param openApiPath The OpenAPI path string containing parameters.
 * @returns A RegExp that can test against incoming request paths.
 */
function openApiPathToRegex(openApiPath: string): RegExp {
  // Replace path parameters like {id} with a regex group capturing anything but a slash
  const regexString = openApiPath.replace(/{[^}]+}/g, '([^/]+)');
  // Ensure we match from start to end, optionally allowing a trailing slash
  return new RegExp(`^${regexString}/?$`);
}

/**
 * Matches an incoming request path and method to an OpenAPI schema for a 200 response.
 * 
 * @param reqPath The path from the incoming request (e.g. /api/users/123)
 * @param method The HTTP method from the incoming request (e.g. GET)
 * @returns The SchemaObject for the 200 response, or null if no match is found.
 */
export function findMatchingSchema(reqPath: string, method: string): OpenAPIV3.SchemaObject | null {
  const spec = getSpec() as OpenAPIV3.Document;
  
  // If the spec has no paths defined, we can't match anything
  if (!spec.paths) return null;

  const normalizedMethod = method.toLowerCase();

  // Iterate over all paths defined in the OpenAPI spec
  for (const [pathStr, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;
    
    const regex = openApiPathToRegex(pathStr);
    
    // Check if the incoming request path matches the regex for this OpenAPI path
    if (regex.test(reqPath)) {
      // Check if the path supports the requested HTTP method
      const operation = (pathItem as any)[normalizedMethod] as OpenAPIV3.OperationObject;
      if (operation && operation.responses) {
        
        // We only care about mocking successful (200) responses for now
        const response200 = operation.responses['200'] as OpenAPIV3.ResponseObject;
        
        if (response200 && response200.content && response200.content['application/json']) {
          // Return the schema for the application/json content type
          return response200.content['application/json'].schema as OpenAPIV3.SchemaObject;
        }
      }
    }
  }

  return null; // No matching path/method found
}
