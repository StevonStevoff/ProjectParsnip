#include "LoraSensor.h"

LoraSensor::LoraSensor(int id) : id_(id)
{
    //initilize sensor
    LoRa.setPins(Lorass, rst, dio0);

    //checks if sensor is working
    if (!LoRa.begin(433E6))
    {
        this->sensorWorking = false;
    }
    else
    {
        this->sensorWorking = true;
    }
}
int LoraSensor::getId() const
{
    return id_;
}

std::map<std::string, float> LoraSensor::read() const
{
    std::map<std::string, float>
        sensorData;
    // checks if packet recieved
    if (LoRa.parsePacket() == 0) {
        return sensorData;
    }
    Serial.println("Packet recieved");

    // // read packet
    String packet = LoRa.readString();
    //check if packet is valid

    if (!(packet.indexOf("temperature:") >= 0 && packet.indexOf("humidity:") >= 0 && packet.indexOf("light:") >= 0 && packet.indexOf("moisture:") >= 0))
    {
        return sensorData;
    }
    
    recieved = true;

    //process packet data
    std::string key, val;
    std::istringstream iss(packet.c_str());

    while (std::getline(std::getline(iss, key, ':') >> std::ws, val)) {
    sensorData[key.c_str()] = std::stof(val);
    
}    

    return sensorData;
}



