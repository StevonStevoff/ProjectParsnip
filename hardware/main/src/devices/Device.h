#ifndef Device_h
#define Device_h

#include "Arduino.h"

#include <vector>
#include <map>
#include <string>

#include "../sensors/Sensor.h"
#include "../http/DeviceServerInterface.h"

#include <AutoConnect.h>
#include <EEPROM.h>

class Device
{
public:
    // virtual void beginServer() = 0;
    // virtual void handleClientRequest() = 0;
    // virtual void addSensor(Sensor *sensor) = 0;
    // virtual void removeSensor(int id) = 0;
    // virtual void readSensors() = 0;
    // virtual boolean connectDeviceToWifi(const char* ssid, const char* password) = 0;

    Device(String deviceServerAddress = "https://parsnipbackend.azurewebsites.net");

    // Concrete methods
    AutoConnect &getPortal();
    std::map<std::string, float> readSensors();
    void addSensor(Sensor *sensor);
    void removeSensor(int id);
    void handleClientRequest();
    void beginServer();
    void sendSensorData();

    String onHandleAuthToken(AutoConnectAux &page, PageArgument &args);
    String onLoadAuthPage(AutoConnectAux &page, PageArgument &args);

    String getAuthenticationToken();

private:
    WebServer server;
    AutoConnect Portal;
    std::vector<Sensor *> sensors_;
    DeviceServerInterface *deviceServerInterface;
};

#endif