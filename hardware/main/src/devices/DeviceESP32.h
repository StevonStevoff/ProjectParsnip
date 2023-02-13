#ifndef DeviceESP32_h
#define DeviceESP32_h

#include "Arduino.h"
#include "Device.h"

#include "../wifi/WifiESP32.h"


class DeviceESP32: public Device {
    public:
       virtual void connectDeviceToWifi(const char* ssid, const char* password);
    private:
        Wifi* wifi;
};

#endif
