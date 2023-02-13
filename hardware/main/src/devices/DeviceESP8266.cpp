#include "DeviceESP8266.h"


void DeviceESP8266::connectDeviceToWifi(const char* ssid, const char* password) {
    *wifi = WifiESP8266();
    wifi->setupWifi(ssid, password);
}






