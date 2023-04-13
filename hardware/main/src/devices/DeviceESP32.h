#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"

#ifdef ESP32      // Check if using ESP32 board
#include "WiFi.h" //wifi library
#include "WebServer.h"
#endif

#include <AutoConnect.h>

#include "../sensors/Sensor.h"
#include "../http/DeviceServerInterface.h"

#include <vector>
#include <map>
#include <string>

class DeviceESP32
{
public:
  DeviceESP32();
  void rootPage();
  AutoConnect &getPortal();
  void readSensors();
  void addSensor(Sensor *sensor);
  void removeSensor(int id);
  void handleClientRequest();
  void beginServer();
  void sendSensorData();

private:
  WebServer server;
  AutoConnect Portal;
  std::vector<Sensor *> sensors_;
  DeviceServerInterface *deviceServerInterface;
};

#endif
