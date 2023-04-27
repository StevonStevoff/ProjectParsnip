#ifndef Device_h
#define Device_h

#include <vector>
#include <map>

#include "Sensor.h"

#include "LoraSensor.h"
#include "Wire.h"

#include "DeviceServerInterface.h"
#include <algorithm>
#include <EEPROM.h>
#include <AutoConnect.h>

class Device
{
public:
    Device(String deviceServerAddress = "https://parsnipbackend.azurewebsites.net");

    // Concrete methods
    AutoConnect &getPortal();
    void readSensors();
    void addSensor(Sensor *sensor);
    void removeSensor(int id);
    void handleClientRequest();
    void beginServer();
    void sendSensorData();
    void beginPortal(const char *ssid = NULL, const char *password = NULL);

    String onHandleAuthToken(AutoConnectAux &page, PageArgument &args);
    String onLoadAuthPage(AutoConnectAux &page, PageArgument &args);

    String getAuthenticationToken();

    std::vector<Sensor *> getSensors();

private:
    WebServer server;
    AutoConnect Portal;
    std::vector<Sensor *> sensors_;
    DeviceServerInterface *deviceServerInterface;
    unsigned long lastSendTime;
    std::map<std::string, float> lastSensorRead;
};

#endif