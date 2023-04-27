#include "Arduino.h"
#include "DeviceESP32.h"
#include "LightSensor.h"
#include "LoraSensor.h"
#include "MoistureSensor.h"
#include "TemperatureSensorDHT.h"


//initalize device
DeviceESP32* device;


void setup()
{
    //initalize ESP32
    device = new DeviceESP32();
    delay(1000);

    Serial.begin(9600);
    Serial.println();
    Serial.println(F("start"));

    //initalize sensors
    Wire.begin();

    TemperatureSensorDHT* temperatureSensor = new TemperatureSensorDHT(1, 4, 11);
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