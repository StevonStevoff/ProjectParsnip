#include "Arduino.h"
#include "LightSensor.h"
#include "LoraSensor.h"
#include "MoistureSensor.h"
#include "TemperatureSensorDHT.h"

#if defined(ESP32)
#include <DeviceESP32.h>
DeviceESP32 *device;
#elif defined(ESP8266)
#include <DeviceESP8266.h>
DeviceESP8266 *device;
#endif

void setup()
{
#if defined(ESP32)
    device = new DeviceESP32();
#elif defined(ESP8266)
    device = new DeviceESP8266();
#endif

    delay(1000);

    Serial.begin(9600);
    Serial.println();
    Serial.println(F("start"));

    TemperatureSensorDHT *temperatureSensor = new TemperatureSensorDHT(1, 4, 11);
    LightSensor *lightSensor = new LightSensor(2);
    LoraSensor *loraSensor = new LoraSensor(4);
    MoistureSensor *moistureSensor = new MoistureSensor(3);

    device->addSensor(loraSensor);
    device->addSensor(temperatureSensor);
    device->addSensor(lightSensor);
    device->addSensor(moistureSensor);

    // begin server
    device->beginServer();
}

void loop()
{
    delay(1000);
    device->readSensors();

    // device->sendSensorData();

    device->handleClientRequest();

    device->getInfo();
}