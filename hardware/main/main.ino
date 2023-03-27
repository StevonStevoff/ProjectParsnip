#include "src/devices/DeviceESP32.h"

#define ESP32
DeviceESP32* device = new DeviceESP32();

void setup() {
    delay(1000);
    Serial.begin(115200);
    Serial.println();

    // device->setupServer();
    if (device->getPortal().begin()) {
        // Serial.println("WiFi connected: " + WiFi.localIP().toString());
        Serial.println("WiFi connected: ");
    }
}

void loop() {
    device->getPortal().handleClient();
}

