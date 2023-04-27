#include "DeviceTransmitter.h"

DeviceTransmitter::DeviceTransmitter() : sensors_()
{
    //code on device initalisation can go here
}

void DeviceTransmitter::addSensor(Sensor *sensor)
{
    this->sensors_.push_back(sensor);
}

void DeviceTransmitter::removeSensor(int id)
{
    auto it = std::find_if(this->sensors_.begin(), sensors_.end(),
                           [&](const Sensor *s)
                           { return s->getId() == id; });

    if (it != this->sensors_.end())
    {
        this->sensors_.erase(it);
    }
}

std::map<std::string, float> DeviceTransmitter::readSensors()
{
    std::map<std::string, float> sensor_readings;
    // Loop through each sensor and take a reading
    for (auto sensor : sensors_)
    {
        std::map<std::string, float> values = sensor->read();
        // Combines all the sensor readings into one map
        sensor_readings.insert(values.begin(), values.end());
    }

    return sensor_readings;
}