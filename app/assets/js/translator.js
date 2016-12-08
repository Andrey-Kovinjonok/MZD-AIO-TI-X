var translateData = new Config({"name":"aio-translate-save"});
document.getElementById('submit').innerHTML = langObj.translatorWindow[14].label;

// Hook up the Restore to Default button
document.getElementById('restore').addEventListener('click',function() {
  editor.setValue(JSON.parse(fs.readFileSync(`${langPath}`,{encoding:"utf8"})));
});
document.getElementById('restore').innerHTML = langObj.translatorWindow[1].label + ` (${lang})`;
document.getElementById('loadLang').innerHTML = `${lang}`;
function gotoTranslator () {
  $(this).hide();
}
// This is the starting value for the editor
// We will use this to seed the initial editor
// and to provide a "Restore to Default" button.
var starting_value;
if(translateData.has('data')) {
  starting_value = translateData.get('data');
}
else {
  starting_value = JSON.parse(fs.readFileSync(`${langPath}`,{encoding:"utf8"}));
}

// Initialize the editor
var editor = new JSONEditor(document.getElementById('editor_holder'),{
  // Enable fetching schemas via ajax
  ajax: true,
  theme: "bootstrap3",
  iconlib: "fontawesome4",

  // The schema for the editor
  schema: {
    $ref: "./lang/aio.schema.json"
  },

  // Seed the form with a starting value
  startval: starting_value,

  // Disable additional properties
  no_additional_properties: true,
  disable_array_reorder: true,
  disable_array_delete: true,
  disable_properties: true,
  disable_edit_json: true,
  disable_array_add: true,

  // Require all properties by default
  required_by_default: true
});
JSONEditor.plugins.sceditor.toolbar = "bold,italic,underline,strike|left,center,right,justify|size,color,removeformat|cut,copy,paste,pastetext|bulletlist,orderedlist,horizontalrule|image,link|source"
//JSONEditor.plugins.sceditor.spellcheck  = false;
JSONEditor.plugins.sceditor.width = "620";
JSONEditor.plugins.sceditor.height = "150";
JSONEditor.plugins.sceditor.resizeMinHeight = "150";
JSONEditor.plugins.sceditor.resizeMaxHeight = "500";
JSONEditor.plugins.sceditor.resizeMinWidth = "450";
JSONEditor.plugins.sceditor.resizeMaxWidth = "800";

//JSONEditor.defaults.editors..options.hidden = true;
// Hook up the submit button to log to the console
document.getElementById('submit').addEventListener('click',function() {
  fileName = document.getElementById('newFileName').value.toLowerCase();
  // Get the value from the editor
  //console.log(JSON.stringify(editor.getValue()));
  console.log(fileName);
  fs.writeFile(`${app.getPath('documents')}/${fileName}.aio.json`,JSON.stringify(editor.getValue()),function(){
    bootbox.alert({
      title: `${fileName}.aio.json Saved`,
      message: `${fileName}.aio.json ${langObj.translatorWindow[7].label} <button class="w3-btn" onclick="shell.showItemInFolder(path.normalize(path.join('file://', app.getPath('documents'), '${fileName}.aio.json')))">${langObj.translatorWindow[8].label}</button>`
    })
  });
});
document.getElementById('import').addEventListener('click',function() {
  //var jsonData
  remote.dialog.showOpenDialog({
    title: `MZD-AIO-TI | ${langObj.translatorWindow[11].label}.`,
    properties: ['openFile'],
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'AIO Translation File', extensions: ['json'] }
    ]
  }, function (files) {
    if (files) {
      jsonData = fs.readFileSync(files[0],{encoding:"utf8"})
      editor.setValue(JSON.parse(jsonData));
    }
  })
});
//ipc.send('open-translate-file');
ipc.on('translate-file', function (data) {
  if(data) {
    console.log(data[0])
    console.log(data[0].toString())
    var loadSaved = fs.readFileSync(data[0],{encoding:"utf8"});
    console.log(loadSaved)
    editor.setValue(JSON.parse(loadSaved));
  }
});

document.getElementById('import').innerHTML = langObj.translatorWindow[9].label

function gotoTranslator () {
  $(this).hide();
}

// Hook up the enable/disable button
/*document.getElementById('enable_disable').addEventListener('click',function() {
if(!editor.isEnabled()) {
editor.enable();
}
else {
editor.disable();
}
});*/

// Hook up the validation indicator to update its
// status whenever the editor changes
var changes = 0; // Save on every 3 changes
editor.on('change',function() {
  // Get an array of errors from the validator
  var errors = editor.validate();

  var indicator = document.getElementById('valid_indicator');

  // Not valid
  if(errors.length) {
    indicator.style.color = 'red';
    indicator.textContent = "not valid";
  }
  // Valid
  else {
    indicator.style.color = 'green';
    changes++;
    if(changes>3) {
      translateData.set('data',editor.getValue());
      $('#autosave').show()
      $('#autosave').fadeOut(5000)
      changes = 0;
    }
    //indicator.textContent = "valid";
  }
});
$(function () {
  $('input').dblclick(function(){$(this).val(clipboard.readHTML())});
  //Prevents all links with no href from reloading the page
  $("a[href='']").click(function(e){e.preventDefault();})
  //Disables all the ID fields because they need to stay consistant
  $('[name*="[id]"], [name*="[menuId]"], [name*="[imgId]"], [name*="[spOp]"], [name*="[code]"]').attr('disabled','true');
  $('[type*="checkbox"]').addClass("w3-check");
  $('iframe').css("max-width","100%");
  $('#loading').hide();
})
