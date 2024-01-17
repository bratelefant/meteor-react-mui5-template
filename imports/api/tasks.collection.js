import SimpleSchema from 'simpl-schema';
import AutoCollection from 'meteor/bratelefant:mrm-auto-collections/common';

const TasksDefinition = {
  collectionName: 'tasks',
  cursors: {
    default: {
      sel: () => ({ _createdBy: Meteor.userId() }),
      opt: () => ({
        fields: {
          _createdAt: 1, _createdBy: 1, completed: 1, dueDate: 1, title: 1, assignedTo: 1,
        },
        sort: { _createdAt: -1 },
      }),
    },
  },
  policyChecks: {
    insert: async () => Meteor.userId(),
    update: async ([selector], collection) => {
      const item = await collection.findOneAsync(selector);
      return Meteor.userId() && item?._createdBy === Meteor.userId();
    },
    remove: async ([selector], collection) => {
      const item = await collection.findOneAsync(selector);
      if (!item?.completed) throw new Meteor.Error('taskNotCompleted');
      return Meteor.userId() && item?._createdBy === Meteor.userId() && item?.completed;
    },
  },
  locales: {
    de: {
      column: {
        'Due Date': 'Fälligkeitsdatum',
        Completed: 'Erledigt',
        'Assigned To': 'Zugewiesen an',
        Title: 'Titel',
      },
      selectOptions: {
        me: 'Ich',
        team: 'Team',
        all: 'Alle',
        boss: 'Chef',
        someone: 'Jemand anderes',
      },
      error: {
        taskNotCompleted: 'Die Aufgabe ist noch nicht erledigt und kann daher noch nicht gelöscht werden.',
      },
    },
    en: {
      column: {
        'Due Date': 'Due Date',
        Completed: 'Completed',
        'Assigned To': 'Assigned To',
        Title: 'Title',
      },
      selectOptions: {
        me: 'Me',
        team: 'Team',
        all: 'All',
        boss: 'Boss',
        someone: 'Someone else',
      },
      error: {
        taskNotCompleted: 'The task is not completed and cannot be deleted.',
      },
    },
  },
  schema: new SimpleSchema({
    title: {
      type: String,
      label: 'Title',
      max: 200,
    },
    dueDate: {
      type: Date,
      label: 'Due Date',
      optional: true,
      defaultValue: (() => {
        const date = new Date();
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        return date;
      })(),
      custom() {
        if (this.value && this.value < new Date() && this.isInsert) {
          return 'dueDateMustBeInTheFuture';
        }
        return undefined;
      },
    },
    assignedTo: {
      type: String,
      label: 'Assigned To',
      optional: true,
      allowedValues: ['me', 'team', 'all', 'boss', 'someone'],
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
