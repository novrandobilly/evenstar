/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("plans");
  const field = collection.fields.getByName("billing_cycle");
  if (field) {
    field.values = ["lifetime", "yearly"];
  }
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("plans");
  const field = collection.fields.getByName("billing_cycle");
  if (field) {
    field.values = ["lifetime", "yearly", "monthly"];
  }
  return app.save(collection);
});
