#ifndef Sensor_h
#define Sensor_h

#include <map>
#include <string>

class Sensor
{
public:
    virtual int getId() const = 0;
    virtual std::map<std::string, float> read() const = 0;

private:
};

#endif