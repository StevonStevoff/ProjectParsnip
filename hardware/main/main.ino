#include "src/devices/DeviceESP32.h"

#define ESP32
DeviceESP32* device = new DeviceESP32();

void setup() {
    delay(1000);
    Serial.begin(115200);
    Serial.println();

    if (device->getPortal().begin()) {
        // Serial.println("WiFi connected: " + WiFi.localIP().toString());
        Serial.println("WiFi connected: ");
        device->handler.testApiRequest();
    }
}

void loop() {
    device->getPortal().handleClient();
    // read sensors values;
    // device->readSensors().handSensor();
    // send any requests needed



}