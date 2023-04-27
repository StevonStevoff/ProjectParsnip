#include "Arduino.h"
#include "DeviceESP32.h"
#include "TemperatureSensorAHTX.h"
#include "LightSensor.h"
#include "LoraSensor.h"
#include "DerivedLoraSensor.h"
#include "MoistureSensor.h"

//initalize device
DeviceESP32 *device;

void setup()
{

    Wire.begin();

    TemperatureSensorAHTX* temperatureSensor = new TemperatureSensorAHTX(1, 4);
    LightSensor* lightSensor = new LightSensor(2);
    LoraSensor* loraSensor = new DerivedLoraSensor(4);
    MoistureSensor* moistureSensor = new MoistureSensor(3);

    // ESP8266
    device = new DeviceESP32();

    // add sensors
    device->addSensor(temperatureSensor);
    device->addSensor(lightSensor);
    device->addSensor(moistureSensor);

    //reads and transmits sensors
    loraSensor->transmit(device->readSensors());
    ESP.deepSleep(3e6); // 30mins is 1800
}

void loop()
{
    //no loop as device will only run setup when it awakes
}
