#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"
#include "../http/HttpClient.h"

#ifdef ESP32      // Check if using ESP32 board
#include "WiFi.h" //wifi library
#include "WebServer.h"
#endif

#include <AutoConnect.h>
#include <HTTPClient.h>

#include "../sensors/Sensor.h"

#include <vector>

class DeviceESP32
{
public:
  DeviceESP32();
  void rootPage();
  AutoConnect &getPortal();
  // void handleHTTPRequest();
  void readSensors();
  void addSensor(Sensor *sensor);
  void removeSensor(int id);
  void takeReadings();

private:
  WebServer server;
  AutoConnect Portal;
  std::vector<Sensor *> sensors_;
  HttpClient *httpClient_;
};

#endif
