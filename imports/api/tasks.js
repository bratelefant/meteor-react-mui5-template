import SimpleSchema from 'simpl-schema';

const Tasks = {};

Tasks.collectionName = 'tasks';

Tasks.policyChecks = {
  insert: async () => Meteor.userId(),
  update: async () => Meteor.userId(),
  remove: async () => Meteor.userId(),
};

Tasks.schema = new SimpleSchema({
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
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
      return this.unset();
    },
  },
  updatedAt: {
    type: Date,
    label: 'Updated At',
    autoValue() {
      if (this.isUpdate || this.isInsert) {
        return new Date();
      }
      return this.unset();
    },
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
    optional: true,
  },
});

export default Tasks;
