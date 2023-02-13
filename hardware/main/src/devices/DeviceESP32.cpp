#include "DeviceESP32.h"


void DeviceESP32::connectDeviceToWifi(const char* ssid, const char* password) {
    *wifi = Wifi32();
    wifi->setupWifi(ssid, password);
}






