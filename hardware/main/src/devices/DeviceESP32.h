#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"

#ifdef ESP32 // Check if using ESP32 board
  #include "WiFi.h" //wifi library 
  #include "WebServer.h"
#endif

#include <AutoConnect.h>

class DeviceESP32 {
    public:
      DeviceESP32();
      void rootPage();
      // WebServer getServer();
      AutoConnect& getPortal();
      // void setupServer();
    private:
      WebServer server;
      AutoConnect Portal;
};

#endif
