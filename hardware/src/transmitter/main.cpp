#include "Arduino.h"
#include "TemperatureSensorAHTX.h"
#include "LightSensor.h"
#include "LoraSensorTransmitter.h"
#include "DerivedLoraSensor.h"
#include "MoistureSensor.h"

// #if defined(ESP32)
// // #include <DeviceESP32.h>
// // DeviceESP32 *transmitter;
// #elif defined(ESP8266)
#include <TransmitterESP8266.h>
TransmitterESP8266 *transmitter;
// #endif

void setup()
{

    TemperatureSensorAHTX *temperatureSensor = new TemperatureSensorAHTX(1, 4);
    LightSensor *lightSensor = new LightSensor(2);
    LoraSensorTransmitter *loraSensor = new DerivedLoraSensor(4);
    MoistureSensor *moistureSensor = new MoistureSensor(3);

    // #if defined(ESP32)
    //     // transmitter = new DeviceESP32();
    // #elif defined(ESP8266)
    transmitter = new TransmitterESP8266();
    // #endif

    // add sensors
    transmitter->addSensor(temperatureSensor);
    transmitter->addSensor(lightSensor);
    transmitter->addSensor(moistureSensor);

    // reads and transmits sensors
    loraSensor->transmit(transmitter->readSensors());
    ESP.deepSleep(1800e6); // 30mins is 1800
}

void loop()
{
    // no loop as device will only run setup when it awakes
}
