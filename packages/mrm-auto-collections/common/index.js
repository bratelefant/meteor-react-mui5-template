/**
 * @locus Server and Client
 */
import i18next from 'i18next';
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
     * This will be used to display the data.
     * You can add keys and value schemas like this:
     * column.label: 'My Label',
     */
    this.locales = collectionDef.locales;
    /**
     * will be checked before any insert, update or remove
     */
    this.policyChecks = collectionDef.policyChecks;
    this.bridge = new SimpleSchema2Bridge({ schema: this.schema });
  }

  columns() {
    // Client only, only for DataGrid definition
    if (Meteor.isServer) return undefined;
    const { schema } = this;
    const schemaKeys = schema.objectKeys();
    const columns = schemaKeys.map((key) => {
      let columnType;
      const type = schema.getDefinition(key).type[0]?.type;
      let valueOptions;

      switch (type) {
        case Boolean:
          columnType = 'boolean';
          break;
        case Date:
          columnType = 'dateTime';
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
      if (schema.getDefinition(key).type[0]?.allowedValues) {
        columnType = 'singleSelect';
        valueOptions = schema.getDefinition(key).type[0]?.allowedValues;
      }
      return {
        field: key,
        headerName: this.locales
          ? i18next.t(`column.${schema.getDefinition(key).label}`, {
            ns: 'bratelefant_mrm-auto-collections',
          })
          : schema.getDefinition(key).label,
        type: columnType,
        minWidth: 100,
        flex: 1,
        valueOptions,
        editable: true,
      };
    });
    return columns;
  }
}

export default AutoCollection;
