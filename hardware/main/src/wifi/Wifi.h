#ifndef Wifi_h
#define Wifi_h

#include "Arduino.h"

class Wifi {
    public:
        virtual void setupWifi(const char* ssid, const char* password) = 0;
    private:
};


#endif