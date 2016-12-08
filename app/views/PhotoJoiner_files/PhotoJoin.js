var style = 1;
var JoinedHeight = 0,
JoinedWidth = 0,
ImageCount = 0;
var margin = 10;
var cols = 2;
var first = true;
var _URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
var color = {
  "r": 255,
  "g": 255,
  "b": 255
};
var arr = [];
var ratios = [];
var FileLength;
var FileCount = 0;
$(function() {
  $(function() {});
  /*$("#color").ColorPicker({
    onSubmit: function(hsb, hex, rgb, el) {
      $(el).val(hex);
      $(el).ColorPickerHide();
      color = rgb;
    },
    onChange: function(hsb, hex, rgb) {
      $("#color").val(hex);
      color = rgb;
    },
    onBeforeShow: function() {
      $(this).ColorPickerSetColor(this.value);
    },
    onHide: function() {
      $("#thumbs").css("background-color", "#" + $("#color").val());
      $("#thumbsgrid").css("background-color", "#" + $("#color").val());
      $("#color").val("#" + $("#color").val());
    }
  })
  colorPicker();*/
  $("#thumbs").sortable({
    update: function(event, ui) {
      makeArray();
    }
  });
  $("#thumbs").disableSelection();
  makeArray();
  setTimeout("hideMsg();", 5000);
});

function selectFiles() {
  FileCount = 0;
  FileLength = 0;
  var file, img;
  var cols = parseInt($("#txtCols").val());
  var rows = parseInt($("#txtRows").val());
  var AllowedImages = 10;
  var finput = document.getElementById("selectedFile");
  if (finput.files) {
    FileLength = parseInt(finput.files.length);
  } else {
    FileLength = 1;
  }
  if (arr.length == 0) {
    if (FileLength > AllowedImages) {
      if (finput.files.length % cols == 0) {
        rows = Math.floor(FileLength / cols);
      } else {
        rows = Math.floor(FileLength / cols) + 1;
      }
      AllowedImages = cols * rows;
      $("#txtRows").val(rows)
    }
  }
  for (var i = 0; i < FileLength; i++) {
    var imgpath;
    if (finput.files) {
      if (file = finput.files[i]) {
        if (arr.length + i >= AllowedImages && style == 3) {
          ShowErrorMessage(AllowedImages);
          break;
        }
      }
    }
    ImageCount++;
    imgpath = file.path;
    CreateImagePreview(imgpath);
    /* With Electron we can access the File System path directly */
    /*if (_URL) {
      imgpath = _URL.createObjectURL(file);
      CreateImagePreview(imgpath);
    } else {
      try {
        var reader = new FileReader();
        reader.addEventListener("load", function(event) {
          imgpath = event.target;
          CreateImagePreview(event.target.result);
        });
        reader.readAsDataURL(file);
      } catch (err) {}
    }*/
  }
  numberOfImages()
}

function JoinPhotos() {
  $('#joinbtn').prepend('<img src="../../files/load-1.gif" />');
  $('#joinbtn').append('<img src="../../files/load-0.gif" />');
  makeArray();
  var canvas = document.createElement("canvas");
  Images = [];
  for (var i = 0; i < arr.length; i++) {
    var img = document.createElement("img");
    img.src = arr[i];
    var imgobj = {
      Image: img,
      oWidth: 800,
      oHeight: 480,
      nWidth: 800,
      nHeight: 480
    };
    Images.push(imgobj);
  }
  JoinedHeight = 480;
  JoinedWidth += imgobj.nWidth*Images.length;
  /* We already know that every image is going to be the same length  */
  /*
  for (var i = 0; i < Images.length; i++) {
    var imgobj = Images[i];
    if (style == "1") {
      imgobj.nHeight = JoinedHeight;
      imgobj.nWidth = imgobj.nHeight * imgobj.oWidth / imgobj.oHeight;
      JoinedWidth += imgobj.nWidth;
    } else {
      imgobj.nWidth = JoinedWidth;
      imgobj.nHeight = imgobj.nWidth * imgobj.oHeight / imgobj.oWidth;
      JoinedHeight += imgobj.nHeight;
    }
  }*/
  $("#Panel2").show();
  $("#Panel1").hide();
  var margin = 0;
  canvas.width = JoinedWidth;
  canvas.height = JoinedHeight;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = document.getElementById("color").value;
  ctx.fillRect(0, 0, JoinedWidth, JoinedHeight);
  var Top = margin,
  Left = margin;
  for (var i = 0; i < Images.length; i++) {
    if (style == "1") {
      Top = 0;
    } else {
      Left = 0;
    }
    ctx.drawImage(Images[i].Image, Left, Top, Images[i].nWidth, Images[i].nHeight);
    if (style == "1") {
      Left += Images[i].nWidth;
    } else {
      Top += Images[i].nHeight;
    }
  }
  var dlLink = document.getElementById("imgJoinedLink");
  var outImage = document.getElementById("imgJoined");
  /*if (canvas.width > canvas.height && canvas.width > 1400) {
    outImage.setAttribute("width", 1400);
  } else if (canvas.height > canvas.width && canvas.height > 480) {
    outImage.setAttribute("height", 480);
  } */
  //dlLink.href = canvas.toDataURL('image/png').replace(/^data:image\/\w+;base64,/, "");
  /* This was creating a URL that was so big the image couldnt be saved natively, NativeImage class fixes that nicely */
  //outImage.src = canvas.toDataURL('image/png');
  //$("#hdnImageData").val(canvas.toDataURL('image/png'));
  //saveCanvas(canvas, 'background', 'png');
  /* Write the joined image directly to the File System as background.png */
  fs.writeFile('./background/background.png',nativeImage.createFromDataURL(canvas.toDataURL('image/png')).toPNG()),function(err){console.log(err);window.close();}
  outImage.src = '../../../background/background.png';
  $('#imgJoined').attr("src","../../../background/background.png");
}

function changeStyle(s) {
  $("#style_" + style).removeClass("selected");
  $("#style_" + s).addClass("selected");
  style = s;
  $("#style").val(style);
  $("#thumbsgrid").remove();
  $("#thumbs").css("display", "block");
  if (s == 1) {
    $("#thumbs").css("width", "");
    $("#thumbs").css("white-space", "nowrap");
    $(".thumbimg").removeAttr("width");
    $("#thumbs").css("text-align", "center");
    $(".thumbimg").attr("width", "140");
    $(".thumbimg").attr("height", "84");
    $(".thumbimg").css("float", "");
    $("#ResizeOptions").css("display", "block");
    $("#GridOptions").css("display", "none");
  } else if (s == 2) {
    $("#thumbs").css("width", 100);
    $("#thumbs").css("white-space", "normal");
    $(".thumbimg").removeAttr("height");
    $("#thumbs").css("text-align", "center");
    $(".thumbimg").attr("width", "100");
    $(".thumbimg").css("float", "left");
    $("#ResizeOptions").css("display", "block");
    $("#GridOptions").css("display", "none");
  } else if (s == 3) {
    var cols = $("#txtCols").val();
    $("#ResizeOptions").css("display", "none");
    $("#GridOptions").css("display", "block");
    $("#thumbs").css("text-align", "left");
    $("#thumbs").css("width", 100 * cols);
    $("#thumbs").css("white-space", "normal");
    $(".thumbimg").removeAttr("height");
    $(".thumbimg").css("float", "left");
    $(".thumbimg").attr("width", "100");
    var rows = parseInt($("#txtRows").val());
    var AllowedImages = cols * rows;
    var FileLength = arr.length;
    if (FileLength > AllowedImages) {
      if (FileLength % cols == 0) {
        rows = Math.floor(FileLength / cols);
      } else {
        rows = Math.floor(FileLength / cols) + 1;
      }
      AllowedImages = cols * rows;
      $("#txtRows").val(rows)
    }
  }
  setMargin();
}

function changeCols() {
  var cols = $("#txtCols").val();
  var margin = $("#marginsize").val() / 10;
  $("#thumbs").css("width", 100 * cols);
}

function colorPicker() {
  if (document.getElementById("margin").checked) {
    $("#colorpicker").show();
    $("#thumbs").css("background-color", "#" + $("#color").val());
  } else {
    $("#colorpicker").hide();
    $("#thumbs").css("background-color", "#FFFFFF");
  }
  setMargin();
}

function makeArray() {
  arr = [];
  $(".thumbimg").each(function() {
    arr.push($(this).attr("src"));
  });
  $("#order").val(arr);
  if (arr.length < 2) {
    $("#joinbtn").hide();
    $("#mintwo").show();
  } else {
    $("#joinbtn").show();
    $("#mintwo").hide();
  }
}

function setMargin() {
  if (document.getElementById("margin").checked) {
    var margin = $("#marginsize").val() / 10;
    var cols = parseInt($("#txtCols").val());
    if (style == 1) {
      $("#thumbs").css("width", "");
      $("#thumbs").css("padding", margin);
      $("#thumbs").css("padding-left", 0);
      $("#thumbs").css("padding-top", margin);
      $(".thumb").css("margin-left", margin);
      $(".thumb").css("margin-top", 0);
    } else if (style == 2) {
      $("#thumbs").css("width", 100);
      $("#thumbs").css("padding", margin);
      $("#thumbs").css("padding-left", margin);
      $("#thumbs").css("padding-top", 0);
      $(".thumb").css("margin-left", 0);
      $(".thumb").css("margin-top", margin);
    } else if (style == 3) {
      var width = (cols * 100) + margin * (cols + 1);
      $("#thumbs").css("width", width);
      $("#thumbs").css("padding", 0);
      $("#thumbs").css("padding-bottom", margin);
      $("#thumbs").css("padding-left", 0);
      $("#thumbs").css("padding-top", 0);
      $(".thumb").css("margin-left", margin);
      $(".thumb").css("margin-top", margin);
    } else {
      $("#thumbs").css("padding", margin);
      $("#thumbs").css("padding-left", 0);
      $("#thumbs").css("padding-top", 0);
      $(".thumb").css("margin-left", margin);
      $(".thumb").css("margin-top", margin);
    }
  } else {
    $("#thumbs").css("padding", 0);
    $(".thumb").css("margin-left", 0);
    $(".thumb").css("margin-top", 0);
  }
}

function del(i) {
  $("#" + i).remove();
  makeArray();
  numberOfImages();
}

function hideMsg() {
  $("#lblFB").slideUp();
}

function JoinasGrid(canvas) {
  var JoinedHeight = 0,
  JoinedWidth = 0;
  Images = [];
  for (var i = 0; i < arr.length; i++) {
    var img = document.createElement("img");
    img.src = arr[i];
    ratios.push(img.width / img.height);
    var imgobj = {
      Image: img,
      oWidth: img.width,
      oHeight: img.height,
      nWidth: img.width,
      nHeight: img.Height,
      ratio: img.width / img.height
    };
    Images.push(imgobj);
  }
  var MaxResult = mode(ratios);
  var ratio = parseFloat(MaxResult.MaxEl);
  var MaxCount = parseInt(MaxResult.MaxCount);
  var RowHeight = [];
  var RowWidth = [];
  var rows = parseInt($("#txtRows").val());
  var cols = parseInt($("#txtCols").val());
  var CurrHeight = 0,
  CurrWidth = 0;
  var ImageWidth = 0;
  var margin = 0;
  if (document.getElementById("margin").checked) {
    if (!isNaN(parseInt($("#marginsize").val()))) {
      margin = parseInt($("#marginsize").val());
    }
  }
  for (var i = 0; i < Images.length; i++) {
    var imgobj = Images[i];
    if (MaxCount > 1) {
      if (imgobj.ratio == ratio) {
        if (imgobj.oWidth < ImageWidth || ImageWidth == 0) {
          ImageWidth = imgobj.oWidth;
        }
      }
    } else {
      if (imgobj.oWidth < ImageWidth || ImageWidth == 0) {
        ImageWidth = imgobj.oWidth;
      }
    }
  }
  for (var i = 0; i < Images.length; i++) {
    var imgobj = Images[i];
    imgobj.nWidth = ImageWidth;
    imgobj.nHeight = imgobj.nWidth * imgobj.oHeight / imgobj.oWidth;
    var LastRow = ((i + 1) % cols == 0);
    if (imgobj.nHeight > CurrHeight || CurrHeight == 0) {
      CurrHeight = imgobj.nHeight
    }
    CurrWidth = CurrWidth + imgobj.nWidth;
    if (LastRow || i == Images.length - 1) {
      RowHeight.push(CurrHeight);
      RowWidth.push(CurrWidth);
      CurrWidth = 0;
      CurrHeight = 0;
    }
  }
  for (var i = 0; i < RowHeight.length; i++) {
    JoinedHeight = JoinedHeight + RowHeight[i];
  }
  JoinedWidth = Math.max.apply(Math, RowWidth);
  JoinedWidth += (margin * cols) + margin;
  JoinedHeight += (margin * RowHeight.length) + margin;
  canvas.width = JoinedWidth;
  canvas.height = JoinedHeight;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = document.getElementById("color").value;
  ctx.fillRect(0, 0, JoinedWidth, JoinedHeight);
  var Top = margin,
  Left = margin;
  var rowNumber = 0;
  for (var i = 0; i < Images.length; i++) {
    var imgobj = Images[i];
    if (i % cols == 0 && i > 0) {
      Top = Top + RowHeight[(i / cols) - 1] + margin;
      Left = margin;
    }
    ctx.drawImage(Images[i].Image, Left, Top, Images[i].nWidth, Images[i].nHeight);
    Left += Images[i].nWidth + margin;
  }
}

function CreateGridPreview() {
  $("#thumbsgrid").remove();
  var rows = parseInt($("#txtRows").val());
  var cols = parseInt($("#txtCols").val());
  var table = document.createElement("table");
  $(table).css("margin-top", 20);
  table.cellPadding = 0;
  table.cellSpacing = 0;
  $(table).attr("id", "thumbsgrid");
  for (var i = 0; i < arr.length; i++) {
    var img = document.createElement("img");
    img.src = arr[i];
    img.setAttribute("width", 100);
    var thumb = document.createElement("div");
    thumb.setAttribute("class", "thumb");
    $(thumb).append(img);
    var del = document.createElement("img");
    del.setAttribute("class", "del");
    del.src = "x.png";
    del.setAttribute("onclick", "del('" + "thumb" + ImageCount + "')");
    $(thumb).append(del)
    var lastrow = table.rows[table.rows.length - 1];
    if (table.rows.length == 0 || lastrow.cells.length == cols) {
      lastrow = table.insertRow(-1);
    }
    for (var j = 0; j < cols; j++) {
      if (lastrow.cells[j]) {
        continue;
      } else {
        var newcell = lastrow.insertCell(-1);
        newcell.style.textAlign = 'left';
        $(newcell).append(thumb);
        break;
      }
    }
  }
  $("#Preview").append(table);
}

function mode(array) {
  if (array.length == 0)
  return null;
  var modeMap = {};
  var maxEl = array[0],
  maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null)
    modeMap[el] = 1;
    else
    modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  var MaxResult = {
    MaxEl: maxEl,
    MaxCount: maxCount
  };
  return MaxResult;
}

function changeGridSize() {
  var rows = parseInt($("#txtRows").val());
  var cols = parseInt($("#txtCols").val());
  var margin = $("#marginsize").val() / 10;
  var width = (cols * 100) + margin * (cols + 1);
  $("#thumbs").css("width", width);
}

function CreateImagePreview(imgpath) {
  var img = document.createElement("img");
  img.src = imgpath;
  img.setAttribute("class", "thumbimg");
  if (style == 1)
  img.setAttribute("height", 100);
  else if (style == 2)
  img.setAttribute("width", 100);
  else if (style == 3)
  img.setAttribute("width", 100);
  var thumb = document.createElement("div");
  thumb.setAttribute("class", "thumb");
  thumb.setAttribute("id", "thumb" + ImageCount);
  $(thumb).append(img)
  var del = document.createElement("img");
  del.setAttribute("class", "del");
  del.src = "x.png";
  del.setAttribute("onclick", "del('" + "thumb" + ImageCount + "')");
  $(thumb).append(del)
  $("#thumbs").append(thumb);
  if (first) {
    $("#options").fadeIn();
    $("#dragnote").fadeIn();
    first = false;
  }
  FileCount = FileCount + 1;
  if (FileCount == FileLength) {
    FileCount = 0;
    FileLength = 0;
    changeStyle(style);
    makeArray();
  }
}

function ShowErrorMessage(AllowedImages) {
  var ErrorLabel = document.getElementById("lblFB");
  ErrorLabel.innerHTML = "You can add maximum of " + AllowedImages + " Photos.<br/> To add more change the rows and columns";
  ErrorLabel.setAttribute("class", "err");
  $("#lblFB").slideDown();
  setTimeout("hideMsg();", 5000);
}

function ValidateAllowedImages() {
  FileCount = 0;
  FileLength = 0;
  var cols = parseInt($("#txtCols").val());
  var rows = parseInt($("#txtRows").val());
  var AllowedImages = cols * rows;
  if (arr.length >= AllowedImages && style == 3) {
    ShowErrorMessage(AllowedImages);
  } else {
    $('#selectedFile').click();
  }
}

function numberOfImages() {
  document.getElementById('imgCount').innerHTML = arr.length;
}
