#ifndef DerivedLoraSensor_H
#define DerivedLoraSensor_H
#include "LoraSensorTransmitter.h"

class DerivedLoraSensor : public LoraSensorTransmitter {
public:
    DerivedLoraSensor(int id);
    void transmit(std::map<std::string, float> sensor_readings) override;
};

#endif
