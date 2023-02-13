#ifndef WifiESP32_h
#define WifiESP32_h

#include "Arduino.h"

#include "WiFi.h"

#include "Wifi.h"

class WifiESP32: public Wifi {
    public:
       virtual void setupWifi(const char* ssid, const char* password);
    private:
};

#endif
