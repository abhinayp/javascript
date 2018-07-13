var partial_update_module = function(profile_json) {

  var obj, original_data, request_json;
  var float_values = [];
  var boolean_values = [];

  var init = function() {

    if (!profile_json) {
      console.log('Partial update initilizing failed, json not found');
      return;
    }

    obj = profile_json;
    var temp_string = JSON.stringify(profile_json);
    var temp_json = JSON.parse(temp_string);
    original_data = temp_json;
    request_json = {};
    request_json['lbid'] = original_data['lbid'];

    console.log('Partial Update initialized successfully');
  }

  /** @param {*} value - new value which should be stored in json
   *  @param {Object} json - json where the value is stored
   *  @param {Object} array - array of keys that belongs to json to navigate and store the value
   * (Note - Recursive method and stores full parent key) */
  var insert_at_end_full_key = function(array, json, value, temp_json, index=null) {

    if (!temp_json)
      temp_json = obj

    if (typeof(index) != 'number' && !value && value != true && value != false && !check_float(array))
      value = null;

    /** check the parameter should have a float value, if it does. CONVERT STRING TO FLOAT */
    if (typeof(index) != 'number' && check_float(array))
      value = parseFloat(value);

    for (index in array) {
      /** if array has more then one element means it is nested in json and condition becomes true */
      if (array.length > 1) {
        if (!json[array[index]])
          json[array[index]] = {};

        /** get the whole key */
        json[array[index]] = temp_json[array[index]];

        /** resursive the same function for nesting and insert the value in nested json */
        json[array[index]] = insert_at_end_full_key(array.slice(1, array.length), json[array[index]], value, temp_json[array[index]], index);

        /** save the changes in temp_json(obj) */
        temp_json[array[index]] = json[array[index]];
      }

      /** if it is not a nested key, just change the value */
      else {
        /** if it is a array send entire key in json */
        if (temp_json[array[index]] != null && value != null && typeof(temp_json[array[index]]) != typeof(value)) {
          console.log('Value type mis-match')
        }
        else
          json[array[index]] = value;
      }

      /** check the json, if the key is same as original. If it is delete the key from partial save json */
      if (check_entire_nested_key(json, array[index]))
        delete json[array[index]];
      return json;
    }
  };

  /* If key_input is given: Return true if key's value is the same as `original`, false otherwise */
  /** (Note - this method used for full parent key check) */
  var check_entire_nested_key = function(json_input, key_input) {
    var same = false;
    if (JSON.stringify(json_input[key_input]) == JSON.stringify(original_data[key_input]))
      same = true;

    return same;
  }

  /** save partial json */
  var save_partial_json = function(keys, value) {
    var array = keys.split(', ');
    var result = insert_at_end_full_key(array, request_json, value);
    for (key in result) {
      request_json[key] = result[key]
    }

    return request_json;
  };

  /** check value is float and return true of false */
  var check_float = function(array) {
    var check_float = false;
    var float_keys = get_float_values();
    var array_string = array.join(', ');

    // try catch to avoid unexpected inputs
    try {
      // get keys that contains `, *`
      var include_all_keys = float_keys.filter(word => word.includes(', *'));

      // check the array matches the `, *` format, * means all keys
      if (include_all_keys.length) {
        for (var i in include_all_keys) {
          var include_key = include_all_keys[i];
          var array_keys = include_key.split(', ');
          // check the array length is more than to array_keys length to make sure array belongs to array_keys
          if (array.length >= array_keys.length) {
            var max_static_index = array_keys.indexOf('*');
            var excluded_keys = [];

            // check keys before * matches to confirm the float check
            for (var j = 0; j < max_static_index; j++) {
              if (array_keys[j] != array[j]) {
                return false;
              }
              check_float = true;
            }

            // check for exceptions for keys after `*`
            if (array_keys.length > max_static_index + 1) {
              excluded_keys = array_keys.slice(max_static_index + 1, array_keys.length);
              if (array_string.includes(excluded_keys.join(', '))) {
                check_float = false;
              }
            }
          }
        }
      }
    }
    catch(ex) {
      console.log('Error in check_float#partial_update');
    }

    if (float_keys.indexOf(array_string) > -1)
      check_float = true;
    return check_float;
  };

  /** update json from outside (use it for force change something in JSON) */
  var update_json = function(update_json) {
    obj = update_json
  }

  /** returns true if there are changes made, false if not */
  var changes = function() {
    var change = false;
    var count = Object.keys(request_json).length;
    if (count > 1)
      change = true;

    return change;
  }

  /** get partial update json */
  var get_request_json = function() {
    return request_json;
  }

  /** set values that should be converted to float */
  var set_float_values = function(float_values_data) {
    if (!Array.isArray(float_values_data)) {
      console.log('Array requried to set float values');
      return;
    }
    float_values = float_values_data;
  };

  /** get the keys of values you set earlier */
  var get_float_values = function() {
    if (!float_values) {
      return null;
    }
    return float_values;
  };

  /** set values that should be converted to boolean */
  var set_boolean_values = function(boolean_values_data) {
    if (!Array.isArray(boolean_values_data)) {
      console.log('Array requried to set boolean values');
      return;
    }
    boolean_values = boolean_values_data;
  };

  /** get the keys of values you set earlier */
  var get_boolean_values = function() {
    if (!boolean_values) {
      return null;
    }
    return boolean_values;
  };

  init();

  return {
    // Setters
    set_float_values: set_float_values,
    set_boolean_values: set_boolean_values,

    // Getters
    get_float_values: get_float_values,
    get_boolean_values: get_boolean_values,
    get_request_json: get_request_json,

    save_partial_json: save_partial_json,
    changes: changes,
  }
};
