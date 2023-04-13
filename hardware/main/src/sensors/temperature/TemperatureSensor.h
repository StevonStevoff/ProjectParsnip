#ifndef TemperatureSensor_h
#define TemperatureSensor_h

#include "../Sensor.h"
#include "DHT.h"

#include <tuple>

class TemperatureSensor : public Sensor
{
public:
    TemperatureSensor(int id);
    int getId() const override;
    std::map<std::string, float> read() const override;

    float getTemperature() const;
    float getHumidity() const;
    float getHeatIndex() const;
    float getHeatIndexC() const;
    std::tuple<float, float> getTemperatureAndHumidity() const;

private:
    DHT *dht;
    u_int8_t dhtType;
    int temperatureSensorPin = 4;
    int id_;
};

#endif
