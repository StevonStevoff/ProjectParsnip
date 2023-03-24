#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"

#ifdef ESP32 // Check if using ESP32 board
    #include "WiFi.h" //wifi library 
#endif

class DeviceESP32: public Device {
    public:
      DeviceESP32();
      virtual void connectDeviceToWifi(const char* ssid, const char* password);
      void deviceSetup(const char* ssid, const char* password);
      void deviceSetupLoop();
    private:
      WiFiServer server;
      // Variable to store the HTTP request
      String header;
      String user_ssid;
      String user_pass;
      boolean wifiSetupCompleteFlag;
    
};

#endif
