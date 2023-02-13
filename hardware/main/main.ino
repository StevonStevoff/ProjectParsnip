#include "src/devices/DeviceESP8266.h"

void setup() {
    Serial.begin(115200);
    
    Serial.print("Started");

    DeviceESP8266 device = DeviceESP8266();
    device.connectDeviceToWifi("SeaniPhone", "will1234");

    Serial.print("Connected to wifi");
}

void loop() {
}