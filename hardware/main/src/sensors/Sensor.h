#ifndef Sensor_h
#define Sensor_h

class Sensor
{
public:
    virtual int getId() const = 0;
    virtual float read() const = 0;

private:
};

#endif