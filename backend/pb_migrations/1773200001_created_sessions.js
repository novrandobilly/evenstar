/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  try {
    if (app.findCollectionByNameOrId("sessions")) return;
  } catch (_) {}

  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\" && host = @request.auth.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation_host",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "host",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_title",
        "max": 255,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_sport",
        "max": 50,
        "min": 0,
        "name": "sport",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select_match_format",
        "maxSelect": 1,
        "name": "match_format",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "doubles",
          "singles"
        ]
      },
      {
        "hidden": false,
        "id": "select_doubles_mode",
        "maxSelect": 1,
        "name": "doubles_mode",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "americano"
        ]
      },
      {
        "hidden": false,
        "id": "json_players",
        "maxSize": 0,
        "name": "players",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json_matches",
        "maxSize": 0,
        "name": "matches",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "select_status",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "in_progress",
          "completed"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_completed_at",
        "max": 100,
        "min": 0,
        "name": "completed_at",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_sessions",
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && host = @request.auth.id",
    "name": "sessions",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id != \"\" && host = @request.auth.id",
    "viewRule": "@request.auth.id != \"\" && host = @request.auth.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_sessions");

  return app.delete(collection);
})
