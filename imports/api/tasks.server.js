import AutoCollectionConroller from 'meteor/bratelefant:auto-methods/server';
import TasksAutoCollection from './tasks.collection';

const TasksController = new AutoCollectionConroller(TasksAutoCollection);

TasksController.registerMethods();
TasksController.registerPublications();
