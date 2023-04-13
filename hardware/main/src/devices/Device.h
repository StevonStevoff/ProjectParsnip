#ifndef Device_h
#define Device_h

#include "Arduino.h"

#include <vector>
// #include "../http/HttpClient.h"

#include "../sensors/Sensor.h"

class Device
{
public:
    virtual void beginServer() = 0;
    virtual void handleClientRequest() = 0;
    virtual void addSensor(Sensor *sensor) = 0;
    virtual void removeSensor(int id) = 0;
    virtual void readSensors() = 0;
    // virtual boolean connectDeviceToWifi(const char* ssid, const char* password) = 0;
private:
    std::vector<Sensor *> sensors_;
    // HttpClient *httpClient_;
};

#endif