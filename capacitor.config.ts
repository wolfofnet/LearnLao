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
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#8b5cf6',
    },
  },
}

export default config
