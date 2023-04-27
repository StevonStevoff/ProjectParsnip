#include "DerivedLoraSensor.h"

DerivedLoraSensor::DerivedLoraSensor(int id) : LoraSensorTransmitter(id)
{
   
}

void DerivedLoraSensor::transmit(std::map<std::string, float> sensor_readings)

{
    //converts map to string for transmission
    std::ostringstream oss;
    for (const auto& kv : sensor_readings) {
        oss << kv.first << ":" << kv.second << "\n";
    }
    std::string packet = oss.str();
    //tramsmits a packet of data
    LoRa.beginPacket();
    LoRa.print(String(packet.c_str()));
    LoRa.endPacket();
}
