#include "src/devices/DeviceESP32.h"
#include "src/sensors/temperature/TemperatureSensorDHT.h"

// Global Variables
DeviceESP32 *device = new DeviceESP32();
TemperatureSensorDHT *temperatureSensor = new TemperatureSensorDHT(1, 4, 11);

// Lora *lora = new Lora(1);

#include <HttpClient.h>
HTTPClient client;

void setup()
{
  delay(1000);
  Serial.begin(9600);
  Serial.println();
  Serial.println(F("start"));
  // add sensors
  device->addSensor(temperatureSensor);
  // device->addSensor(lora);

  device->beginServer();
  Serial.println(F("Connected to wifi"));

  // client(device->server, 80);
  // client.begin("https://parsnipbackend.azurewebsites.net");
  int loopTime = 0;
}

void loop()
{
  device->handleClientRequest();

  device->readSensors();

  device->sendSensorData();

  Serial.println(F("looped"));
  // device->sendSensorData()

  // Serial.println(temperatureSensor->getTemperature());
  // if (client.GET())
  // {
  //   // Read the response data
  //   String response = client.getString();
  //   Serial.println(response);
  // }
  // else
  // {
  //   Serial.println("HTTP request failed");
  // }
}