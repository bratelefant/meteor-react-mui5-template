/**
 * @locus Server and Client
 */
import i18next from 'i18next';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';

/**
 * @class AutoCollection
 * @summary This class is used to define a collection that will be automatically created
 *  and managed by the package.
 * @example
 * const myCollection = new AutoCollection({
 *   collectionName: 'tasks',
 *   cursors: {
 *     default: {
 *       sel: () => ({ _createdBy: Meteor.userId() }),
 *       opt: () => ({
 *         fields: {
 *           _createdAt: 1, _createdBy: 1, completed: 1, dueDate: 1, title: 1, assignedTo: 1,
 *         },
 *         sort: { _createdAt: -1 },
 *       }),
 *     },
 *   },
 *   policyChecks: {
 *     insert: async () => Meteor.userId(),
 *     update: async ([selector], collection) => {
 *       const item = await collection.findOneAsync(selector);
 *       return Meteor.userId() && item?._createdBy === Meteor.userId();
 *     },
 *     remove: async ([selector], collection) => {
 *       const item = await collection.findOneAsync(selector);
 *       return Meteor.userId() && item?._createdBy === Meteor.userId() && !item?.completed;
 *     },
 *   },
 *   locales: {
 *     de: {
 *       column: {
 *         'Due Date': 'Fälligkeitsdatum',
 *         Completed: 'Erledigt',
 *         'Assigned To': 'Zugewiesen an',
 *         Title: 'Titel',
 *       },
 *       selectOptions: {
 *         me: 'Ich',
 *         team: 'Team',
 *         all: 'Alle',
 *         boss: 'Chef',
 *         someone: 'Jemand anderes',
 *       },
 *     },
 *     en: {
 *       column: {
 *         'Due Date': 'Due Date',
 *         Completed: 'Completed',
 *         'Assigned To': 'Assigned To',
 *         Title: 'Title',
 *       },
 *       selectOptions: {
 *         me: 'Me',
 *         team: 'Team',
 *         all: 'All',
 *         boss: 'Boss',
 *         someone: 'Someone else',
 *       },
 *     },
 *   },
 *   schema: new SimpleSchema({
 *     title: {
 *       type: String,
 *       label: 'Title',
 *       max: 200,
 *     },
 *     dueDate: {
 *       type: Date,
 *       label: 'Due Date',
 *       optional: true,
 *       defaultValue: (() => {
 *         const date = new Date();
 *         date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
 *         return date;
 *       })(),
 *       custom() {
 *         if (this.value && this.value < new Date() && this.isInsert) {
 *           return 'dueDateMustBeInTheFuture';
 *         }
 *         return undefined;
 *       },
 *     },
 *     assignedTo: {
 *       type: String,
 *       label: 'Assigned To',
 *       optional: true,
 *       allowedValues: ['me', 'team', 'all', 'boss', 'someone'],
 *     },
 *     completed: {
 *       type: Boolean,
 *       label: 'Completed',
 *       optional: true,
 *     },
 *   }),
 *   metaSchema: new SimpleSchema({
 *     _createdAt: {
 *       type: Date,
 *       label: 'Created At',
 *       autoValue() {
 *         if (this.isInsert) {
 *           return new Date();
 *         }
 *         return this.value;
 *       },
 *     },
 *     _createdBy: {
 *       type: String,
 *       label: 'Created By',
 *       autoValue() {
 *         if (this.isInsert) {
 *           return Meteor.userId();
 *         }
 *         return this.value;
 *       },
 *     },
 *     _updatedAt: {
 *       type: Date,
 *       label: 'Updated At',
 *       autoValue() {
 *         if (this.isUpdate || this.isInsert) {
 *           return new Date();
 *         }
 *         return undefined;
 *       },
 *     },
 *     _updatedBy: {
 *       type: String,
 *       label: 'Updated By',
 *       autoValue() {
 *         if (this.isUpdate || this.isInsert) {
 *           return Meteor.userId();
 *         }
 *         return undefined;
 *       },
 *     },
 * }),
 * };
 */
class AutoCollection {
  /**
   * @param {Object} collectionDef
   * @param {String} collectionDef.collectionName - The name of the collection
   * @param {Object} collectionDef.cursors - The cursors of the collection.
   * You can define multiple cursors. The default cursor is called 'default' and
   * must be present.
   * @param {Object} collectionDef.schema - The schema of the collection
   * @param {Object} collectionDef.metaSchema - The meta schema of the collection
   * @param {Object} collectionDef.locales - The locales of the collection
   * @param {Object} collectionDef.policyChecks - The policy checks of the collection
   * @param {Object} collectionDef.cursors - The cursors of the collection
   */
  constructor(collectionDef) {
    const singleCursorSchema = new SimpleSchema({
      sel: Function,
      opt: Function,
    });
    const cursorValidator = function validate() {
      const { value } = this;
      const values = Object.values(value);
      const keys = Object.keys(value);
      if (!keys.some((key) => key === 'default')) { return 'Cursor named "default" is missing.'; }
      try {
        singleCursorSchema.validate(values);
        return undefined;
      } catch (error) {
        return error.message;
      }
    };
    const checkSimpleSchema = function validate() {
      const { value } = this;
      if (!value) return undefined;
      if (!SimpleSchema.isSimpleSchema(value)) {
        return 'schema must be a SimpleSchema';
      }
      return undefined;
    };

    const policyChecksSchema = new SimpleSchema({
      insert: Function,
      update: Function,
      remove: Function,
    });

    const localesSchemaPerLanguage = new SimpleSchema({
      column: {
        type: Object,
        blackbox: true,
        optional: true,
      },
      selectOptions: {
        type: Object,
        blackbox: true,
        optional: true,
      },
    });

    const localesSchema = new SimpleSchema({
      de: localesSchemaPerLanguage,
      en: localesSchemaPerLanguage,
    });

    const collectionDefSchema = new SimpleSchema({
      collectionName: String,
      cursors: {
        type: Object,
        custom: cursorValidator,
        blackbox: true,
      },
      schema: {
        type: Object,
        blackbox: true,
      },
      metaSchema: {
        type: Object,
        blackbox: true,
        custom: checkSimpleSchema,
        optional: true,
      },
      locales: {
        type: localesSchema,
        optional: true,
      },
      policyChecks: policyChecksSchema,
    });
    collectionDefSchema.validate(collectionDef);
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
    /**
     * for use with uniforms
     */
    this.bridge = new SimpleSchema2Bridge({ schema: this.schema });
  }

  /**
   * @locus Client
   * @summary This will return the columns for the DataGrid component.
   * @description Supported types are boolean, dateTime, numeric, singleSelect and string.
   * The types are derived from the schema definition.
   *
   * We detect a singleSelect by checking if the type has an allowedValues property.
   * You can also translate the displayed values of a singleSelect by adding
   * a locales property to the collection definition, eg.
   *  locales: { de: { selectOptions: { key: 'value' } } }
   *
   * @returns {Array} columns - The columns for the DataGrid component by Mui X
   */
  columns() {
    // Client only, only for DataGrid definition
    if (Meteor.isServer) return undefined;
    const { schema } = this;
    const schemaKeys = schema.objectKeys();
    const columns = schemaKeys.map((key) => {
      let columnType;
      const type = schema.getDefinition(key).type[0]?.type;
      let valueOptions;
      let getOptionLabel;
      let valueGetter;

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
        getOptionLabel = (option) => (option ? i18next.t(`selectOptions.${option}`, { ns: 'bratelefant_mrm-auto-collections' }) : '');
        valueGetter = ({ row }) => ((row[key]) ? i18next.t(`${row[key]}`, { ns: 'bratelefant_mrm-auto-collections' }) : undefined);
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
        getOptionLabel,
        valueGetter,
        editable: true,
      };
    });
    return columns;
  }
}

export default AutoCollection;
