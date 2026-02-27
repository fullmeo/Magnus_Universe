/**
 * Mobile Application Generator
 *
 * Generates cross-platform mobile applications using React Native and Flutter
 * with platform-specific optimizations and native feature integration.
 */

class MobileGenerator {
  constructor(options = {}) {
    this.framework = options.framework || 'react-native';
    this.platforms = options.platforms || ['ios', 'android'];
    this.features = options.features || [];

    this.templates = {
      'react-native': this.loadReactNativeTemplates(),
      flutter: this.loadFlutterTemplates(),
      ionic: this.loadIonicTemplates()
    };
  }

  /**
   * Generate complete mobile application
   */
  async generate(specification) {
    const app = {
      name: specification.name || 'mobile-app',
      framework: this.framework,
      platforms: this.platforms,
      features: specification.features || [],
      structure: {},
      files: {}
    };

    switch (this.framework) {
      case 'react-native':
        return this.generateReactNativeApp(specification);
      case 'flutter':
        return this.generateFlutterApp(specification);
      case 'ionic':
        return this.generateIonicApp(specification);
      default:
        return this.generateReactNativeApp(specification);
    }
  }

  /**
   * Generate React Native application
   */
  generateReactNativeApp(specification) {
    const app = {
      packageJson: this.generateReactNativePackageJson(specification),
      appJson: this.generateAppJson(specification),
      indexJs: this.generateIndexJs(specification),
      structure: this.generateReactNativeStructure(specification),
      screens: this.generateReactNativeScreens(specification),
      components: this.generateReactNativeComponents(specification),
      services: this.generateReactNativeServices(specification),
      navigation: this.generateNavigation(specification),
      config: this.generateReactNativeConfig(specification),
      iosConfig: this.platforms.includes('ios') ? this.generateIOSConfig(specification) : null,
      androidConfig: this.platforms.includes('android') ? this.generateAndroidConfig(specification) : null
    };

    return app;
  }

  /**
   * Generate React Native package.json
   */
  generateReactNativePackageJson(specification) {
    const features = specification.features || [];

    const dependencies = {
      'react': '18.2.0',
      'react-native': '0.71.0',
      '@react-navigation/native': '^6.1.0',
      '@react-navigation/native-stack': '^6.9.0',
      'react-native-screens': '^3.20.0',
      'react-native-safe-area-context': '^4.5.0'
    };

    const devDependencies = {
      '@babel/core': '^7.20.0',
      '@babel/preset-env': '^7.20.0',
      '@babel/runtime': '^7.20.0',
      '@react-native/babel-preset': '0.71.0',
      '@react-native/eslint-config': '0.71.0',
      '@react-native/metro-config': '0.71.0',
      '@react-native/typescript-config': '0.71.0',
      '@tsconfig/react-native/tsconfig.json': '^2.0.2',
      'babel-jest': '^29.2.1',
      'eslint': '^8.19.0',
      'jest': '^29.2.1',
      'metro-react-native-babel-preset': '0.76.5',
      'prettier': '^2.4.1',
      'react-test-renderer': '18.2.0',
      'typescript': '4.8.4'
    };

    // Add feature-specific dependencies
    if (features.includes('camera')) {
      dependencies['react-native-image-picker'] = '^5.0.0';
      dependencies['react-native-permissions'] = '^3.6.0';
    }

    if (features.includes('gps')) {
      dependencies['react-native-geolocation-service'] = '^5.3.0';
      dependencies['react-native-permissions'] = '^3.6.0';
    }

    if (features.includes('notifications')) {
      dependencies['@notifee/react-native'] = '^7.0.0';
    }

    if (features.includes('storage')) {
      dependencies['@react-native-async-storage/async-storage'] = '^1.17.0';
    }

    if (features.includes('networking')) {
      dependencies['axios'] = '^1.3.0';
    }

    if (features.includes('ui-components')) {
      dependencies['react-native-paper'] = '^5.0.0';
    }

    return {
      name: specification.name || 'mobile-app',
      version: '1.0.0',
      private: true,
      scripts: {
        android: 'react-native run-android',
        ios: 'react-native run-ios',
        lint: 'eslint .',
        start: 'react-native start',
        test: 'jest'
      },
      dependencies,
      devDependencies
    };
  }

  /**
   * Generate app.json for React Native
   */
  generateAppJson(specification) {
    return {
      name: specification.name || 'MobileApp',
      displayName: specification.displayName || specification.name || 'Mobile App',
      expo: {
        name: specification.name || 'MobileApp',
        slug: (specification.name || 'mobile-app').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'light',
        splash: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        },
        assetBundlePatterns: ['**/*'],
        ios: {
          supportsTablet: true
        },
        android: {
          adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff'
          }
        },
        web: {
          favicon: './assets/favicon.png'
        }
      }
    };
  }

  /**
   * Generate index.js
   */
  generateIndexJs(specification) {
    return `import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);`;
  }

  /**
   * Generate React Native project structure
   */
  generateReactNativeStructure(specification) {
    const structure = {
      'src/': {
        'screens/': {},
        'components/': {},
        'services/': {},
        'utils/': {},
        'constants/': {},
        'types/': {}
      },
      'assets/': {
        'images/': {},
        'fonts/': {}
      },
      '__tests__/': {},
      'android/': {},
      'ios/': {}
    };

    const features = specification.features || [];

    if (features.includes('camera')) {
      structure['src/']['camera/'] = {};
    }

    if (features.includes('gps')) {
      structure['src/']['location/'] = {};
    }

    if (features.includes('notifications')) {
      structure['src/']['notifications/'] = {};
    }

    return structure;
  }

  /**
   * Generate React Native screens
   */
  generateReactNativeScreens(specification) {
    const screens = [];

    screens.push({
      name: 'HomeScreen',
      path: 'src/screens/HomeScreen.js',
      content: this.generateHomeScreen(specification)
    });

    screens.push({
      name: 'SettingsScreen',
      path: 'src/screens/SettingsScreen.js',
      content: this.generateSettingsScreen(specification)
    });

    const features = specification.features || [];

    if (features.includes('camera')) {
      screens.push({
        name: 'CameraScreen',
        path: 'src/screens/CameraScreen.js',
        content: this.generateCameraScreen()
      });
    }

    if (features.includes('profile')) {
      screens.push({
        name: 'ProfileScreen',
        path: 'src/screens/ProfileScreen.js',
        content: this.generateProfileScreen()
      });
    }

    return screens;
  }

  /**
   * Generate Home Screen
   */
  generateHomeScreen(specification) {
    const features = specification.features || [];
    const hasCamera = features.includes('camera');
    const hasGps = features.includes('gps');
    const hasNotifications = features.includes('notifications');

    return `import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
${hasCamera ? "import { launchImageLibrary } from 'react-native-image-picker';" : ''}
${hasGps ? "import Geolocation from 'react-native-geolocation-service';" : ''}
${hasNotifications ? "import notifee from '@notifee/react-native';" : ''}

function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    ${hasGps ? `requestLocationPermission();` : ''}
  }, []);

  ${hasGps ? `
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        getCurrentLocation();
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        Alert.alert('Error', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  ` : ''}

  ${hasCamera ? `
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setPhoto(response.assets[0]);
      }
    });
  };
  ` : ''}

  ${hasNotifications ? `
  const sendNotification = async () => {
    await notifee.displayNotification({
      title: 'Hello!',
      body: 'This is a test notification',
      android: {
        channelId: 'default',
      },
    });
  };
  ` : ''}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>${specification.name || 'Mobile App'}</Text>
      <Text style={styles.subtitle}>Welcome to your new mobile application!</Text>

      <View style={styles.features}>
        ${hasGps ? `
        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>Get Location</Text>
        </TouchableOpacity>
        ${location ? `<Text>Lat: {location.latitude}, Lng: {location.longitude}</Text>` : ''}
        ` : ''}

        ${hasCamera ? `
        <TouchableOpacity style={styles.button} onPress={openImagePicker}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
        ${photo ? `<Text>Photo selected: {photo.fileName}</Text>` : ''}
        ` : ''}

        ${hasNotifications ? `
        <TouchableOpacity style={styles.button} onPress={sendNotification}>
          <Text style={styles.buttonText}>Send Notification</Text>
        </TouchableOpacity>
        ` : ''}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  features: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;`;
  }

  /**
   * Generate Settings Screen
   */
  generateSettingsScreen(specification) {
    return `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Location Services</Text>
        <Switch
          value={location}
          onValueChange={setLocation}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;`;
  }

  /**
   * Generate navigation setup
   */
  generateNavigation(specification) {
    const screens = specification.screens || ['Home', 'Settings'];

    return {
      stackNavigator: this.generateStackNavigator(screens),
      appJs: this.generateAppJs(specification)
    };
  }

  /**
   * Generate Stack Navigator
   */
  generateStackNavigator(screens) {
    const imports = screens.map(screen => `import ${screen}Screen from '../screens/${screen}Screen';`).join('\n');

    const routes = screens.map(screen => `        <Stack.Screen name="${screen}" component={${screen}Screen} />`).join('\n');

    return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
${imports}

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
${routes}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;`;
  }

  /**
   * Generate App.js
   */
  generateAppJs(specification) {
    return `import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return <AppNavigator />;
}

export default App;`;
  }

  /**
   * Generate iOS configuration
   */
  generateIOSConfig(specification) {
    const features = specification.features || [];

    const infoPlist = {
      CFBundleDevelopmentRegion: 'en',
      CFBundleDisplayName: specification.displayName || specification.name || 'Mobile App',
      CFBundleExecutable: specification.name || 'MobileApp',
      CFBundleIdentifier: `com.${(specification.name || 'mobileapp').toLowerCase()}`,
      CFBundleInfoDictionaryVersion: '6.0',
      CFBundleName: specification.name || 'MobileApp',
      CFBundlePackageType: 'APPL',
      CFBundleShortVersionString: '1.0.0',
      CFBundleVersion: '1',
      LSRequiresIPhoneOS: true,
      UILaunchStoryboardName: 'LaunchScreen',
      UIRequiredDeviceCapabilities: ['armv7'],
      UISupportedInterfaceOrientations: [
        'UIInterfaceOrientationPortrait',
        'UIInterfaceOrientationLandscapeLeft',
        'UIInterfaceOrientationLandscapeRight'
      ],
      UIViewControllerBasedStatusBarAppearance: false,
    };

    // Add feature-specific permissions
    if (features.includes('camera')) {
      infoPlist.NSCameraUsageDescription = 'This app needs camera access to take photos';
      infoPlist.NSPhotoLibraryUsageDescription = 'This app needs photo library access to select photos';
    }

    if (features.includes('gps')) {
      infoPlist.NSLocationWhenInUseUsageDescription = 'This app needs location access for location services';
    }

    if (features.includes('notifications')) {
      // iOS notification permissions are handled programmatically
    }

    return {
      infoPlist,
      entitlements: this.generateIOSEntitlements(features)
    };
  }

  /**
   * Generate Android configuration
   */
  generateAndroidConfig(specification) {
    const features = specification.features || [];

    const androidManifest = {
      permissions: [],
      application: {
        activities: [],
        services: [],
        receivers: []
      }
    };

    // Add feature-specific permissions
    if (features.includes('camera')) {
      androidManifest.permissions.push('android.permission.CAMERA');
      androidManifest.permissions.push('android.permission.WRITE_EXTERNAL_STORAGE');
    }

    if (features.includes('gps')) {
      androidManifest.permissions.push('android.permission.ACCESS_FINE_LOCATION');
      androidManifest.permissions.push('android.permission.ACCESS_COARSE_LOCATION');
    }

    if (features.includes('notifications')) {
      // Android notification permissions are handled programmatically for API 33+
    }

    return {
      androidManifest,
      buildGradle: this.generateBuildGradle(specification),
      stringsXml: this.generateStringsXml(specification)
    };
  }

  /**
   * Generate build.gradle
   */
  generateBuildGradle(specification) {
    return `android {
    compileSdkVersion rootProject.ext.compileSdkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion

    defaultConfig {
        applicationId "${'com.' + (specification.name || 'mobileapp').toLowerCase().replace(/[^a-z0-9]/g, '')}"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}`;
  }

  // Placeholder methods
  loadReactNativeTemplates() { return {}; }
  loadFlutterTemplates() { return {}; }
  loadIonicTemplates() { return {}; }
  generateFlutterApp() { return {}; }
  generateIonicApp() { return {}; }
  generateReactNativeComponents() { return []; }
  generateReactNativeServices() { return []; }
  generateReactNativeConfig() { return {}; }
  generateCameraScreen() { return '/* Camera screen */'; }
  generateProfileScreen() { return '/* Profile screen */'; }
  generateIOSEntitlements() { return {}; }
  generateStringsXml() { return {}; }
}

export { MobileGenerator };
export default MobileGenerator;