#include "src/devices/DeviceESP32.h"

// void setup() {
//     #define ESP32
//     // Serial.begin(115200);
//     Serial.begin(9600);
    
//     Serial.print("Started");

//     DeviceESP32 device = DeviceESP32();
//     device.connectDeviceToWifi("SeaniPhone", "will1234");

//     Serial.print("Connected to wifi --");
// }

// void loop() {
//     // server.handleClient();
// }

// Replace with your network credentials

void setup() {
    Serial.begin(115200);

    DeviceESP32 device = DeviceESP32();
    // device.connectDeviceToWifi("SeaniPhone", "will1234");

    const char* ssid     = "ESP32-Access-Point";
    const char* password = "123456789";

    device.deviceSetup(ssid, password);

    // Connect to Wi-Fi network with SSID and password
    Serial.print("Setting AP (Access Point)…");
}


void loop() {
   
}

