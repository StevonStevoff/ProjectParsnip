#include "Arduino.h"
#include "Wifi.h"

Wifi::Wifi(const char* ssid, const char* password) {
    WiFi.mode(WIFI_STA); // SETS TO STATION MODE!
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1500);
    }
}
