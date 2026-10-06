/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sessions");

  // Allow public view rule so spectators can load and subscribe to live session by record id
  collection.viewRule = "";

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sessions");

  collection.viewRule = "@request.auth.id != \"\" && host = @request.auth.id";

  return app.save(collection);
});
