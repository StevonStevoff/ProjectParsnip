#include "DeviceESP8266.h"


boolean DeviceESP8266::connectDeviceToWifi(const char* ssid, const char* password) {
    #ifdef ESP8266 // Check if using ESP8266 board
        WiFi.mode(WIFI_STA); // SETS TO STATION MODE!
        WiFi.begin(ssid, password);

        while (WiFi.status() != WL_CONNECTED) {
            delay(1500);
        }
    #endif

}




