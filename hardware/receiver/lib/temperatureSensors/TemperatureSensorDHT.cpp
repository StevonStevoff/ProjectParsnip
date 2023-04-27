#include "TemperatureSensorDHT.h"

TemperatureSensorDHT::TemperatureSensorDHT(int id, int pin, u_int8_t dhtType) : id_(id)
{

    this->temperatureSensorPin = pin;
    this->dhtType = dhtType;
    // initialize the sensor
    this->dht = new DHT(this->temperatureSensorPin, this->dhtType);
    this->dht->begin();
 
}

int TemperatureSensorDHT::getId() const
{
    return id_;
}

float TemperatureSensorDHT::getTemperature() const
{
    return this->dht->readTemperature();
}
float TemperatureSensorDHT::getHumidity() const
{
    return this->dht->readHumidity();
}

std::map<std::string, float> TemperatureSensorDHT::read() const
{
    // Override the read() function with a new implementation
    // Gets the temperature and humidity from the sensor, returns nan if the sensor is not working

    const float temp = this->getTemperature();
    const float hu = this->getHumidity();

    std::map<std::string, float> sensorData;

    sensorData["temperature"] = temp;
    sensorData["humidity"] = hu;

    return sensorData;
}