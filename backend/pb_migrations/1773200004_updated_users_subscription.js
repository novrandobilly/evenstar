/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");

  // 1. Add tier select field ('free' | 'pro')
  collection.fields.add(new Field({
    "hidden": false,
    "id": "select_tier",
    "maxSelect": 1,
    "name": "tier",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "free",
      "pro"
    ]
  }));

  // 2. Add subscription expiration timestamp
  collection.fields.add(new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_sub_expires",
    "max": 100,
    "min": 0,
    "name": "subscription_expires_at",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }));

  // 3. Add club logo file upload (max 1MB)
  collection.fields.add(new Field({
    "hidden": false,
    "id": "file_club_logo",
    "maxSelect": 1,
    "maxSize": 1048576,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "club_logo",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }));

  // 4. Update rule for profile edits
  collection.updateRule = "id = @request.auth.id";

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");

  collection.fields.removeById("select_tier");
  collection.fields.removeById("text_sub_expires");
  collection.fields.removeById("file_club_logo");
  collection.updateRule = "id = @request.auth.id";

  return app.save(collection);
});
