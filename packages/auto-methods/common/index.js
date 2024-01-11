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
      const type = schema.getDefinition(key).type.name;
      let columnType;
      switch (type) {
        case 'String':
          columnType = 'text';
          break;
        case 'Number':
          columnType = 'numeric';
          break;
        case 'Date':
          columnType = 'date';
          break;
        default:
          columnType = 'text';
      }
      return {
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        type: columnType,
      };
    });
    return columns;
  }
}

export default AutoCollection;
