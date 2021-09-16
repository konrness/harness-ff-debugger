var Settings = function() {
  var _localStorage = null;

  var _saveSettings = function($form) {
      
      _localStorage.setItem("clientKey", $form.find("[name=inputClientKey]").val());
      _localStorage.setItem("serverKey", $form.find("[name=inputServerKey]").val());
      _localStorage.setItem("sdkType", $form.find("[name=sdkType]").val());

      var target = {
        identifier: $form.find("[name=inputTargetIdentifier]").val(),
        name:       $form.find("[name=inputTargetName]").val(),
        anonymous:  false,
        attributes: {}
      };

      var attributeNames = $.map($form.find("[name^=targetAttributeName]"), function(el){
        return $(el).val();
      });

      var attributeValues = $.map($form.find("[name^=targetAttributeValue]"), function(el){
        return $(el).val();
      });

      for (var i = 0; i < attributeNames.length; i++) {
        target.attributes[attributeNames[i]] = attributeValues[i];
      }

      console.log("Saving target:", target);

      _localStorage.setItem("target", JSON.stringify(target));
      
  }

  var _loadSettings = function($form) {
      $form.find("[name=inputClientKey]").val(_localStorage.getItem("clientKey"));
      $form.find("[name=inputServerKey]").val(_localStorage.getItem("serverKey"));
      $form.find("[name=sdkType]").val(_localStorage.getItem("sdkType"));

      var target = JSON.parse(_localStorage.getItem("target"));

      if (! target) {
        return;
      }

      $form.find("[name=inputTargetIdentifier]").val(target.identifier);
      $form.find("[name=inputTargetName]").val(target.name);

      // TODO: We only support two attributes right now. Make this dynamic (add/remove rows)

      var i=0;
      var $row;
      $.each(target.attributes, function(name, value){

        // get row
        $row = $form.find(".row.attribute").eq(i++);

        // set name
        $row.find("[name='targetAttributeName[]']").val(name);

        // set value
        $row.find("[name='targetAttributeValue[]']").val(value);
      });
      
  }

  var _getClientKey = function() {
    return _localStorage.getItem("clientKey");
  }

  var _getTarget = function() {
    return JSON.parse(_localStorage.getItem("target"));
  }

  return {

    init : function($formSettings) {

      _localStorage = window.localStorage;

      $formSettings.submit(function (e) {
        e.preventDefault();
        _saveSettings($formSettings);

        // refresh FF SDK
        FF.reloadSDK();
      });

      _loadSettings($formSettings);
      
    },
    getClientKey : function() {
      return _getClientKey();
    },
    getTarget : function() {
      return _getTarget();
    },
    getOptions : function() {
      return {
        debug : true
      };
    }

  }

}();

var FF = function() {
  var _initialize = null;
  var _Event = null;
  var _settings = null;
  var _sdk = null;
  var _flagsView = null;
  var _debugView = null;

  
  var _setupSDK = function() {

    _sdk = _initialize(_settings.getClientKey(), _settings.getTarget(), _settings.getOptions());

    // setup event listeners
    _sdk.on(_Event.READY, flags => {
      console.log("Event: READY", flags);
      _flagsView.setFlags(flags);
    });

    _sdk.on(_Event.CHANGED, flagInfo => {
      console.log("Event: CHANGED", flagInfo);
      _flagsView.setFlagInfo(flagInfo);
    });

    _sdk.on(_Event.DISCONNECTED, () => {
      console.log("Event: DISCONNECTED");
    });

    _sdk.on(_Event.ERROR, () => {
      console.log("Event: ERROR");
    });
  }

  return {

    init : function(settings, flagsView, debugView) {
      _settings = settings;
      _flagsView = flagsView;
      _debugView = debugView;
    },

    setFFSDK : function(initialize, Event) {
      _initialize = initialize;
      _Event = Event;

      _setupSDK();
    },

    reloadSDK : function() {
      _setupSDK();
    }
  }

}();

var FlagsView = function () {
  var $view = null;


  return {
    init : function(view) {
      $view = view.find('pre');
    },
    setFlags : function(flags) {

    },
    setFlagInfo : function(flagInfo) {
      var log = [];
      log.push((new Date).toISOString());
      log.push(JSON.stringify(flagInfo));
      log.push("\n");
      
      $view.append(log.join(" "));
    }
  }
}();

var DebugView = function() {
  var $view = null;


  return {
    init : function(view) {
      $view = view;
    }
  }
}();

var $formSettings = $("#formSettings");
Settings.init($formSettings);
FlagsView.init($("#flags-view"));
DebugView.init($("#debug-view"));
FF.init(Settings, FlagsView, DebugView);