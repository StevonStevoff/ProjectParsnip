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

class DeviceESP32 : public Device
{
public:
  DeviceESP32(String deviceServerAddress = "https://parsnipbackend.azurewebsites.net");

  // AutoConnect &getPortal();
  // std::map<std::string, float> readSensors();
  // void addSensor(Sensor *sensor);
  // void removeSensor(int id);
  // void handleClientRequest();
  // void beginServer();
  // void sendSensorData();

  // void setReadInterval(int interval);
  // void setLastReadTime(int time);
  // int getLastReadTime();
  // int getReadInterval();

  // String onHandleAuthToken(AutoConnectAux &page, PageArgument &args);
  // String onLoadAuthPage(AutoConnectAux &page, PageArgument &args);

  // String getAuthenticationToken();

private:
  // WebServer server;
  // AutoConnect Portal;
  // std::vector<Sensor *> sensors_;
  // DeviceServerInterface *deviceServerInterface;
  // int deviceId = 1;
  // int readInterval = 3600000;
  // int lastReadTime = 0;

  // struct
  // {
  //   char token[33]; // 32 bytes for the token + 1 byte for the null terminator
  // } EEPROM_CONFIG_tt;

  // AutoConnectAux auxInputToken;
  // AutoConnectAux auxHandleToken;
};

#endif
