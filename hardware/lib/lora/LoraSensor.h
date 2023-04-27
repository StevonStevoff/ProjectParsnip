#ifndef LoraSensor_h
#define LoraSensor_h

#include "../SensorBase/Sensor.h"

#include <LoRa.h>

#include <map>
#include <tuple>
//defines pins for lora
#define Lorass 15
#define rst -1
#define dio0 10

class LoraSensor : public Sensor{
public:
    LoraSensor(int id);
    int getId() const override;
    //creates read method for recieving data
    std::map<std::string, float> read() const override;
    //creates a boolean to denote whether or not data has been recieved
    mutable bool recieved = false;
protected:
    int id_;
    bool sensorWorking;
    
    
};

#endif

