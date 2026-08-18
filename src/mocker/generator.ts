// @ts-nocheck
import { faker } from '@faker-js/faker';
import { OpenAPIV3 } from 'openapi-types';

/**
 * Recursively generates mock data based on an OpenAPI schema object.
 * @param schema The OpenAPI Schema Object to generate data for.
 * @returns The generated mock data (can be string, number, object, array, etc.).
 */
export function generateMockData(schema: OpenAPIV3.SchemaObject): any {
  if (!schema || !schema.type) {
    // If no type is specified, we'll just return a random word as a fallback.
    return faker.lorem.word();
  }

  switch (schema.type) {
    case 'string':
      return generateString(schema);
    case 'number':
    case 'integer':
      return faker.number.int({ min: 1, max: 1000 });
    case 'boolean':
      return faker.datatype.boolean();
    case 'array':
      return generateArray(schema);
    case 'object':
      return generateObject(schema);
    default:
      return null;
  }
}

/**
 * Handles string generation, taking into account common string formats.
 */
function generateString(schema: OpenAPIV3.SchemaObject): string {
  if (schema.format) {
    switch (schema.format) {
      case 'email':
        return faker.internet.email();
      case 'uuid':
        return faker.string.uuid();
      case 'date':
      case 'date-time':
        return faker.date.recent().toISOString();
      default:
        // For unknown formats, fall back to basic words
        return faker.lorem.words(3);
    }
  }
  // No format specified
  return faker.lorem.words(2);
}

/**
 * Handles array generation by generating between 2 and 5 items of the specified type.
 */
function generateArray(schema: OpenAPIV3.SchemaObject): any[] {
  // Using 'any' cast to bypass strict SchemaObject union constraints on 'items'
  const items = (schema as any).items;
  if (!items) return [];

  const count = faker.number.int({ min: 2, max: 5 });
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateMockData(items));
  }
  return result;
}

/**
 * Handles object generation by recursively generating mock data for each property.
 */
function generateObject(schema: OpenAPIV3.SchemaObject): Record<string, any> {
  const result: Record<string, any> = {};
  if (!schema.properties) return result;

  for (const [key, propSchema] of Object.entries(schema.properties)) {
    result[key] = generateMockData(propSchema as OpenAPIV3.SchemaObject);
  }
  return result;
}
