var allOptions = {/*"menu":[
  {"menuItem":"backup","menuLabel","Do backup of JCI folder before installing tweaks?"},
  {"menuItem":"end","menuLabel","Ready? Start The compilation!"},
  {"menuItem":"help","menuLabel","help"},
  {"menuItem":"instordeinst1","menuLabel","Installation"},
  {"menuItem":"instordeinst2","menuLabel","Uninstallation"},
  {"menuItem":"language1","menuLabel","Language:"},
  {"menuItem":"language2","menuLabel","for switching"},
  {"menuItem":"start1","menuLabel","Press"},
  {"menuItem":"start2","menuLabel","to activate/deactivate"},
  {"menuItem":"start3","menuLabel","to select all"},
], */"options":[
  {"OpName":"Touchscreen",
  "OpId":"01","INST":"Enable the touchscreen while moving?",
  "DEINST":"Disable the touchscreen again while moving?",
  "toolTip":"Allows the use of the touchscreen also during driving.","checked":""},
  {"OpName":"Disclaimer time",
  "OpId":"02","INST":"Reduce disclaimer time from 3.5 to 0.5 seconds?",
  "DEINST":"Restore disclaimer time to 3.5 seconds?",
  "toolTip":"Reducing the expansion time of the disclaimer from 3.5 to 0.5 seconds.","checked":""},
  {"OpName":"Safety warning label from the reverse camera",
  "OpId":"02","INST":"Remove the safety warning label from the reverse camera?",
  "DEINST":"Restore the safety warning label from the reverse camera?",
  "toolTip":"No security warning at the bottom when activating the rear camera","checked":""},
  {"OpName":"Blank album art frame",
  "OpId":"04","INST":"Remove the blank album art frame?",
  "DEINST":"Restore the blank album art frame?",
  "toolTip":"The empty album cover frame is removed, which is displayed when there is no entry in the Gracenote database for the artist.##Then the image of a radio is displayed, if there is no cover in the MP3 tag too.","checked":""},
  {"OpName":"Background image",
  "OpId":"05","INST":"Change to an individual background image?",
  "DEINST":"Change the background image back to original?",
  "toolTip":"Change the background image##(Please change the file 'background.png' in 'config' folder)##The one from the individual color schemes will then be overwritten again!","checked":""},
  {"OpName":"Speedometer by Diginix",
  "OpId":"03","INST":"Install speedometer by Diginix?",
  "DEINST":"Remove speedometer by Diginix?",
  "toolTip":"Speedometer with compass in the application menu##- below the speedometer is km/h or mph, depending on the setting#- speed range up to 240 km/h#- consumption values#- Optimized graphics modules with new speedometer pointer#- Small speedometer needle for top speed in the analog part#- the picture for the speedometer scale has different lengths or bright lines for 5, 10 and 20 km/h jumps#- right table english or german German and color / size optimized#- All numbers have a slight shadow around to better stand out from the background.#- On travel direction rotating compass central to the current speed#- Animated overlay in the status with GPS speed and direction of travel in each menu can be prepared by touch at the clock#- Latitude and longitude in the right table#- When the Navi or Rear Camera is started, it automatically appears","checked":"",
  "toolTip":"For the small speedo in the status bar you have to install date_to_statusbar mod V2.2 too. Therefore it will be automatically selected, if not already done.","checked":""},
  {"OpName":"Date_to_statusbar_mod_by_diginix",
  "OpId":"04","INST":"Install date_to_statusbar_mod by diginix?",
  "DEINST":"Remove date_to_statusbar_mod by diginix?",
  "toolTip":"Date in status bar##- Permanently visible date + icons by the clock, even if system messages are displayed.","checked":""},
  {"OpName":"Custom infotainment colors",
  "OpId":"05","INST":"Install custom_color_scheme?",
  "DEINST":"Remove custom_infotainment_colors (back to red color scheme)?",
  "toolTip":"Individual color scheme with the following colors:##- Blue#- Green#- Orange#- Pink#- Purple#- Silver# - Yellow","checked":""},
  {"OpName":"Pause_on_mute",
  "OpId":"06","INST":"Install pause_on_mute?",
  "DEINST":"Remove pause_on_mute?",
  "toolTip":"Pause_on_mute##When pressing mute (pressing the volume button) played media are also paused.","checked":""},
  {"OpName":"Semi-transparent parking sensor graphics",
  "OpId":"07","INST":"Install semi-transparent parking sensor graphics?",
  "DEINST":"Remove semi-transp. parking sensor graphics f. proximity sensors?",
  "toolTip":"Semi-transparent parking sensor graphics ##Semitransparent parking sensor graphics for proximity sensors.##When activating the rear camera, the car is displayed at the top right corner.#The graphics now appear semitransparent by installing tweak.","checked":""},
  {"OpName":"Improved_list_loop",
  "OpId":"08","INST":"Install improved_list_loop (with optional shorter_delay_mod)?",
  "OpId":"08","INST":"Install shorter_delay_mod?",
  "DEINST":"Remove improved_list_loop and shorter_delay_loop?",
  "toolTip":"Improved list loop##Loop for all lists and submenu (music, contacts, etc.).#You can now jump from the top position of a list to the bottom and vice versa.###Shorter delay mod##Reducing the waiting time for page by page with the multi commander from 1.5 to 0.3 seconds.","checked":""},
  {"OpName":"Main_menu_loop",
  "OpId":"09","INST":"Install main_menu_loop?",
  "DEINST":"Remove main_menu_loop?",
  "toolTip":"Main menu loop##Loop for the main menu#You can jump from left to far right, and vice versa.","checked":""},
  {"OpName":"No_more_disclaimer",
  "OpId":"10","INST":"Remove disclaimer completely?",
  "DEINST":"Restore disclaimer (to 3.5 seconds)?",
  "toolTip":"No more disclaimer##The disclaimer is completely removed.","checked":""},
  {"OpName":"Media_order_patching",
  "OpId":"11","INST":"Enable media_order patch and FLAC support?",
  "DEINST":"Remove media_order_patching?",
  "toolTip":"Music will be sorted alphabetically and not by date with new entries first##Support for audio format FLAC","checked":""},
  {"OpName":"Order_of_audio_source_list",
  "OpId":"12","INST":"Change order of the audio source list?",
  "DEINST":"Restore order of audio source list back to original?",
  "toolTip":"Change order of the audio source list##The order of the audio source list is arranged as follows:## 'FMRadio'# 'DAB'# 'USB_A'# 'USB_B'# 'btaudio'# 'CD'# 'SatRadio'# 'AhaRadio'# ' Pandora'# ' Stitcher'# 'AuxIn'# 'amradio'# 'DVD'# 'TV'","checked":""},
  {"OpName":"Speedcam patch",
  "OpId":"13","INST":"Install speedcam-patch?",
  "DEINST":"Remove speedcam-patch?",
  "toolTip":"Speedcam patch##The navigation is so patched so that database for speed cameras are accepted.##You can then copy a file 'speedcam.txt' on the SD card for the navigation, which will be imported.","checked":""},
  {"OpName":"Castscreen-receiver",
  "OpId":"14","INST":"Install castscreen-receiver?",
  "DEINST":"Remove castscreen-receiver?",
  "toolTip":"Castscreen receiver##After installation you can mirror the smartphone screen at the infotainment display (mirroring)##- You have to install the castscreen app on your Android Phone (castscreen-1.0.apk) The app can be found in the 'config' folder of your USB drive# - activate the debug mode on your smartphone#- connect the smartphone with USB cable to the infotainment system#- start the app settings: H264, 800x480 @ 160, 1 mbps, then input 127.0.0.1 and press input receiver, then tap Start on right-up corner.","checked":""},
  {"OpName":"Android_Auto_Headunit_App",
  "OpId":"15","INST":"Install Android Auto Headunit App?",
  "DEINST":"Remove Android Auto Headunit App?",
  "toolTip":"Android Car Headunit app##Android car for the infotainment system.## 1. Install the Android app from google play store:#https://play.google.com/store/apps/details?id=com.google.android.projection.gearhead##2. Connect the phone to USB and pair the phone bluetooth with the CMU#3. Manually switch to Bluetooth Audio Input.#4. Click on the AA icon under Applications Menu on the CMU#5. A black screen with credits should open up first and input#5. Android Auto will then start. If it does not, pull out the USB and start over again (or check the installation.)# 6. 2 ways to stop AA - Disconnect the USB cable or use the onscreen menu 'Return to Mazda Connect' on last screen with speedo icon.##7. Once disconnected, the back screen will remain. Press Home Button on the Mazda's Commander to close it. I had to do this because js double click wasn't working.##What does not work:#1. Reverse camera gets blacked out.#2. Voice Control#3. Touch drag / multi touch#4. Google Maps night mode always on.","checked":""},
  {"OpName":"SSH_bringback",
  "OpId":"16","INST":"Install SSH_bringback (f. 56.00.51x)? (No removing possible!)",
  "toolTip":"With FW 56.00.511 Mazda has removed SSH access.##With SSH_bringback this will be reinstalled.##This tweak will still only be installed if FW 56.00.511 is recognized, if it's 56.00.230, nothing happens.","checked":""},
  {"OpName":"Message_reply",
  "OpId":"17","INST":"Remove automatic message replies?",
  "DEINST":"Restore automatic message replies?",
  "toolTip":"Removes the text 'Sent from my Mazda Quick Text System' if answering messages","checked":""},
  {"OpName":"Swapfile",
  "OpId":"18","INST":"Generate swapfile for media player v2?",
  "DEINST":"Remove swapfile?",
  "toolTip":"The installation of the swap file must be done on a USB drive with music and/or movies, that remains in the car.##The installation files are automatically deleted, the drive may no longer be removed during operation, because the system will use it also as memory.##Only remove the USB drive if the MZD system is off.","checked":""},
  {"OpName":"1sec-diagmenu",
  "OpId":"19","INST":"Install 1 sec. diagnostic menu?",
  "DEINST":"Remove 1 sec. diagnostic menu?",
  "toolTip":"Allows you to open the diagnostic menus at pressure for one second on the clock at the top right of the display settings menu.","checked":""},
  {"OpName":"Boot-animation",
  "OpId":"20","INST":"Disable boot animation?",
  "DEINST":"Boot Animation enable again?",
  "toolTip":"The boot animation that leads to the menu with the red buttons will be disabled.","checked":""},
  {"OpName":"Bigger-album-art",
  "OpId":"21","INST":"Install bigger album art cover?",
  "DEINST":"Album art cover back to original?",
  "toolTip":"You get a bigger album art graphic.","checked":""},
  {"OpName":"NoButtons background graphics",
  "OpId":"22","INST":"No background behind buttons?",
  "DEINST":"Background behind buttons back to original?",
  "toolTip":"No background for the buttons.","checked":""},
  {"OpName":"Videoplayer",
  "OpId":"23","INST":"Install videoplayer?",
  "DEINST":"Remove videoplayer?",
  "toolTip":"Videoplayer in the application menu","checked":""},
  {"OpName":"FuelConsumtion Tweak",
  "OpId":"24","INST":"Install Fuel Consumption Tweak?",
  "DEINST":"Remove Fuel Consumption Tweak?",
  "toolTip":"Fuel Consumption Tweak##Additional display of KM / L","checked":""},
  {"OpName":"BackgroundRotator",
  "OpId":"25","INST":"Install Background Rotator?",
  "DEINST":"Remove Background Rotator?",
  "toolTip":"Background Rotator Tweak##Cycles through 10 Backgrounds over 10 minutes (600 seconds - 60 seconds per)##To change backgrounds create a png with 8000px X 480px and save as choose\config_all\BackgroundRotator\jci\gui\common\images\background.png##(WARNING: this tweak will overwrite common.css, save a backup if already modified.)","checked":""}
], };
/*
Others
end_deletetemp="Delete temp folders ..."
INST_wrong="No! Please choose right version!"
copywait="Please wait, copy all selected files ..."
ready--1="All files copied, the USB drive can be removed now."
help--windowtitle="                                     Please click or use cursor:"
help_backup="Before installation / uninstallation of the selected tweaks, a copy of the /JCI folder will be copied on the USB flash drive."
warning_15="ATTENTION - Important information##BEFORE DOING A FACTORY RESET, PLEASE UNINSTALL AT LEAST AA!#OTHERWISE THE SYSTEM STAYS AT MAZDA BOOT LOGO!##As far as we know, this could be due to the button-patch installation for Android Auto.#But it seems, that there is unfortunately no chance to get access again on the CMU after doing a factory reset if you have newer FW versions (.51x) without SSH access via WIFI.##You have to go to your dealer, say that you've done a factory reset and hope, he will help you!"
update_found1="New version"
update_found2="available##Will you update?"
update_done1="Update done to new version"
update_done2="AIO will now restart again"

Which language?

[1] English
[2] German
[3] Frensh
[4] Spanish
[5] Polish
[6] Mexican
[7] Turkish
[8] Slovak

Which color?

[1] Blue
[2] Green
[3] Orange
[4] Pink
[5] Purple
[6] Silver
[7] Yellow
[8] Reg (original)
[9] carOS

Speedcam patch

Databases for Europe or Germany
with or without mobile cameras

[1] install for Europe with mobile cameras
[2] install for Europe without mob. cameras
[3] install for Germany with mobile cameras
[4] install for Germany without mob. cameras
[5] install for Turkey
[6] install no speecam.txt file
  (copy own to config\speedcam-patch)

  Which version?

	[1] Date to statusbar V1.0
	    Left from clock with WLAN/BT/Akku icons above

	[2] Date to statusbar V2.1
	    Permanently visible date

	[3] Date to statusbar V2.2  (dd.mm)
	    Permanently visible numeric date
	    Disbaled border of system messages
	    Smaller font size for all statusbar texts

	[4] Date to statusbar V2.3  (mm/dd)

"end":[
    {"endId":"01","message":"Should I copy the data directly to an USB drive card?"},
    {"endId":"02","message":"The followoing removable drives are available:"},
    {"endId":"03","message":"On which drive should I copy?"},
    {"endId":"04","message":"Please copy content of created folder"."/n"."_copy_content_to_root_of_fat32_usb_stick"."/n"."to USB drive."}
], "speedometer_options":[
  {"speedOp":"01","title":"Speedometer Launguage?","en":"English Version","de":"German Version","sp":"Spanish Version","pl":"Polish Version","sl":"Slovak Version","tk":"Turkish Version","fr":"French Version"},
  {"speedOp":"02","title":"MPH or KM/H?""mph":"mph","kmh":"km/h"},
  {"speedOp":"03","title":"Activate Small Speedometer In Satusbar?","gps":"Activate (GPS Values)","car":"Activate (Car Values)","none":"Do Not Activate Small Speedometer"},
  {"speedOp":"04","title":"Speedometer Background?","orig":"Original Background (As In V 4.2 and Below)","ind":"Individual Background"},
  {"speedOp":"04","title":"Black Background Opacity? (To Reduce Visibility of Custom MZD Background Image)","00":"0.0 (Fully Transparent)","10":"1.0 (Completely Black)"},
]

/*
var allOptions = {"options":[
{"OpName":"Touchscreen","OpId":"01",
"toolTip":"Stuff Stuff Stuff",
"checked":""},
{"OpId":"02","OpName":"Disclaimer Time","toolTip":"","checked":""},
{"OpId":"03","OpName":"Reverse Saftey Warning","toolTip":"","checked":""},
{"OpId":"04","OpName":"Remove Blank Album Art","toolTip":"","checked":""},
{"OpId":"05","OpName":"Date to Statusbar","toolTip":"","checked":""},
{"OpId":"05","OpName":"Semi-teansparent Parking Sensor Graphics","toolTip":"","checked":""},
{"OpId":"06","OpName":"Background","toolTip":"","checked":""},
{"OpId":"07","OpName":"List Loop","toolTip":"","checked":"checked","checked":""},
{"OpId":"08","OpName":"Media Order Patch","toolTip":"","checked":""},
{"OpId":"09","OpName":"Order of Audio Source List","toolTip":"","checked":""},
{"OpId":"10","OpName":"Speedcam Patch","toolTip":"","checked":""},
{"OpId":"11","OpName":"Castscreen Receiver","toolTip":"","checked":""},
{"OpId":"12","OpName":"Android Auto Headunit App","toolTip":"","checked":""},
{"OpId":"13","OpName":"Media Order Patch & FLAC Support","toolTip":"","checked":""},
{"OpId":"14","OpName":"Message Replies","toolTip":"","checked":""},
{"OpId":"15","OpName":"1 Second Diagnostic Menu","toolTip":"","checked":""},
{"OpId":"16","OpName":"Boot Animation","toolTip":"","checked":""},
{"OpId":"17","OpName":"Bigger Album Art","toolTip":"","checked":""},
{"OpId":"18","OpName":"Button Background","toolTip":"","checked":""},
{"OpId":"19","OpName":"Fuel Consumption Tweak","toolTip":"","checked":""},
{"OpId":"20","OpName":"Background","toolTip":"","checked":""},
{"OpId":"21","OpName":"Background","toolTip":"","checked":""},
{"OpId":"22","OpName":"Speedometer","toolTip":"","checked":""},
{"OpId":"23","OpName":"Video Player","toolTip":"","checked":""},
{"OpId":"24","OpName":"Swap File","toolTip":"","checked":""},
{"OpId":"25","OpName":"Backup JCI Folder","toolTip":"","checked":""}
]};
*/
