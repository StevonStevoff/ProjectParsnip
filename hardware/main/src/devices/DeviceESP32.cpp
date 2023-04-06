#include "DeviceESP32.h"

DeviceESP32::DeviceESP32() : Portal(server), handler() {
    #ifdef ESP32 // Check if using ESP32 board
        server.on("/", std::bind(&DeviceESP32::rootPage, this));
        // if (Portal.begin()) {
        //     Serial.println("WiFi connected: " + WiFi.localIP().toString());
        // }
    #endif 
}

void DeviceESP32::rootPage() {
    char content[] = "Hello, world";
    this->server.send(200, "text/plain", content);
}

AutoConnect& DeviceESP32::getPortal() {
  return Portal;
}


