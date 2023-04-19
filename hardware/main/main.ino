#include "src/devices/DeviceESP32.h"
#include "src/sensors/temperature/TemperatureSensorDHT.h"

// Global Variables
DeviceESP32 *device;
TemperatureSensorDHT *temperatureSensor = new TemperatureSensorDHT(1, 4, 11);

void setup()
{
  delay(1000);

  Serial.begin(9600);
  Serial.println();
  Serial.println(F("start"));

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