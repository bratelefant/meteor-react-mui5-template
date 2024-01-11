import { Mongo } from 'meteor/mongo';

const methods = [
  {
    name: 'insert',
    operation: async (doc) => this.collection.insertAsync(doc),
  },
  {
    name: 'update',
    operation: async (sel, mod) => this.collection.updateAsync(sel, mod),
  },
  {
    name: 'remove',
    operation: async (sel) => this.collection.removeAsync(sel),
  },
];

const AutoMethods = {};

AutoMethods.collectionDefs = [];

AutoMethods.collection = undefined;

AutoMethods.collectionName = '';

AutoMethods.registerMethods = (collectionDefArray) => {
  this.collectionDefs = collectionDefArray;
  for (let i = 0; i < collectionDefArray.length; i += 1) {
    const collectionDef = collectionDefArray[i];
    const { collectionName } = collectionDef;
    this.collectionName = collectionName;
    this.collection = new Mongo.Collection(this.collectionName);
    const { schema } = collectionDef;
    this.collection.attachSchema(schema);

    for (let j = 0; j < methods.length; j += 1) {
      Meteor.methods({
        [`${collectionName}.${methods[j].name}`]: async (args) => {
          if (collectionDef.policyChecks && typeof collectionDef.policyChecks[methods[j].name] === 'function') {
            const check = await collectionDef.policyChecks[methods[j].name](args);
            if (!check) {
              throw new Meteor.Error('not-authorized');
            }
          }
          const result = await methods[j].operation.call(this, args);
          return result;
        },
      });
    }
  }
};

export default AutoMethods;
