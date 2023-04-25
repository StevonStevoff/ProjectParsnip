#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"

#include "WiFi.h"
#include "WebServer.h"

class DeviceESP32 : public Device
{
public:
  DeviceESP32(String deviceServerAddress = "https://parsnipbackend.azurewebsites.net");

private:
};

#endif
