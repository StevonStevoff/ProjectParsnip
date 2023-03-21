#ifndef DeviceESP8266_h
#define DeviceESP8266_h

#include "Device.h"

// #define ESP8266

#ifdef ESP8266 // Check if using ESP32 board
  #include <ESP8266WiFi.h>
#endif


class DeviceESP8266: public Device {
    public:
       virtual void connectDeviceToWifi(const char* ssid, const char* password);
    // private:
        // Wifi* wifi;
};

#endif
