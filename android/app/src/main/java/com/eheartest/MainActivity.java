package com.eheartest;

import android.graphics.Color;
import android.os.Bundle;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.mehcode.reactnative.splashscreen.SplashScreen;

import com.facebook.react.ReactActivity;
import com.zmxv.RNSound.RNSoundPackage; // <-- New

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "EHearTest";
    }

    @Override
      protected void onCreate(Bundle savedInstanceState) {
          // Show the js-controlled splash screen
          SplashScreen.show(this, getReactInstanceManager());

          mReactInstanceManager = ReactInstanceManager.builder();
          .addPackage(new RNSoundPackage()); // <-- New


          super.onCreate(savedInstanceState);

          // [...]
      }

}
