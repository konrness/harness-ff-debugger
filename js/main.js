

var Settings = function() {
  var _localStorage = null;

  var _saveSetting = function(name, value) {
    _localStorage.set(name, value);
  }

  return {

    init : function() {

    },

    save : function(form) {
      console.log("Settings save", form);

      return false;
    }

  }

}();

Settings.init();