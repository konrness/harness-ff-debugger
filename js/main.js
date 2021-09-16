

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

      $form.find("[name=inputTargetIdentifier]").val(target.identifier);
      $form.find("[name=inputTargetName]").val(target.name);

      var i=0;
      $.each(target.attributes, function(name, value){
        
      });
/*
      for (var i = 0; i < target.attributes.length; i++) {
        $form.find("[name^=targetAttributeName]")[i].val(target.attributes[])
      }
*/
      
  }

  return {

    init : function($formSettings) {

      _localStorage = window.localStorage;

      $formSettings.submit(function (e) {
        e.preventDefault();
        _saveSettings($formSettings);
      });

      _loadSettings($formSettings);
      
    }

  }

}();

var $formSettings = $("#formSettings");
Settings.init($formSettings);