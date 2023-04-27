#include "TemperatureSensorAHTX.h"

TemperatureSensorAHTX::TemperatureSensorAHTX(int id, int pin) : id_(id)
{
    this->temperatureSensorPin = pin;
    // initialize the sensor
    this->aht = new Adafruit_AHTX0();

    if (this->aht->begin())
    {   
        this->sensorWorking = true;
    }
    else
    {
        this->sensorWorking = false;
    }
}

int TemperatureSensorAHTX::getId() const
{
    return id_;
}

std::map<std::string, float> TemperatureSensorAHTX::read() const
{
    // Override the read() function with a new implementation
    // Returns humidity and temperature values, or a nan if the sensor is not working

    std::map<std::string, float> sensorData;

    if (!this->sensorWorking){
        sensorData["temperature"] = std::numeric_limits<float>::quiet_NaN();
        sensorData["humidity"] = std::numeric_limits<float>::quiet_NaN();
        return sensorData;
    }
    sensors_event_t hum, temp;
    aht->getEvent(&hum, &temp);


    sensorData["temperature"] = temp.temperature;
    sensorData["humidity"] = hum.relative_humidity;

    return sensorData;
}