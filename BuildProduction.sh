#!/usr/bin/env bash

function pause(){
   read -p "$*"
}
#tabris clean
tabris build android --verbose --no-replace-env-vars --release
C:\Users\Nathan\AppData\Local\Android\build-tools\25.0.2\apksigner sign --ks D:\Nathan\desktop\projects\android\Tabris2-Ichthus-App\keys\rooster_release_key.keystore D:\Nathan\desktop\projects\android\Tabris2-Ichthus-App\build\cordova\platforms\android\build\outputs\apk\android-release-unsigned.apk
C:\Users\Nathan\AppData\Local\Android\build-tools\25.0.2\apksigner verify D:\Nathan\desktop\projects\android\Tabris2-Ichthus-App\keys\rooster_release_key.keystore D:\Nathan\desktop\projects\android\Tabris2-Ichthus-App\build\cordova\platforms\android\build\outputs\apk\android-release-unsigned.apk
pause 'Press [Enter] key to continue...'

