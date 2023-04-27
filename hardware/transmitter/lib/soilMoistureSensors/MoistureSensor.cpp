#include "MoistureSensor.h"

MoistureSensor::MoistureSensor(int id) : id_(id)
{
    // setup moisture sensor
    if (analogRead(MoistureSensorPin)>40)
    {
        this->sensorWorking = true;
    }
    else
    {
        this->sensorWorking = false;
    }
}

int MoistureSensor::getId() const
{
    return id_;
}

float MoistureSensor::getMoist() const
{
    //read moisture sensor and returns a % based on calibration values, or returns nan if the sensor is not working
    if (!this->sensorWorking)
        return std::numeric_limits<double>::quiet_NaN();
    float soilMoistureValue = analogRead(MoistureSensorPin);
    soilMoistureValue = ((air_moist - soilMoistureValue) * 100.0) / (air_moist - water_moist);
    soilMoistureValue = soilMoistureValue >= 0.0 ? soilMoistureValue : 0.0;
    return soilMoistureValue;
}

std::map<std::string, float> MoistureSensor::read() const
{
    const float moist = this->getMoist();

    std::map<std::string, float> sensorData;

    sensorData["moisture"] = moist;
    return sensorData;
}