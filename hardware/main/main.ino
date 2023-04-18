#include "src/devices/DeviceESP32.h"
#include "src/sensors/temperature/TemperatureSensor.h"

// Hardware Definitions
#define ESP32
#define DHTTYPE DHT11
#define DHTPIN 4

// Global Variables
DeviceESP32 *device = new DeviceESP32();
TemperatureSensor *temperatureSensor = new TemperatureSensor(1);

void setup()
{
    delay(1000);
    Serial.begin(9600);
    Serial.println();
    Serial.println(F("start"));
    // add sensors
    device->addSensor(temperatureSensor);
    Serial.println(F("done"));
    device->getPortal().begin();
    // if (device->getPortal().begin())
    // {
    //     // Serial.println("WiFi connected: " + WiFi.localIP().toString());
    //     Serial.println(F("WiFi connected: "));
    //     device->handler.testApiRequest();
    // }
    Serial.println(F("done 2"));
}

void loop()
{
  // delay(1000);
  device->getPortal().handleClient();
  delay(1000);
  Serial.println(temperatureSensor->getTemperature());

  //handle sensor data and send it to backend - every minute, 5, 10, 30 or 1 hour

  

  // Serial.println(F("yes"));
    
    // read sensors values;
    // device->readSensors().handSensor();
    // send any requests needed

}