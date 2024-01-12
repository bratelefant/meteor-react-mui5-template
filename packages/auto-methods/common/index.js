/**
 * @locus Server and Client
 */
import { Mongo } from 'meteor/mongo';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';

class AutoCollection {
  constructor(collectionDef) {
    this.collectionName = collectionDef.collectionName;
    this.collection = new Mongo.Collection(this.collectionName);
    this.schema = collectionDef.schema;
    this.collection.attachSchema(collectionDef.schema);
    this.policyChecks = collectionDef.policyChecks;
    this.bridge = new SimpleSchema2Bridge({ schema: this.schema });
  }

  columns() {
    const schema = this.collection.simpleSchema();
    const schemaKeys = schema.objectKeys();
    const columns = schemaKeys.map((key) => {
      const def = schema.getDefinition(key);
      let columnType;
      const type = schema.getDefinition(key).type[0]?.type;

      switch (type) {
        case Boolean:
          columnType = 'boolean';
          break;
        case Date:
          columnType = 'date';
          break;
        case String:
          columnType = 'string';
          break;
        case Number:
          columnType = 'numeric';
          break;
        default:
          columnType = 'string';
      }
      return {
        field: key,
        headerName: schema.getDefinition(key).label,
        type: columnType,
        editable: true,
      };
    });
    return columns;
  }
}

export default AutoCollection;
