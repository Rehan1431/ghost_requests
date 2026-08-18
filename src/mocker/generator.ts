// @ts-nocheck
import { faker } from '@faker-js/faker';
import { OpenAPIV3 } from 'openapi-types';

export function generateMockData(schema: OpenAPIV3.SchemaObject): any {
  if (!schema || !schema.type) {
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
        return faker.lorem.words(3);
    }
  }
  return faker.lorem.words(2);
}

function generateArray(schema: OpenAPIV3.SchemaObject): any[] {
  const items = (schema as any).items;
  if (!items) return [];

  const count = faker.number.int({ min: 2, max: 5 });
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateMockData(items));
  }
  return result;
}

function generateObject(schema: OpenAPIV3.SchemaObject): Record<string, any> {
  const result: Record<string, any> = {};
  if (!schema.properties) return result;

  for (const [key, propSchema] of Object.entries(schema.properties)) {
    result[key] = generateMockData(propSchema as OpenAPIV3.SchemaObject);
  }
  return result;
}
