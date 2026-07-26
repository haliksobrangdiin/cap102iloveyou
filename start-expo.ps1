$env:ANDROID_HOME = "C:\Users\user\AppData\Local\Android\Sdk"
$env:PATH += ";C:\Users\user\AppData\Local\Android\Sdk\platform-tools"
$env:NODE_OPTIONS = "--max-old-space-size=4096"
npx expo start -c --android
