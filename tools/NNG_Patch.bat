@echo off

xcopy /E /Y /I "..\speedcam-patch" "..\_copy_to_usb\config\speedcam-patch\" >>..\MZD_PATCH_LOG.txt 2>&1
:: copy unpatched 'jci-linux_imx6_volans-release' files
xcopy /E /Y /I "..\org\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.*" "..\_copy_to_usb\config\speedcam-patch\jci\nng" >> ..\MZD_PATCH_LOG.txt 2>&1
:: patch 'jci-linux_imx6_volans-release' files with \JCI_NNG_Tool_CMD from modfreakz
echo Patching jci-linux_imx6_volans-release.org.56.00.100A-ADR >> ..\MZD_PATCH_LOG.txt
echo Patching jci-linux_imx6_volans-release.org.56.00.100A-ADR
JCI_NNG_Tool_CMD S ..\_copy_to_usb\config\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.org.56.00.100A-ADR >> ..\MZD_PATCH_LOG.txt 2>&1
echo Patching jci-linux_imx6_volans-release.org.59.00.326A-ADR >> ..\MZD_PATCH_LOG.txt
echo Patching jci-linux_imx6_volans-release.org.59.00.326A-ADR
JCI_NNG_Tool_CMD S ..\_copy_to_usb\config\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.org.59.00.326A-ADR >> ..\MZD_PATCH_LOG.txt 2>&1
echo Patching jci-linux_imx6_volans-release.org.55.00.760A-NA >> ..\MZD_PATCH_LOG.txt
echo Patching jci-linux_imx6_volans-release.org.55.00.760A-NA
JCI_NNG_Tool_CMD S ..\_copy_to_usb\config\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.org.55.00.760A-NA >> ..\MZD_PATCH_LOG.txt 2>&1
echo Patching jci-linux_imx6_volans-release.org.58.00.250A-NA >> ..\MZD_PATCH_LOG.txt
echo Patching jci-linux_imx6_volans-release.org.58.00.250A-NA
JCI_NNG_Tool_CMD S ..\_copy_to_usb\config\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.org.58.00.250A-NA >> ..\MZD_PATCH_LOG.txt 2>&1
echo Patching jci-linux_imx6_volans-release.org.59.00.441A-NA >> ..\MZD_PATCH_LOG.txt
echo Patching jci-linux_imx6_volans-release.org.59.00.441A-NA
JCI_NNG_Tool_CMD S ..\_copy_to_usb\config\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.org.59.00.441A-NA >> ..\MZD_PATCH_LOG.txt 2>&1
echo Patching jci-linux_imx6_volans-release.org.56.00.401A-JP >> ..\MZD_PATCH_LOG.txt
echo Patching jci-linux_imx6_volans-release.org.56.00.401A-JP
JCI_NNG_Tool_CMD S ..\_copy_to_usb\config\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.org.56.00.401A-JP >> ..\MZD_PATCH_LOG.txt 2>&1
echo Patching jci-linux_imx6_volans-release.org.56.00.513B-EU >> ..\MZD_PATCH_LOG.txt
echo Patching jci-linux_imx6_volans-release.org.56.00.513B-EU
JCI_NNG_Tool_CMD S ..\_copy_to_usb\config\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.org.56.00.513B-EU >> ..\MZD_PATCH_LOG.txt 2>&1
echo Patching jci-linux_imx6_volans-release.org.59.00.331A-EU >> ..\MZD_PATCH_LOG.txt
echo Patching jci-linux_imx6_volans-release.org.59.00.331A-EU
JCI_NNG_Tool_CMD S ..\_copy_to_usb\config\speedcam-patch\jci\nng\jci-linux_imx6_volans-release.org.59.00.331A-EU >> ..\MZD_PATCH_LOG.txt 2>&1

echo Patching Complete!
EXIT \B 1
