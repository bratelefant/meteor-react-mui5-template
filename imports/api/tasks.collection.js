import SimpleSchema from 'simpl-schema';
import AutoCollection from 'meteor/bratelefant:auto-methods/common';

const TasksDefinition = {
  collectionName: 'tasks',
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
    description: {
      type: String,
      label: 'Description',
      optional: true,
    },
    createdAt: {
      type: Date,
      label: 'Created At',
      defaultValue: new Date(),
      autoValue() {
        if (this.isInsert) {
          return new Date();
        }
        return this.unset();
      },
      optional: true,
    },
    updatedAt: {
      type: Date,
      label: 'Updated At',
      defaultValue: new Date(),
      autoValue() {
        if (this.isUpdate || this.isInsert) {
          return new Date();
        }
        return this.unset();
      },
      optional: true,
    },
    completedAt: {
      type: Date,
      label: 'Completed At',
      optional: true,
    },
    completed: {
      type: Boolean,
      label: 'Completed',
      optional: true,
    },
    userId: {
      type: String,
      label: 'User ID',
      autoValue() {
        if (this.isInsert) {
          return Meteor.userId();
        }
        return this.unset();
      },
      optional: true,
    },
  }),
};

const TasksAutoCollection = new AutoCollection(TasksDefinition);

export default TasksAutoCollection;