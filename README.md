# partial_update

  To get started
  add this `https://raw.githubusercontent.com/abhinayp/partial_update/master/partial_update.js` to your HTML

IMPLEMENTING
* use this `var partial_update = new partial_update_module(json);` to initialize
* `json` is the JSON object with data to set data structure
* seperate keys with `,` to navigate through JSON. 
  - Example if JSON is `{details: {name: abhinay, age: 23, active: true}, marks: {maths: 100, physics: 100, english: 100}}` to change name `var keys = 'details, name'`
  and `var value = 'parvathaneni'`.
* save it using `partial_update.save_partial_json(keys, value)`
* (optional) set float keys before hand to avoid data-type mismatch error if user sends string instead of number for a number field.
  - Example `partial_update.set_float_values(['details, age', 'details, marks, *'])`.
  - `*` means all, everthing after it is exception like `partial_update.set_float_values(['details, *, name, active'])`
* (optional) set boolean keys before hand to avoid data-type mismatch error if user sends string instead of number for a number field.
  - Example `partial_update.set_boolean_values(['details, active'])`.
* `partial_update.get_request_json()` to get the JSON with changed attributes
  - Example Response `{details: {name: parvathaneni}}`
* `partial_update.changes()` returns true if changes are made, false if there are no changes.
