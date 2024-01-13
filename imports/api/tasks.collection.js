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
    completed: {
      type: Boolean,
      label: 'Completed',
      optional: true,
    },
    createdAt: {
      type: Date,
      label: 'Created At',
      defaultValue: new Date(),
    },
  }),
};

const TasksAutoCollection = new AutoCollection(TasksDefinition);

export default TasksAutoCollection;
