#ifndef WifiESP8266_h
#define WifiESP8266_h

#include "Arduino.h"
#include <ESP8266WiFi.h>
#include "Wifi.h"

class WifiESP8266: public Wifi {
    public:
       virtual void setupWifi(const char* ssid, const char* password);
    private:
};

#endif
