#ifndef Device_h
#define Device_h

#include "Arduino.h"
#include "../wifi/Wifi.h"

class Device {
    public:
        virtual void connectDeviceToWifi(const char* ssid, const char* password) = 0;
        // virtual void httpRequest();
    private:
        Wifi* wifi;
};


#endif