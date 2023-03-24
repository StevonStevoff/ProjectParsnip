#include "DeviceESP8266.h"


void DeviceESP8266::connectDeviceToWifi(const char* ssid, const char* password) {
    // *wifi = WifiESP8266();
    // wifi->setupWifi(ssid, password);
    #ifdef ESP8266 // Check if using ESP8266 board
        WiFi.mode(WIFI_STA); // SETS TO STATION MODE!
        WiFi.begin(ssid, password);

        while (WiFi.status() != WL_CONNECTED) {
            delay(1500);
        }
    #endif

}




