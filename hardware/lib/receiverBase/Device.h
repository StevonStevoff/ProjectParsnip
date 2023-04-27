#ifndef Device_h
#define Device_h

#include "Arduino.h"

#include <vector>
#include <map>
#include <string>

#include "Sensor.h"
#include "LoraSensor.h"
#include "DeviceServerInterface.h"
#include <algorithm>
#include <string>  
#include <EEPROM.h>
#include <AutoConnect.h>
#include "Arduino.h"

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

    String onHandleAuthToken(AutoConnectAux &page, PageArgument &args);
    String onLoadAuthPage(AutoConnectAux &page, PageArgument &args);

    String getAuthenticationToken();

private:
    WebServer server;
    AutoConnect Portal;
    std::vector<Sensor *> sensors_;
    DeviceServerInterface *deviceServerInterface;
    unsigned long lastSendTime;
    std::map<std::string, float> lastSensorRead;
};

#endif