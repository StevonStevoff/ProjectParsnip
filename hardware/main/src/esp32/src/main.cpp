// #include "src/devices/DeviceESP32.h"

// DeviceESP32 *device;

// #define ESP8266
// #define ESP32
// Global Variables
// #include "../../sensors/temperature/TemperatureSensorDHT.h"
#include "TemperatureSensorDHT.h"

TemperatureSensorDHT *temperatureSensor = new TemperatureSensorDHT(1, 4, 11);

#include "DeviceESP32.h"
DeviceESP32 *device;

void setup()
{
    delay(1000);

    Serial.begin(9600);
    Serial.println();
    Serial.println(F("start"));

    // ESP32
    // device = new DeviceESP32();
    // ESP8266
    device = new DeviceESP32();

    // add sensors
    device->addSensor(temperatureSensor);

    // device->beginServer();
    // Serial.println(F("Connected to wifi"));

    // int loopTime = 0;
}

void loop()
{
    delay(1000);
    Serial.println(F("loop"));

    device->readSensors();

    device->sendSensorData();

    device->handleClientRequest();
}
