import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

/**
 * Intercept incoming HTTP requests and match them against the spec.
 */
export function handleMockRequest(req: Request, res: Response, apiSpec: any) {
  const reqPath = req.path;
  const method = req.method.toLowerCase();
  
  const schema = findMatchingSchema(reqPath, method, apiSpec);

  if (schema) {
    const mockData = generateMockData(schema);
    res.status(200).json(mockData);
  } else {
    res.status(404).json({ error: `No OpenAPI 200 response schema found for ${req.method} ${reqPath}` });
  }
}

function findMatchingSchema(reqPath: string, method: string, apiSpec: any): any | null {
  if (!apiSpec.paths) return null;

  for (const [pathStr, pathItem] of Object.entries(apiSpec.paths)) {
    if (!pathItem) continue;

    // Convert OpenAPI path like /users/{id} to regex
    const regexString = pathStr.replace(/{[^}]+}/g, '([^/]+)');
    const regex = new RegExp(`^${regexString}/?$`);

    if (regex.test(reqPath)) {
      const operation = (pathItem as any)[method];
      if (operation && operation.responses) {
        const response200 = operation.responses['200'];
        if (response200 && response200.content && response200.content['application/json']) {
          return response200.content['application/json'].schema;
        }
      }
    }
  }
  return null;
}

/**
 * Recursive generator using faker.
 */
function generateMockData(schema: any, propertyName?: string): any {
  if (!schema || !schema.type) {
    return faker.lorem.word();
  }

  switch (schema.type) {
    case 'string':
      // Smart guessing based on property name
      if (propertyName) {
        const lower = propertyName.toLowerCase();
        if (lower.includes('email')) return faker.internet.email();
        if (lower.includes('name')) {
          if (lower.includes('first')) return faker.person.firstName();
          if (lower.includes('last')) return faker.person.lastName();
          return faker.person.fullName();
        }
        if (lower.includes('uuid') || lower.includes('id')) return faker.string.uuid();
        if (lower.includes('url')) return faker.internet.url();
      }
      return faker.lorem.words(2);
    case 'number':
    case 'integer':
      if (propertyName && propertyName.toLowerCase().includes('age')) {
        return faker.number.int({ min: 18, max: 99 });
      }
      return faker.number.int({ min: 1, max: 1000 });
    case 'boolean':
      return faker.datatype.boolean();
    case 'array':
      const items = schema.items;
      if (!items) return [];
      const count = faker.number.int({ min: 2, max: 5 });
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(generateMockData(items));
      }
      return result;
    case 'object':
      const objResult: Record<string, any> = {};
      if (!schema.properties) return objResult;
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        objResult[key] = generateMockData(propSchema, key);
      }
      return objResult;
    default:
      return null;
  }
}
