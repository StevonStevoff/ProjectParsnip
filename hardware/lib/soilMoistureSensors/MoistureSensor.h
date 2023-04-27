#ifndef MoistureSensor_h
#define MoistureSensor_h

#include "../SensorBase/Sensor.h"
#include <limits>
#include "Arduino.h"
#include <tuple>
#define air_moist 380
#define water_moist 45

class MoistureSensor : public Sensor
{
public:
    MoistureSensor(int id);
    int getId() const override;
    std::map<std::string, float> read() const override;

    float getMoist() const;

private:
    const uint8_t MoistureSensorPin = A0;
    int id_;
    bool sensorWorking;
};

#endif
