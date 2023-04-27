#ifndef DeviceTransmitter_h
#define DeviceTransmitter_h

#include <vector>
#include <map>
#include <string>
#include <algorithm>
#include "Arduino.h"

#include "../SensorBase/Sensor.h"

class DeviceTransmitter
{
public:
    DeviceTransmitter();
    std::map<std::string, float> readSensors();
    void addSensor(Sensor *sensor);
    void removeSensor(int id);



private:
    std::vector<Sensor *> sensors_;
};

#endif