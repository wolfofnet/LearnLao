const config: Record<string, unknown> = {
  appId: 'com.laolearner.app',
  appName: 'Lao Learner',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FF6900',
      showSpinner: true,
      spinnerColor: '#ffffff',
      splashFullScreen: true,
      splashImmersive: true,
      autoHide: true,
    },
  },
}

export default config
