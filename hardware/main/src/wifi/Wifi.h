#ifndef Wifi_h
#define Wifi_h

#include "Arduino.h"
#include <ESP8266WiFi.h>

class Wifi {
    public:
        Wifi(const char* ssid, const char* password);
    private:
};


#endif