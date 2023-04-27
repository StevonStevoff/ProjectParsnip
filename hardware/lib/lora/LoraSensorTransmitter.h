#ifndef LoraSensorTransmitter_h
#define LoraSensorTransmitter_h

#include "../SensorBase/Sensor.h"

#include <LoRa.h>

#include <map>
#include <tuple>
//defines pins for lora
#define ss 15
#define rst -1
#define dio0 10

class LoraSensorTransmitter {
public:
    LoraSensorTransmitter(int id);
    int getId() const;
    //creates abstract method for transmitting data
    virtual void transmit(std::map<std::string, float> sensor_readings) = 0;
protected:
    int id_;
    bool sensorWorking;
};

#endif

