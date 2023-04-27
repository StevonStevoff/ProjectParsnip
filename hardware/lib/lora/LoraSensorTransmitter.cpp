#include "LoraSensorTransmitter.h"

LoraSensorTransmitter::LoraSensorTransmitter(int id) : id_(id)
{
    //initilize sensor
    LoRa.setPins(ss, rst, dio0);
    if (!LoRa.begin(433E6))
    {
        this->sensorWorking = false;
    }
    else
    {
        this->sensorWorking = true;
    }
}
int LoraSensorTransmitter::getId() const
{
    return id_;
}




