#!/usr/bin/env bash

function pause(){
   read -p "$*"
}

tabris build android --verbose --debug --no-replace-env-vars
adb uninstall nathan.fraignt.debug
adb install D:/Nathan/desktop/projects/android/Tabris2-Ichthus-App/build/cordova/platforms/android/build/outputs/apk/android-debug.apk
pause 'Press [Enter] key to continue...'