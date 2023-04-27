#ifndef TemperatureSensorDHT_h
#define TemperatureSensorDHT_h

#include "../SensorBase/Sensor.h"
#include "DHT.h"
#include <limits>
#include <tuple>

class TemperatureSensorDHT : public Sensor
{
public:
    TemperatureSensorDHT(int id, int temperatureSensorPin, u_int8_t dhtType);
    int getId() const override;
    std::map<std::string, float> read() const override;

    float getTemperature() const;
    float getHumidity() const;

private:
    DHT *dht;
    u_int8_t dhtType;
    int temperatureSensorPin;
    int id_;
    bool sensorWorking;
};

#endif
