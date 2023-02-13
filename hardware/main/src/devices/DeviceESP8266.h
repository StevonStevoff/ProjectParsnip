#ifndef DeviceESP8266_h
#define DeviceESP8266_h

#include "Arduino.h"
#include "Device.h"

#include "../wifi/WifiESP8266.h"


class DeviceESP8266: public Device {
    public:
       virtual void connectDeviceToWifi(const char* ssid, const char* password);
    private:
        Wifi* wifi;
};

#endif
