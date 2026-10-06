/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add club_name field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "text_club_name",
    "max": 255,
    "min": 0,
    "name": "club_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("text_club_name")

  return app.save(collection)
})
