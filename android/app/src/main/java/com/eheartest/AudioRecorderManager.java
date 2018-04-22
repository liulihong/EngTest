package com.eheartest;

import android.Manifest;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.MediaRecorder;
import android.media.AudioRecord;
import android.os.Build;
import android.os.Environment;

import android.media.AudioManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.FileInputStream;

import java.lang.reflect.Method;
import java.lang.reflect.InvocationTargetException;
import java.lang.IllegalAccessException;
import java.lang.NoSuchMethodException;

class AudioRecorderManager extends ReactContextBaseJavaModule {

  private static final String TAG = "ReactNativeAudio";

  private Context context;
  private Timer timer;
  private boolean isPauseResumeCapable = false;
  private Method pauseMethod = null;
  private Method resumeMethod = null;

  private AudioRecord recorder;
  //录音源
  private static int audioSource = MediaRecorder.AudioSource.MIC;
  //录音的采样频率
  private static int audioRate = 16000;
  //录音的声道，单声道
  private static int audioChannel = AudioFormat.CHANNEL_IN_MONO;
  //量化的深度
  private static int audioFormat = AudioFormat.ENCODING_PCM_16BIT;
  //缓存的大小
  private static int bufferSize = AudioRecord.getMinBufferSize( audioRate, audioChannel, audioFormat);



//  private static int audioSource=MediaRecorder.AudioSource.MIC;
//  private static int audioRate=16000;
//  private static int channelConfig = AudioFormat.CHANNEL_CONFIGURATION_MONO;
//  private static int audioEncoding = AudioFormat.ENCODING_PCM_16BIT;
//  private static int bufferSize= AudioRecord.getMinBufferSize(audioRate,channelConfig,audioEncoding);
//  AudioRecord record = new AudioRecord(
//          MediaRecorder.AudioSource.MIC, audioRate,
//          channelConfig, audioEncoding, bufferSize);



  //记录播放状态
  private boolean isRecording = false;
  //数字信号数组
  private byte [] noteArray;
  //PCM文件
  private File pcmFile;
  //WAV文件
  private File wavFile;
  //文件输出流
  private OutputStream os;
  //文件根目录
  private String basePath ;
  //wav文件目录
  private String outFileName ;
  //pcm文件目录
  private String inFileName ;


  public AudioRecorderManager(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
    
    isPauseResumeCapable = Build.VERSION.SDK_INT > Build.VERSION_CODES.M;
    if (isPauseResumeCapable) {
      try {
        pauseMethod = MediaRecorder.class.getMethod("pause");
        resumeMethod = MediaRecorder.class.getMethod("resume");
      } catch (NoSuchMethodException e) {
        Log.d("ERROR", "Failed to get a reference to pause and/or resume method");
      }
    }
  }


  @Override
  public String getName() {
    return "AudioRecorderManager";
  }

  @ReactMethod
  public void checkAuthorizationStatus(Promise promise) {
    int permissionCheck = ContextCompat.checkSelfPermission(getCurrentActivity(),
            Manifest.permission.RECORD_AUDIO);
    boolean permissionGranted = permissionCheck == PackageManager.PERMISSION_GRANTED;
    promise.resolve(permissionGranted);
  }

  @ReactMethod
  public void prepareRecordingAtPath(String recordingPath, ReadableMap recordingSettings, Promise promise) {
    if (isRecording){
      logAndRejectPromise(promise, "INVALID_STATE", "Please call stopRecording before starting recording");
    }

    try {
      basePath=recordingPath;
      createFile();//创建文件
      recorder = null;
      recorder = new AudioRecord(audioSource,audioRate,audioChannel,audioFormat,bufferSize);
      
          
    }
    catch(final Exception e) {
      logAndRejectPromise(promise, "COULDNT_CONFIGURE_MEDIA_RECORDER" , "Make sure you've added RECORD_AUDIO permission to your AndroidManifest.xml file "+e.getMessage());
      return;
    }


  }
  //创建文件夹,首先创建目录，然后创建对应的文件
  public void createFile(){

    pcmFile = new File(basePath+".pcm");
    wavFile = new File(basePath+".wav");
    if(pcmFile.exists()){
      pcmFile.delete();
    }
    if(wavFile.exists()){
      wavFile.delete();
    }
    try{
      pcmFile.createNewFile();
      wavFile.createNewFile();
    }catch(IOException e){

    }
  }
  //读取录音数字数据线程
  class WriteThread implements Runnable{
    public void run(){
      writeData();
    }
  }

  //将数据写入文件夹,文件的写入没有做优化
  public void writeData(){
    noteArray = new byte[bufferSize];
    //建立文件输出流
    try {
      os = new BufferedOutputStream(new FileOutputStream(pcmFile));
    }catch (IOException e){

    }
    while(isRecording == true){
      int recordSize = recorder.read(noteArray,0,bufferSize);
      if(recordSize>0){
        try{
          os.write(noteArray);
        }catch(IOException e){

        }
      }
    }
    if (os != null) {
      try {
        os.close();
      }catch (IOException e){

      }
    }
  }

  // 这里得到可播放的音频文件
  public void convertWaveFile() {
    //wav文件目录
    outFileName = basePath+".wav";
    //pcm文件目录
    inFileName = basePath+".pcm";

    FileInputStream in = null;
    FileOutputStream out = null;
    long totalAudioLen = 0;
    long totalDataLen = totalAudioLen + 36;
    long longSampleRate = audioRate;
    int channels = 1;
    long byteRate = 16 * audioRate * channels / 8;
    byte[] data = new byte[bufferSize];
    try {
      in = new FileInputStream(inFileName);
      out = new FileOutputStream(outFileName);
      totalAudioLen = in.getChannel().size();
      //由于不包括RIFF和WAV
      totalDataLen = totalAudioLen + 36;
      WriteWaveFileHeader(out, totalAudioLen, totalDataLen, longSampleRate, channels, byteRate);
      while (in.read(data) != -1) {
        out.write(data);
      }
      in.close();
      out.close();

      if(pcmFile.exists()){
        pcmFile.delete();
      }

    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  /*
  任何一种文件在头部添加相应的头文件才能够确定的表示这种文件的格式，wave是RIFF文件结构，每一部分为一个chunk，其中有RIFF WAVE chunk，
  FMT Chunk，Fact chunk,Data chunk,其中Fact chunk是可以选择的，
   */
  private void WriteWaveFileHeader(FileOutputStream out, long totalAudioLen, long totalDataLen, long longSampleRate,
                                   int channels, long byteRate) throws IOException {
    byte[] header = new byte[44];
    header[0] = 'R'; // RIFF
    header[1] = 'I';
    header[2] = 'F';
    header[3] = 'F';
    header[4] = (byte) (totalDataLen & 0xff);//数据大小
    header[5] = (byte) ((totalDataLen >> 8) & 0xff);
    header[6] = (byte) ((totalDataLen >> 16) & 0xff);
    header[7] = (byte) ((totalDataLen >> 24) & 0xff);
    header[8] = 'W';//WAVE
    header[9] = 'A';
    header[10] = 'V';
    header[11] = 'E';
    //FMT Chunk
    header[12] = 'f'; // 'fmt '
    header[13] = 'm';
    header[14] = 't';
    header[15] = ' ';//过渡字节
    //数据大小
    header[16] = 16; // 4 bytes: size of 'fmt ' chunk
    header[17] = 0;
    header[18] = 0;
    header[19] = 0;
    //编码方式 10H为PCM编码格式
    header[20] = 1; // format = 1
    header[21] = 0;
    //通道数
    header[22] = (byte) channels;
    header[23] = 0;
    //采样率，每个通道的播放速度
    header[24] = (byte) (longSampleRate & 0xff);
    header[25] = (byte) ((longSampleRate >> 8) & 0xff);
    header[26] = (byte) ((longSampleRate >> 16) & 0xff);
    header[27] = (byte) ((longSampleRate >> 24) & 0xff);
    //音频数据传送速率,采样率*通道数*采样深度/8
    header[28] = (byte) (byteRate & 0xff);
    header[29] = (byte) ((byteRate >> 8) & 0xff);
    header[30] = (byte) ((byteRate >> 16) & 0xff);
    header[31] = (byte) ((byteRate >> 24) & 0xff);
    // 确定系统一次要处理多少个这样字节的数据，确定缓冲区，通道数*采样位数
    header[32] = (byte) (1 * 16 / 8);
    header[33] = 0;
    //每个样本的数据位数
    header[34] = 16;
    header[35] = 0;
    //Data chunk
    header[36] = 'd';//data
    header[37] = 'a';
    header[38] = 't';
    header[39] = 'a';
    header[40] = (byte) (totalAudioLen & 0xff);
    header[41] = (byte) ((totalAudioLen >> 8) & 0xff);
    header[42] = (byte) ((totalAudioLen >> 16) & 0xff);
    header[43] = (byte) ((totalAudioLen >> 24) & 0xff);
    out.write(header, 0, 44);
  }


  @ReactMethod
  public void startRecording(Promise promise){
    if (recorder == null){
      logAndRejectPromise(promise, "RECORDING_NOT_PREPARED", "Please call prepareRecordingAtPath before starting recording");
      return;
    }
    if (isRecording){
      logAndRejectPromise(promise, "INVALID_STATE", "Please call stopRecording before starting recording");
      return;
    }
    recorder.startRecording();
    isRecording = true;
    new Thread(new WriteThread()).start();

    startTimer();
    promise.resolve("success");
  }

  @ReactMethod
  public void stopRecording(Promise promise){
    if (!isRecording){
      logAndRejectPromise(promise, "INVALID_STATE", "Please call startRecording before stopping recording");
      return;
    }

    stopTimer();
    isRecording = false;

    try {
      recorder.stop();
      convertWaveFile();
      recorder.release();
    }
    catch (final RuntimeException e) {
      // https://developer.android.com/reference/android/media/MediaRecorder.html#stop()
      logAndRejectPromise(promise, "RUNTIME_EXCEPTION", "No valid audio data received. You may be using a device that can't record audio.");
      return;
    }
    finally {
      recorder = null;
    }
    promise.resolve("success");
    sendEvent("recordingFinished", null);
  }

  @ReactMethod
  public void pauseRecording(Promise promise) {
    if (!isPauseResumeCapable || pauseMethod==null) {
      logAndRejectPromise(promise, "RUNTIME_EXCEPTION", "Method not available on this version of Android.");
      return;
    }

    promise.resolve(null);
  }

  @ReactMethod
  public void resumeRecording(Promise promise) {
    if (!isPauseResumeCapable || resumeMethod == null) {
      logAndRejectPromise(promise, "RUNTIME_EXCEPTION", "Method not available on this version of Android.");
      return;
    }

    promise.resolve(null);
  }

  private void startTimer(){
    timer = new Timer();
    timer.scheduleAtFixedRate(new TimerTask() {
      @Override
      public void run() {
      }
    }, 0, 1000);
  }

  private void stopTimer(){
    if (timer != null) {
      timer.cancel();
      timer.purge();
      timer = null;
    }
  }

  private void sendEvent(String eventName, Object params) {
    getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }

  private void logAndRejectPromise(Promise promise, String errorCode, String errorMessage) {
    Log.e(TAG, errorMessage);
    promise.reject(errorCode, errorMessage);
  }
}
