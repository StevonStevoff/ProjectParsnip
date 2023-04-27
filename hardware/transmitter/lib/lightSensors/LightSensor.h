#ifndef LightSensor_h
#define LightSensor_h

#include "../SensorBase/Sensor.h"
#include <BH1750.h>
#include <limits>
#include <tuple>

class LightSensor : public Sensor
{
public:
    LightSensor(int id);
    int getId() const override;
    std::map<std::string, float> read() const override;

    float getLight() const;

private:
    BH1750 *bh1750;
    int id_;
    bool sensorWorking;
};

#endif
