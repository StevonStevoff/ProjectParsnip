#ifndef DeviceESP8266_h
#define DeviceESP8266_h

#include "Device.h"

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiClient.h>

class DeviceESP8266 : public Device
{
public:
  DeviceESP8266(String deviceServerAddress = "https://parsnipbackend.azurewebsites.net");

private:
};

#endif
