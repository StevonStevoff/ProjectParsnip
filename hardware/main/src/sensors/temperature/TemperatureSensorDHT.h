#ifndef TemperatureSensorDHT_h
#define TemperatureSensorDHT_h

#include "../Sensor.h"
#include "DHT.h"

#include <tuple>

class TemperatureSensorDHT : public Sensor
{
public:
    TemperatureSensorDHT(int id, int temperatureSensorPin, u_int8_t dhtType);
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
    int temperatureSensorPin;
    int id_;
    bool sensorWorking;
};

#endif
