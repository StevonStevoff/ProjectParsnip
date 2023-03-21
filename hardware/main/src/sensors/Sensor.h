#ifndef Sensor_h
#define Sensor_h

#include "Arduino.h"

class Sensor {
    public:
        virtual void read();
        virtual void structureData();
    private:
};


#endif