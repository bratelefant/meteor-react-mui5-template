/**
 * @locus Server
 */
class AutoCollectionController {
  constructor(autoCollection) {
    this.autoCollection = autoCollection;
    this.methods = [
      {
        name: 'insert',
        operation: async (doc) => this.autoCollection.collection.insertAsync(doc),
      },
      {
        name: 'update',
        operation: async (sel, mod, opt) => this.autoCollection.collection.updateAsync(sel, mod, opt),
      },
      {
        name: 'remove',
        operation: async (sel) => this.autoCollection.collection.removeAsync(sel),
      },
    ];
  }

  registerMethods() {
    for (let i = 0; i < this.methods.length; i += 1) {
      Meteor.methods({
        [`${this.autoCollection.collectionName}.${this.methods[i].name}`]: async (args) => {
          if (this.autoCollection.policyChecks && typeof this.autoCollection.policyChecks[this.methods[i].name] === 'function') {
            const check = await this.autoCollection.policyChecks[this.methods[i].name](args);
            if (!check) {
              throw new Meteor.Error('not-authorized');
            }
          }
          const result = await this.methods[i].operation.call(this, args);
          return result;
        },
      });
    }
  }

  registerPublications() {
    Meteor.publish(`${this.autoCollection.collectionName}.all`, () => this.autoCollection.collection.find({}, { limit: 1000 }));
  }
}

export default AutoCollectionController;
