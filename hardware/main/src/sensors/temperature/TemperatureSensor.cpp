#include "TemperatureSensor.h"

TemperatureSensor::TemperatureSensor(int id) : id_(id)
{
    Serial.println("TemperatureSensor constructor");
    // Default to DHT11
    this->dhtType = 11;

    // Default to DHT11 and pin 4 if nothing else is defined
    Serial.println("TemperatureSensor setup");
    this->dht = new DHT(this->temperatureSensorPin, this->dhtType);
    this->dht->begin();
}

int TemperatureSensor::getId() const
{
    return id_;
}

float TemperatureSensor::getTemperature() const
{
    return this->dht->readTemperature();
}
float TemperatureSensor::getHumidity() const
{
    return this->dht->readHumidity();
}

float TemperatureSensor::getHeatIndex() const
{
    return this->dht->computeHeatIndex(this->getTemperature(), this->getHumidity(), false);
}

float TemperatureSensor::getHeatIndexC() const
{
    return this->dht->computeHeatIndex(this->getTemperature(), this->getHumidity(), true);
}

std::tuple<float, float> TemperatureSensor::getTemperatureAndHumidity() const
{
    return std::make_tuple(this->getTemperature(), this->getHumidity());
}

std::map<std::string, float> TemperatureSensor::read() const
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

// void TemperatureSensor::read()
// {
//     Serial.println("TemperatureSensor read");

//     float h = this->dht->readHumidity();
//     float t = this->dht->readTemperature();

//     // Check if any reads failed and exit early.
//     if (isnan(h) || isnan(t))
//     {
//         Serial.println("Failed to read from DHT sensor!");
//         return;
//     }

//     // Compute heat index in Celsius (isFahreheit = false)
//     float hic = this->dht->computeHeatIndex(t, h, false);

//     Serial.print(F("Humidity: "));
//     Serial.print(h);
//     Serial.print(F("%  Temperature: "));
//     Serial.print(t);
//     Serial.print(F("°C "));
//     Serial.print(F("Heat index: "));
//     Serial.print(hic);
//     Serial.print(F("°C "));
// }

// void TemperatureSensor::send()
// {
//     Serial.println("TemperatureSensor send");
// }

// void TemperatureSensor::handle()
// {
//     Serial.println("TemperatureSensor handle");
// }
