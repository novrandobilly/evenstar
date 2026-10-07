/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    const collection = app.findCollectionByNameOrId("sessions");
    collection.viewRule = "";
    return app.save(collection);
  } catch (_) {}
}, (app) => {
  const collection = app.findCollectionByNameOrId("sessions");

  collection.viewRule = "@request.auth.id != \"\" && host = @request.auth.id";

  return app.save(collection);
});
