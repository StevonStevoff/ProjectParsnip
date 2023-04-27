#include "Arduino.h"
#include "DeviceESP8266.h"
#include "TemperatureSensorAHTX.h"
#include "LightSensor.h"
#include "LoraSensor.h"
#include "MoistureSensor.h"


//initalize device
DeviceESP8266 *device;

void setup()
{
    //initalize ESP8266
    device = new DeviceESP8266();

    //initalize sensors
    Wire.begin();
    
    TemperatureSensorAHTX* temperatureSensor = new TemperatureSensorAHTX(1, 4);
    LightSensor* lightSensor = new LightSensor(2);
    LoraSensor* loraSensor = new LoraSensor(4);
    MoistureSensor* moistureSensor = new MoistureSensor(3);
    
    device->addSensor(loraSensor);
    device->addSensor(temperatureSensor);
    device->addSensor(lightSensor);
    device->addSensor(moistureSensor);
    

    // begin server
    device->beginServer();
}

void loop()
{

    device->sendSensorData();

}