#!/usr/bin/env bash

function pause(){
   read -p "$*"
}
#tabris clean
tabris build android --verbose --debug --no-replace-env-vars
adb devices | tail -n +2 | cut -sf 1 | xargs -iX adb -s X uninstall nathan.fraignt.debug
adb devices | tail -n +2 | cut -sf 1 | xargs -iX adb -s X install D:/Nathan/desktop/projects/android/Tabris2-Ichthus-App/build/cordova/platforms/android/build/outputs/apk/android-debug.apk
adb devices | tail -n +2 | cut -sf 1 | xargs -iX adb -s X shell setprop debug.firebase.analytics.app nathan.fraignt.debug
#adb uninstall nathan.fraignt.debug
#adb install D:/Nathan/desktop/projects/android/Tabris2-Ichthus-App/build/cordova/platforms/android/build/outputs/apk/android-debug.apk
pause 'Press [Enter] key to continue...'
            
