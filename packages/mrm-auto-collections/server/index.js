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
        [`${this.autoCollection.collectionName}.${this.methods[i].name}`]:
          async (...args) => {
            /**
             * Check if the user is authorized to perform the operation
             */
            if (
              this.autoCollection.policyChecks
              && typeof this.autoCollection.policyChecks[this.methods[i].name]
                === 'function'
            ) {
              const check = await this.autoCollection.policyChecks[
                this.methods[i].name
              ](args, this.autoCollection.collection);
              if (!check) {
                throw new Meteor.Error(
                  'not-authorized',
                  'Datatable.error.notAuthorized',
                );
              }
            }
            /**
             * Perform the operation
             */
            const result = await this.methods[i].operation.call(
              undefined,
              ...args,
            );
            return result;
          },
      });
    }
  }

  registerPublications() {
    Object.entries(this.autoCollection.cursors).forEach(([name, props]) => {
      Meteor.publish(`${this.autoCollection.collectionName}.${name}`, () => this.autoCollection.collection.find(props.sel(), props.opt()));
    });
  }
}

export default AutoCollectionController;
