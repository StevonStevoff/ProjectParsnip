#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"

#define ESP32
#define DHTTYPE DHT11
#define DHTPIN 4

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
  std::map<std::string, float> readSensors();
  void addSensor(Sensor *sensor);
  void removeSensor(int id);
  void handleClientRequest();
  void beginServer();
  void sendSensorData();
  void setReadInterval(int interval);
  void setLastReadTime(int time);
  int getLastReadTime();
  int getReadInterval();

private:
  WebServer server;
  AutoConnect Portal;
  std::vector<Sensor *> sensors_;
  DeviceServerInterface *deviceServerInterface;
  int deviceId = 1;
  int readInterval = 3600000;
  int lastReadTime = 0;
};

#endif
