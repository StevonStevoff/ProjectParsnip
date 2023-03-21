#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Device.h"

#ifdef ESP32 // Check if using ESP32 board
    #include "WiFi.h" //wifi library 
#endif

class DeviceESP32: public Device {
    public:
       virtual void connectDeviceToWifi(const char* ssid, const char* password);
    private:
        // Wifi* wifi;
};

#endif
