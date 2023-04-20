#ifndef Transmitter_h
#define Transmitter_h

#include "Arduino.h"

#include <vector>
#include <map>
#include <string>

#include "Sensor.h"

class Transmitter
{
public:
    Transmitter(String deviceServerAddress = "https://parsnipbackend.azurewebsites.net");

    std::map<std::string, float> readSensors();
    void addSensor(Sensor *sensor);
    void removeSensor(int id);
    void sendSensorData();

private:
    std::vector<Sensor *> sensors_;
};

#endif