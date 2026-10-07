/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_plans",
    "name": "plans",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "indexes": [
      "CREATE UNIQUE INDEX `idx_plans_code` ON `plans` (`code`)"
    ],
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text_plan_id",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9_]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_plan_name",
        "max": 100,
        "min": 0,
        "name": "name",
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
        "id": "text_plan_code",
        "max": 50,
        "min": 0,
        "name": "code",
        "pattern": "^[a-z0-9_]+$",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select_plan_cycle",
        "maxSelect": 1,
        "name": "billing_cycle",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "lifetime",
          "yearly",
          "monthly"
        ]
      },
      {
        "hidden": false,
        "id": "number_plan_price",
        "max": null,
        "min": 0,
        "name": "price",
        "onlyInt": true,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_plan_badge",
        "max": 50,
        "min": 0,
        "name": "badge_label",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json_plan_features",
        "maxSize": 0,
        "name": "features",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "bool_plan_active",
        "name": "is_active",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "number_plan_sort",
        "max": null,
        "min": 0,
        "name": "sort_order",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "autodate_plan_created",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate_plan_updated",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ]
  });

  app.save(collection);

  // Seed default Lifetime plan
  const record = new Record(collection);
  record.set("id", "plan_lifetime01");
  record.set("name", "Kickserve Pro Lifetime");
  record.set("code", "pro_lifetime");
  record.set("billing_cycle", "lifetime");
  record.set("price", 499000);
  record.set("badge_label", "Lifetime Access");
  record.set("features", [
    "Save 100 players in Roster",
    "Up to 32 players per session",
    "Unlimited lifetime session history",
    "Custom Club Logo branding"
  ]);
  record.set("is_active", true);
  record.set("sort_order", 1);
  return app.save(record);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_plans");
  return app.delete(collection);
});
