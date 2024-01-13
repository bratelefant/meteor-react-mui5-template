import AutoCollectionConroller from 'meteor/bratelefant:mrm-auto-collections/server';
import TasksAutoCollection from './tasks.collection';

const TasksController = new AutoCollectionConroller(TasksAutoCollection);

TasksController.registerMethods();
TasksController.registerPublications();
