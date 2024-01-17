/**
 * @locus Server
 * @class AutoCollectionController
 * @summary This class is used to register the methods and publications for a collection
 * that is automatically created and managed by the package.
 * @description This is super-quick way to get all basic CRUD operations for a collection.
 * The package will automatically create the collection, the methods and the publications
 * for you.
 * Since the AutoCollection constructor forces you to provide policy checks for the methods,
 * you can be sure that the methods are only called by authorized users.
 * You also need to provide a default cursor for the collection.
 * @param {AutoCollection} autoCollection - The AutoCollection instance to register the methods
 * and publications for.
 * @example
 * const myAutoCollection = new AutoCollection(myAutoCollectionDefinition);
 * myAutoCollection.registerMethods();
 * myAutoCollection.registerPublications();
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
        operation: async (sel, mod, opt) => this.autoCollection.collection.updateAsync(
          sel,
          mod,
          opt,
        ),
      },
      {
        name: 'remove',
        operation: async (sel) => this.autoCollection.collection.removeAsync(sel),
      },
    ];
  }

  /**
   * @locus Server
   * @memberOf AutoCollectionController
   * @name registerMethods - Registers the methods for the collection
   * @summary Registers the methods for the collection
   * @description Registers the methods for the collection
   * The methods are registered with the following names:
   * - collectionName.insert
   * - collectionName.update
   * - collectionName.remove
   * They can be called with Meteor.callAsync from the client.
   * Before the operation is performed, the policy check is called.
   * If the policy check returns false, the operation is not performed.
   * @returns {undefined}
   */
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

  /**
   * @locus Server
   * @memberOf AutoCollectionController
   * @name registerPublications - Registers the publications for the collection
   * @summary Registers the publications for the collection
   * @description Registers the publications for the collection
   * The publications are registered with the following names:
   * - collectionName.default
   * - collectionName.<cursorName>
   * They can be subscribed to with Meteor.subscribe from the client. We advise you to
   * use useFind and useSubscribe from the official react-meteor-data package.
   * @returns {undefined}
   */
  registerPublications() {
    Object.entries(this.autoCollection.cursors).forEach(([name, props]) => {
      Meteor.publish(`${this.autoCollection.collectionName}.${name}`, () => this.autoCollection.collection.find(props.sel(), props.opt()));
    });
  }
}

export default AutoCollectionController;
