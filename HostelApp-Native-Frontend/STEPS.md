Created using :

# npx @react-native-community/cli init WafaScheme

Then downloaded some package for react navigation:

# npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-gesture-handler

For navigation edit MainActivity page that is :
override fun onCreate(savedInstanceState: Bundle?) {
super.onCreate(null)
}

and make sure to add the following import statement at the top of this file below your package statement:
import android.os.Bundle;

# npm i react-native-vector-icons:

And below setup for Vector icon
**
Edit android/app/build.gradle (NOT android/build.gradle) and add:
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
**
Edit the android/settings.gradle file as shown below:

- include ':react-native-vector-icons'
- project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node\*modules/react-native-vector-icons/android') \*\*
  Edit the android/app/build.gradle (located in the app folder) as shown below:
  dependencies {
  implementation fileTree(dir: "libs", include: ["_.jar"])
  //noinspection GradleDynamicVersion
  implementation "com.facebook.react:react-native:+" // From node_modules
- implementation project(':react-native-vector-icons')
  }
  \*\*

For React Native Paper

# npm install react-native-paper

From v5 there is a need to install react-native-safe-area-context for handling safe area.
If you're on a vanilla React Native project, you also need to install and link react-native-vector-icons.
And add below inside babel.config.js file
env: {
production: {
plugins: ['react-native-paper/babel'],
},
},

For tailwind css npm install nativewind tailwindcss AND Run npx tailwindcss init to create a tailwind.config.js file
Inside that file add :
only install # npm i tailwindcss@3.3.2 and nativewind@2.0.11 \*\*

/** @type {import('tailwindcss').Config} \*/
module.exports = {
content: ["./App.{js,jsx,ts,tsx}", "./src/**/\*.{js,jsx,ts,tsx}"],
theme: {
extend: {
colors: {
// customeColor
},
},
},
plugins: [],
}
You also need to include the babel plugin

# plugins: ["nativewind/babel"],

To use react-native-reanimated :

# npm install react-native-reanimated

Add this inside babel.config.js
module.exports = {
presets: [
... // don't add it here :
],
plugins: [
...
'react-native-reanimated/plugin', ///Here
],
};
Clear Metro bundler cache (recommended)

# npm start -- --reset-cache

Clean the graldew and restart the project

And import at top of index.js file

# import 'react-native-gesture-handler';

# import 'react-native-reanimated';

For Splash Screen :

# npm i react-native-bootsplash

Then
Edit your android/app/src/main/java/com/yourapp/MainActivity.{java,kt} file:

// add these required imports:

# import android.os.Bundle

# import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

// …

override fun onCreate(savedInstanceState: Bundle?) {
RNBootSplash.init(this, R.style.BootTheme) // ⬅️ initialize the splash screen
super.onCreate(savedInstanceState) // super.onCreate(null) with react-native-screens
}
}

And also in AndroidManifest.xml change the
android:theme="@style/AppTheme"
To
android:theme="@style/BootTheme"

And in styles.xml Add the

  <style name="BootTheme" parent="Theme.BootSplash">
        <item name="bootSplashBackground">#000</item>
        <item name="bootSplashLogo">@drawable/applogo</item>   ///logo 
        <item name="postBootSplashTheme">@style/AppTheme</item>
    </style>

For Redux:

# npm install @reduxjs/toolkit react-redux;

make setup

For BlurView

# npm i @react-native-community/blur

For AsyncStorage

# npm install @react-native-async-storage/async-storage

For SVG transform

# npm install react-native-svg

# npm install react-native-svg-transformer

And then
metro.config.js:
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const defaultConfig = getDefaultConfig(\_\_dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;
/\*\*

- Metro configuration
- https://reactnative.dev/docs/metro
-
- @type {import('metro-config').MetroConfig}
  \*/
  const config = {
  transformer: {
  babelTransformerPath: require.resolve(
  "react-native-svg-transformer/react-native"
  )
  },
  resolver: {
  assetExts: assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...sourceExts, "svg"]
  }
  };

module.exports = mergeConfig(defaultConfig, config);

For Linear-gradient :

# npm install react-native-linear-gradient

For Iconify ://one of the best icon collection package

# npm install react-native-iconify@1.0.2

then in babel.config.js and below code inside plugin array
'react-native-iconify/plugin', // Add this line

For form Validation

# npm install formik yup

For DOTENV

# npm install react-native-dotenv --save-dev

Then Changes in babel.config.js
plugins: [
'react-native-reanimated/plugin', // Must be first
'nativewind/babel',
'react-native-iconify/plugin',
['module:react-native-dotenv'], // Explicitly define the plugin here
]

For Toast

# npm install react-native-toast-message

For Axios

# npm install axios

For http
android:usesCleartextTraffic="true" inside

# AndroidManifest.Xml

file inside that applciation tag

For Decode Id from Token

# npm install jwt-decode

For Bottom tab

# npm install @react-navigation/bottom-tabs

For Material Top tab

# npm install @react-navigation/material-top-tabs

Then

# npm install react-native-pager-view

For Playing Sound

# npm install react-native-sound

For Render Pdf

# npm install react-native-pdf react-native-blob-util

For Render Bottom Sheet

# npm install @gorhom/bottom-sheet

To Clean the metro

# npx react-native start --reset-cache

# npm start -- --reset-cache

If you get Realted nativewind error
Then Delete the package in package.js and clean the gradlew Then install
(note:Install tailwind css inside dev mode )

For Firebase Step up in React Native

# Create app in firebase console

# then keep google-services.json inside android folder

inside build.gradlew

# dependencies {

classpath 'com.google.gms:google-services:4.4.2'

# }

inside app/build.gradlew

# dependencies {

// Import the BoM for the Firebase platform
implementation(platform("com.google.firebase:firebase-bom:33.9.0"))

# }

For React Native Firebase

# npm install @react-native-firebase/app

For Firebase Function

# npm install -g firebase-tools

# firebase init functions

Then Choose Acoount

For Checking function in emulator

# firebase emulators:start

and PORT-NUMBER - 10.0.2.2:5001 ;

For Deploying function to Cloud

# firebase deploy --only functions

To view logs locally during development, you can use:

# firebase functions:log

To use Firebase admin

# cd functions Then npm install firebase-admin

For Sending OTP using Nodemailer in backend

# npm install nodemailer

To Secrete Key in firebase use

# firebase functions:config:set auth.secret="HELLO_WORLD"

In Normal ENV install

# npm install dotenv

For Image Picker

# npm install react-native-image-picker

For Document Picket

# npm install react-native-document-picker

For firebase message

# npm install @react-native-firebase/messaging

For Notification use Notifee

# npm install @notifee/react-native

For customise time or Date

# nom install moment

For Image Gallery

# npm i react-native-image-viewing

For Calendar

# npm i react-native-date-picker

For skeleton loader

# npm install react-content-loader

To use Lottiefile

# npm i lottie-react-native

For IOS set up in firebase
download the GoogleService-Info.plist file and place it in ios/{appname}

THEN
In AppDelegate.swift

# import FirebaseCore // ✅ Import Firebase

self.initialProps = [:]

# FirebaseApp.configure() // ✅ Initialize Firebase add this

AND
target 'WafaScheme' do
config = use_native_modules!

#Added
use_frameworks! :linkage => :static

# right after `use_frameworks! :linkage => :static`

$RNFirebaseAsStaticFramework = true

For React native vector icon in Pod file

# pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'

for checking internet connection

# npm install @react-native-community/netinfo

# link the FONT

# npx react-native-asset

% Clean the Gradlew Completly

% In Mine Terminal
rm -rf ~/.gradle/caches/
rm -rf ~/.gradle/daemon/
rm -rf ~/.gradle/native/
rm -rf ~/.gradle/kotlin-dsl/

rm -rf ~/.gradle/caches/
rm -rf android/.gradle
rm -rf android/build
rm -rf android/app/build
