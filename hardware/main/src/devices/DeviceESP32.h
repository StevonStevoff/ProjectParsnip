#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"
#include "../http/HTTPHandler.h"

#ifdef ESP32 // Check if using ESP32 board
  #include "WiFi.h" //wifi library 
  #include "WebServer.h"
#endif

#include <AutoConnect.h>

#include <HTTPClient.h>


class DeviceESP32 {
    public:
      DeviceESP32();
      void rootPage();
      AutoConnect& getPortal();
      // void handleHTTPRequest();
      HTTPHandler handler;
    private:
      WebServer server;
      AutoConnect Portal;    
};

#endif
