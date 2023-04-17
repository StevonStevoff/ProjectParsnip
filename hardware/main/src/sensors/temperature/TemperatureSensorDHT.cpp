#include "TemperatureSensorDHT.h"

TemperatureSensorDHT::TemperatureSensorDHT(int id, int pin, u_int8_t dhtType) : id_(id)
{
    Serial.println("TemperatureSensor constructor");

    this->temperatureSensorPin = pin;
    this->dhtType = dhtType;
    // initialize the sensor
    this->dht = new DHT(this->temperatureSensorPin, this->dhtType);

    if (this->dht->begin())
    {
        this->sensorWorking = true;
    }
    else
    {
        this->sensorWorking = false;
    }
}

int TemperatureSensorDHT::getId() const
{
    return id_;
}

float TemperatureSensorDHT::getTemperature() const
{
    if (!this->sensorWorking)
        return nan;
    return this->dht->readTemperature();
}
float TemperatureSensorDHT::getHumidity() const
{
    return this->dht->readHumidity();
}

float TemperatureSensorDHT::getHeatIndex() const
{
    return this->dht->computeHeatIndex(this->getTemperature(), this->getHumidity(), false);
}

float TemperatureSensorDHT::getHeatIndexC() const
{
    return this->dht->computeHeatIndex(this->getTemperature(), this->getHumidity(), true);
}

std::tuple<float, float> TemperatureSensorDHT::getTemperatureAndHumidity() const
{
    return std::make_tuple(this->getTemperature(), this->getHumidity());
}

std::map<std::string, float> TemperatureSensorDHT::read() const
{
    // Override the read() function with a new implementation
    // This is just an example implementation, you can replace it with your own
    // return static_cast<float>(analogRead(this->temperatureSensorPin));

    const float temp = this->getTemperature();
    const float hu = this->getHumidity();

    std::map<std::string, float> sensorData;

    sensorData["temperature"] = temp;
    sensorData["humidity"] = hu;

    return sensorData;
}