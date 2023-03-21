#include "DeviceESP32.h"


void DeviceESP32::connectDeviceToWifi(const char* ssid, const char* password) {
    // *wifi = Wifi32();
    // wifi->setupWifi(ssid, password);
    #ifdef ESP32 // Check if using ESP32 board
        WiFi.mode(WIFI_STA); // SETS TO STATION MODE!
        WiFi.begin(ssid, password);

        while (WiFi.status() != WL_CONNECTED) {
            delay(1500);
        }

    #endif
}






