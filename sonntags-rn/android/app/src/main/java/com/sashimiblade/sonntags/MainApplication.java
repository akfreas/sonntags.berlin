package com.sashimiblade.sonntags;

import android.support.multidex.MultiDexApplication;

import com.facebook.react.ReactApplication;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.evollu.react.fa.FIRAnalyticsPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import cl.json.RNSharePackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RCTMGLPackage(),
            new RNI18nPackage(),
            new FIRAnalyticsPackage(),
            new RNSharePackage(),
            new RNAdMobPackage(),
            new VectorIconsPackage()
      );
    }
  };
  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
