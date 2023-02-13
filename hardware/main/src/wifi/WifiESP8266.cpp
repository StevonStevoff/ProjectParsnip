#include "Arduino.h"
#include "WifiESP8266.h"

void WifiESP8266::setupWifi(const char* ssid, const char* password) {
    WiFi.mode(WIFI_STA); // SETS TO STATION MODE!
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1500);
    }
}






