/**
 * @locus Server and Client
 */
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';

class AutoCollection {
  constructor(collectionDef) {
    this.collectionName = collectionDef.collectionName;
    this.collection = new Mongo.Collection(this.collectionName);
    this.cursors = collectionDef.cursors;
    /**
     * This will be used to display and edit the data
     */
    this.schema = collectionDef.schema;
    /**
     * This is for internal meta data, eg. _createdBy, _createdAt, _updatedBy, _updatedAt etc
     * Make sure that the keys all get their value set by autoValue of make them optional
     */
    this.metaSchema = collectionDef.metaSchema;
    /**
     * This gets the Schema and the Meta Schema merged together
     */
    this.collection.attachSchema(
      new SimpleSchema({})
        .extend(collectionDef.schema)
        .extend(collectionDef.metaSchema),
    );
    /**
     * will be checked before any insert, update or remove
     */
    this.policyChecks = collectionDef.policyChecks;
    this.bridge = new SimpleSchema2Bridge({ schema: this.schema });
  }

  columns() {
    const { schema } = this;
    const schemaKeys = schema.objectKeys();
    const columns = schemaKeys.map((key) => {
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
        /* preProcessEditCellProps: (params) => {
          const modifier = { $set: { [params.field]: params.props.value } };
          let valid;
          try {
            this.collection.simpleSchema().validate(modifier, { modifier: true });
            valid = true;
          } catch (e) {
            valid = false;
          }
          return { ...params.props, error: !valid };
        }, */
        type: columnType,
        editable: true,
      };
    });
    return columns;
  }
}

export default AutoCollection;
