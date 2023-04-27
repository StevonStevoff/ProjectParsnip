#ifndef TemperatureSensorAHTX_h
#define TemperatureSensorAHTX_h

#include "../SensorBase/Sensor.h"
#include <Adafruit_AHTX0.h>
#include <limits>
#include <tuple>

class TemperatureSensorAHTX : public Sensor
{
public:
    TemperatureSensorAHTX(int id, int temperatureSensorPin);
    int getId() const override;
    std::map<std::string, float> read() const override;

private:
    Adafruit_AHTX0 *aht;
    int temperatureSensorPin;
    int id_;
    bool sensorWorking;
};

#endif
