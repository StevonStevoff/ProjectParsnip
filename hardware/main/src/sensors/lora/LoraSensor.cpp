#include "LoraSensor.h"

LoraSensor::LoraSensor(int id) : id_(id)
{
    // Serial.println("Lora Constructor");
}
int LoraSensor::getId() const
{
    return id_;
}

std::map<std::string, float> LoraSensor::read() const
{

    // checks of packet recieved
    // if (LoRa.parsePacket() == 0) return;

    // // read packet
    // String packet = Lora.readString();

    // process and put into data structure
    // check if 'temp' is in packet

    // Override the read() function with a new implementation
    // This is just an example implementation, you can replace it with your own
    // return static_cast<float>(analogRead(this->temperatureSensorPin));
    // const float temp = this->getTemperature();
    // const float hu = this->getHumidity();

    std::map<std::string, float>
        sensorData;

    // sensorData["temperature"] = temp;
    // sensorData["humidity"] = hu;
    // sensorData["light"] = light;
    // sensorData["moisture"] = moisture;

    return sensorData;
}