#include "src/devices/DeviceESP32.h"
#include "src/sensors/temperature/TemperatureSensor.h"

// Hardware Definitions
#define ESP32
#define DHTTYPE DHT11
#define DHTPIN 4

// Global Variables
DeviceESP32 *device = new DeviceESP32();
TemperatureSensor *temperatureSensor = new TemperatureSensor(1);

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

  device->beginServer();
  Serial.println(F("Connected to wifi"));

  // client(device->server, 80);
  // client.begin("https://parsnipbackend.azurewebsites.net");
}

void loop()
{
  // delay(1000);
  device->handleClientRequest();
  delay(1000);
  device->readSensors();
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