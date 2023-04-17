#ifndef LoraSensor_h
#define LorSensor_h

#include "../Sensor.h"

// #include <LoRa.h>

#include <map>
#include <tuple>

class LoraSensor : public Sensor
{
public:
    LoraSensor(int id);
    int getId() const override;
    std::map<std::string, float> read() const override;

    float getTemperature() const;
    float getHumidity() const;
    float getHeatIndex() const;
    float getHeatIndexC() const;
    std::tuple<float, float> getTemperatureAndHumidity() const;

private:
    int id_;
};

#endif
