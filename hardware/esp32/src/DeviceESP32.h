#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"

// #define ESP32
// #define DHTTYPE DHT11
// #define DHTPIN 4

// #ifdef ESP32      // Check if using ESP32 board
#include "WiFi.h" //wifi library
#include "WebServer.h"
// #endif

class DeviceESP32 : public Device
{
public:
  DeviceESP32(String deviceServerAddress = "https://parsnipbackend.azurewebsites.net");

private:
};

#endif
