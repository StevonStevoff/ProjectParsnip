#include "src/devices/DeviceESP32.h"

void setup() {
    #define ESP32
    // Serial.begin(115200);
    Serial.begin(9600);
    
    Serial.print("Started");

    DeviceESP32 device = DeviceESP32();
    device.connectDeviceToWifi("SeaniPhone", "will1234");

    Serial.print("Connected to wifi");
}

void loop() {
}