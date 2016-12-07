/* ************************************************************************** *\
** ************************************************************************** **
** MZD-AIO-TI                                                                 **
** By: Trezdog44 - Trevor Martin                                              **
** http://mazdatweaks.com                                                     **
** ©2016 Trevelopment                                                         **
**                                                                            **
** home.js - The main AngularJS module & controller used to connect the main  **
** process and in the build process.                                          **
**                                                                            **
** ************************************************************************** **
\* ************************************************************************** */
(function () {
  'use strict'
  angular.module('AIO', ['checklist-model', 'ngSanitize', 'ngRoute'])// 'angular-electron'
  .controller('JoinerCtrl', ['$scope', '$http', JoinerCtrl])
  .controller('TranslatorCtrl', ['$scope', '$http', TranslatorCtrl])
  .controller('helpCtrl', ['$scope', '$http', helpCtrl])
  .controller('MainCtrl', function ($scope, $http, $route, $location) {
    // All scoped variables for labels come from launguage files in the '/lang' folder
    $scope.newLanguage = 'NewLanguage'
    $scope.menu = langObj.menu
    $scope.mainOps = langObj.mainOps
    $scope.languages = langObj.languages
    $scope.tourMsgs = langObj.tourMsgs
    $scope.options = langObj.tweakOps
    $scope.disclaimOps = langObj.disclaimOps
    $scope.colors = langObj.colors
    $scope.speedcamOps = langObj.speedcamOps
    $scope.d2sbOps = langObj.d2sbOps
    $scope.speedoOps = langObj.speedoOps
    $scope.faqs = langObj.FAQs
    $scope.bgimg = null
    $scope.user = {
      lang: lang,
      options: [],
      menu: [9],
      mainOps: [0, 5, 7],
      disclaimOps: 0,
      colors: 1,
      speedcamOps: 0,
      d2sbOps: 3,
      useColorBG: false,
      darkMode: settings.get('darkMode') || false,
      flipOption: settings.get('flipOption') || '',
      transMsg: persistantData.get('transMsg') || true,
      copydir: persistantData.get('copyFolderLocation')
    }
    $scope.user.speedoOps = {
      lang: {id: 0},
      xph: {id: 10},
      sml: {id: 22},
      bg: {id: 30},
      opac: 0
    }
    $scope.$on('$routeChangeSuccess', function () {
      getLanguage()
      if ($location.path().includes('translate')) {
        $scope.getScript('assets/js/translator.js')
        $scope.getScript('assets/vendor/bootstrap.min.js')
      } else if ($location.path().includes('joiner')) {
        $scope.getScript('PhotoJoiner_files/jquery-1.8.3.min.js')
        $scope.getScript('PhotoJoiner_files/jquery.fineuploader-3.0.min.js')
        $scope.getScript('PhotoJoiner_files/jquery-ui.js')
        $scope.getScript('PhotoJoiner_files/PhotoJoin.js')
        $scope.getScript('../assets/vendor/jquery.mousewheel.min.js')
        $(function () {
          $('#thumbs').mousewheel(function (event, delta) {
            this.scrollLeft -= (delta * 200)
            event.preventDefault()
          })
        })
      } else {
        $scope.getScript('assets/js/tour.js')
        //  $scope.getScript('assets/vendor/bootstrap.min.js')
        $scope.getScript('assets/vendor/featherlight.min.js')
        // Handy litle jQuery script for Inner Help Menu Togglers
        $(function () {
          $(`.troubleshootingToggler, .revertToggler, .warnToggler, .faqToggler, .kiToggler, .ttToggler`).click(function () {
            $(this).siblings().not(`.troubleshootingToggler, .revertToggler, .warnToggler, .faqToggler, .kiToggler, .ttToggler`).not($(this).next()).slideUp(`fast`)
            $(this).next().slideToggle(`fast`)
            $('.w3-bottombar[class*=Toggler]').css(`position`, `absolute`).addClass('w3-black')
          })
          $('.w3-bottombar[class*="Toggler"]').click(function () {
            $(this).css(`position`, `static`).removeClass('w3-black')
          })
          $('.draggable').draggable()
          $('[data-toggle="tooltip"]').tooltip({html: true, delay: {show: 1200, hide: 200}})
          $('.imgframe').mousewheel(function (event, delta) {
            this.scrollLeft -= (delta * 400)
            event.preventDefault()
          })
        })
      }
      if (persistantData.get('menuLock')) {
        $('.hideNav').addClass('showNav')
        $('.hideNav').parent().addClass('showNav')
        $('.w3-overlay').addClass('showNav')
      }
    })
    if ($scope.user.darkMode) {
      $('html, body, #sidePanel').addClass('w3-black')
    } else {
      $('html, body, #sidePanel').removeClass('w3-black')
    }
    $scope.miniSpeedo = function () {
      if ($scope.user.speedoOps.sml.id === 20 || $scope.user.speedoOps.sml.id === 21) {
        if ($scope.user.options.indexOf(20) === -1) {
          $scope.user.options.push(20)
        }
        var unindex = $scope.user.options.indexOf(120)
        if (unindex > -1) {
          $scope.user.options.splice(unindex, 1)
        }
        if ($scope.user.d2sbOps !== 3) {
          $scope.user.d2sbOps = 3
        }
      }
      let speedoNotification = new Notification('Mini Speedometer', {
        body: 'Activating the Speedometer in Statusbar also activates Date_To_Statusbar mod v2.3'
      })
      speedoNotification.onclick = () => {
        console.log('Speedo Notification clicked')
      }
    }
    // TODO: More saving options. Save different settingss by name.
    // $scope.$storage = $localStorage
    $scope.saveOps = function () {
      if ($location.path().includes('translate')) {
        $('#submit').click()
      } else {
        settings.set($scope.user)
        bootbox.alert({
          message: 'Options Saved!',
          size: 'small'
        })
      }
    }
    $scope.miniSave = function () {
      settings.set(`darkMode`, $scope.user.darkMode)
      settings.set(`flipOption`, $scope.user.flipOption)
      bootbox.alert({
        message: 'Saved!',
        size: 'small'
      })
    }
    $scope.loadOps = function () {
      if ($location.path().includes('translate')) {
        $('#import').click()
      } else {
        $scope.user = settings.store
        bootbox.alert({
          message: 'Options Loaded!',
          size: 'small',
          callback: function () {
            $scope.$apply()
          }
        })
      }
    }
    ipc.on('save-options', () => {
      $scope.saveOps()
    })
    ipc.on('load-options', () => {
      $scope.loadOps()
    })
    $scope.instAll = function () {
      $scope.user.mainOps = [0, 2, 3, 5, 7]// cleanArray($scope.mainOps.map(function (item) { if (Number(item.id)==0||Number(item.id)==3||Number(item.id)==5) {return Number(item.id)}else{return}}))
      $scope.user.options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 22]// cleanArray($scope.options.map(function (item) { if (!(Number(item.id)==25||Number(item.id)==18||Number(item.id)==23||Number(item.id)==24)) {return Number(item.id)}else{return}}))
      $scope.user.colors = 2
      $scope.user.speedoOps.lang.id = 0
      $scope.user.speedoOps.xph.id = 10
      $scope.user.speedoOps.sml.id = 20
      $scope.user.speedoOps.bg.id = 30
      $scope.user.speedoOps.opac = 0
    }
    $scope.uncheckAll = function () {
      $scope.user.options = []
      $scope.user.mainOps = [7]
      $scope.user.speedoOps.lang.id = 0
      $scope.user.speedoOps.xph.id = 10
      $scope.user.speedoOps.sml.id = 20
      $scope.user.speedoOps.bg.id = 30
      $scope.user.speedoOps.opac = 0
      $scope.user.colors = 1
      $scope.user.disclaimOps = 0
      $scope.user.speedcamOps = 0
      $scope.user.d2sbOps = 2
    }
    $scope.uninstAll = function () {
      /* $scope.user.options.splice(0, $scope.user.options.length)
      $scope.user.options.push(1) */
      $scope.user.options = $scope.options.map(function (item) { return Number(item.id) + 100 })
      $scope.user.mainOps = [0, 2, 3, 5, 7]
      // $scope.user.mainOps = $scope.mainOps.map(function (item) { if (Number(item.id)==1||Number(item.id)==3) {return Number(item.id)}})
      $scope.user.colors = 0
      $('#defaultBgBtn').click()
    }
    $scope.helpTour = function () {
      helpDropdown()
      $scope.startTour()
    }
    $scope.startTour = function () {
      startTour($scope.tourMsgs)
    }
    $scope.getLanguage = function () {
      var langURL = getParameterByName('lang')
      if (!langURL) {
        if (persistantData.has('lang')) {
          langURL = persistantData.get('lang')
        } else {
          return
        }
      } else {
        persistantData.set('lang', langURL)
      }
      langURL = `./lang/${langURL}.aio.json`
      $scope.getScript(langURL)
    }
    $scope.getScript = function (url) {
      $.getScript(url, function (data, textStatus, jqxhr) {
        // console.log( data ) // Data returned
        // console.log( textStatus ) // Success
        // console.log( jqxhr.status ) // 200
        // console.log( `Load was performed.` )
      })
    }
    $scope.startCompile = function () { // check for downloaded files
      if ($scope.user.options.length === 0 && $scope.user.mainOps.length <= 1) {
        bootbox.alert({
          title: '<center>Select tweaks before starting the compilation</center>',
          message: '<center>Try choosing some tweaks first!</center>'
        })
        return
      }
      var spfiles = fs.existsSync(`${app.getPath('userData')}/speedcam-patch/`)
      var csfiles = fs.existsSync(`${app.getPath('userData')}/color-schemes/`)
      if ($scope.user.mainOps.indexOf(3) !== -1) {
        if (!csfiles) {
          bootbox.alert({
            title: 'Please Download Color Scheme Files Before Compiling',
            message: '<a href="" class="w3-btn" onclick="ipc.send(\'download-aio-files\',\'color-schemes\')">Download Color Scheme Files</a>'
          })
          return
        }
      }
      if ($scope.user.options.indexOf(23) !== -1 || $scope.user.options.indexOf(123) !== -1) {
        if (!spfiles) {
          bootbox.alert({
            title: 'Please Download Speedcam Patch Files Before Compiling',
            message: '<a href="" class="w3-btn" onclick="ipc.send(\'download-aio-files\',\'speedcam-patch\')">Download Speedcam Patch Files</a>'
          })
          return
        }
      }
      $scope.ConfirmCompile()
    }
    $scope.ConfirmCompile = function () { // TODO: Hide uninstal/install title when there is nothing under respective title
      var hasUninst = false
      for (var i = 0; i < $scope.user.options.length; i++) {
        if ($scope.user.options[i].id > 99) {
          hasUninst = true
        }
      }
      var msg = `<div style='font-size:12px;text-align:center;'>`
      if ($scope.user.mainOps.indexOf(1) !== -1) { msg += `***** ${$scope.mainOps.backup.label} ****<br />` }
      if ($scope.user.mainOps.indexOf(0) !== -1) { msg += `***** ${$scope.mainOps.wifi.label} ****<br />` }
      if ($scope.user.mainOps.indexOf(2) !== -1) { msg += `***** ${$scope.mainOps.background.label} ****<br />` }
      if ($scope.user.mainOps.indexOf(6) !== -1) { msg += `***** ${$scope.mainOps.backgroundrotator.label} ****<br />` }
      if ($scope.user.mainOps.indexOf(4) !== -1) { msg += `***** ${$scope.mainOps.sshbringback.label} ****<br />` }
      if ($scope.user.mainOps.indexOf(3) !== -1) { msg += `***** ${$scope.mainOps.colors.label} ****<br />` }
      if ($scope.user.mainOps.indexOf(5) !== -1) { msg += `***** ${$scope.mainOps.sdcid.label} ****<br />` }
      msg += $scope.options.map(function (item) { if ($scope.user.options.indexOf(Number(item.id)) !== -1) { return item.INST + `<br />` } })
      if (hasUninst) { msg += `<h4>***${$scope.menu.uninstall.label}:***</h4>` }
      msg += $scope.options.map(function (item) { if ($scope.user.options.indexOf(Number(item.id) + 100) !== -1) { return item.DEINST + `<br />` } })
      msg += '</div>'
      msg = msg.split(`,`).join(``)
      bootbox.confirm({
        title: `<h3>*********** ${$scope.menu.tweakstoinstall.label}: *********** </h3>`,
        message: msg,
        className: 'confirmCompile',
        buttons: {
          confirm: {
            label: 'Start',
            className: 'btn-success'
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-danger'
          }
        },
        callback: function (result) {
          if (result) {
            var bg = $.featherlight($('#bgimg img'), { variant: 'loadingBG', closeOnClick: 'anywhere' })
            bg.open()
            if ($scope.user.mainOps.indexOf(2) === -1) {
              bg.close()
            }
            $('#compileButton').hide()
            setTimeout(function () {
              bg.close()
            }, 30000)
            setTimeout(function () {
              introJs().addHints()
            }, 240000)
            setTimeout(function () {
              introJs().hideHints()
            }, 420000)
            $scope.compileTweaks()
          }
        }
      })
      $scope.compileTweaks = function () {
        buildTweakFile($scope.user)
      }
    }
  })
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/main.htm'
    })
    .when('/translate', {
      templateUrl: 'views/translate.html',
      controller: 'TranslatorCtrl'
    })
    .when('/joiner', {
      templateUrl: 'PhotoJoiner/PhotoJoiner.html',
      controller: 'JoinerCtrl'
    })
    .otherwise({
      template: `<h1>MZD-AIO-TI</h1>`
    })
  })
  .directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
      scope.$watch(
        function (scope) {
          // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile)
        },
        function (value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value)
          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope)
        }
      )
    }
  }])
  .filter('htmlToPlaintext', function () {
    return function (text) {
      return text ? String(text).replace(/<[^>]+>/gm, '') : ''
    }
  })
  .filter('markdown', function ($sce) {
    var Converter = new Showdown.converter()
    return function (value) {
      var html = Converter.makeHtml(value || '')
      return $sce.trustAsHtml(html)
    }
  })
  function helpCtrl ($scope, $http) {
    $scope.helpMsgs = langObj.helpMsgs
  }
  function JoinerCtrl ($scope, $http) {
    $scope.imgOps = langObj.imgOps
  }
  function TranslatorCtrl ($scope, $http) {
    $scope.trans = langObj.translatorWindow
  }
})()
