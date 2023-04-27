#include "LightSensor.h"

LightSensor::LightSensor(int id) : id_(id)
{
    // initalizes the sensor
    this->bh1750 = new BH1750();

    if (this->bh1750->begin())
    {
        this->sensorWorking = true;
    }
    else
    {
        this->sensorWorking = false;
    }
}

int LightSensor::getId() const
{
    return id_;
}

float LightSensor::getLight() const
{
    //reads the light level from the sensor, or returns nan if the sensor is not working
    if (!this->sensorWorking)
        return std::numeric_limits<double>::quiet_NaN();
      return this->bh1750->readLightLevel();
}

std::map<std::string, float> LightSensor::read() const
{
    const float light = this->getLight();

    std::map<std::string, float> sensorData;

    sensorData["light"] = light;
    return sensorData;
}