import SimpleSchema from 'simpl-schema';
import AutoCollection from 'meteor/bratelefant:auto-methods/common';

const TasksDefinition = {
  collectionName: 'tasks',
  cursors: {
    default: {
      sel: () => ({ _createdBy: Meteor.userId() }),
      opt: () => ({ sort: { _createdAt: -1 } }),
    },
  },
  policyChecks: {
    insert: async () => Meteor.userId(),
    update: async () => Meteor.userId(),
    remove: async () => Meteor.userId(),
  },
  schema: new SimpleSchema({
    title: {
      type: String,
      label: 'Title',
      max: 200,
    },
    completed: {
      type: Boolean,
      label: 'Completed',
      optional: true,
    },
  }),
  metaSchema: new SimpleSchema({
    _createdAt: {
      type: Date,
      label: 'Created At',
      autoValue() {
        if (this.isInsert) {
          return new Date();
        }
        return this.value;
      },
    },
    _createdBy: {
      type: String,
      label: 'Created By',
      autoValue() {
        if (this.isInsert) {
          return Meteor.userId();
        }
        return this.value;
      },
    },
    _updatedAt: {
      type: Date,
      label: 'Updated At',
      autoValue() {
        if (this.isUpdate || this.isInsert) {
          return new Date();
        }
        return undefined;
      },
    },
    _updatedBy: {
      type: String,
      label: 'Updated By',
      autoValue() {
        if (this.isUpdate || this.isInsert) {
          return Meteor.userId();
        }
        return undefined;
      },
    },
  }),
};

const TasksAutoCollection = new AutoCollection(TasksDefinition);

export default TasksAutoCollection;
