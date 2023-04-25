// #include "src/devices/DeviceESP32.h"

// DeviceESP32 *device;

#include "TemperatureSensorDHT.h"

TemperatureSensorDHT *temperatureSensor = new TemperatureSensorDHT(1, 4, 11);

#include "DeviceESP8266.h"
DeviceESP8266 *device;

void setup()
{
    delay(1000);

    Serial.begin(9600);
    Serial.println();
    Serial.println(F("start"));

    // ESP8266
    device = new DeviceESP8266();

    // add sensors
    device->addSensor(temperatureSensor);
}

void loop()
{
    delay(1000);
    Serial.println(F("loop"));

    device->readSensors();

    device->sendSensorData();

    device->handleClientRequest();
}
