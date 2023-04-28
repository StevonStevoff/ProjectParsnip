#ifndef DeviceServerInterface_h
#define DeviceServerInterface_h

#ifdef ESP32
#include <HTTPClient.h>
#endif

#ifdef ESP8266
#include <ESP8266HTTPClient.h>
#endif

#include <string>
#include "Arduino.h"
#include <map>

using namespace std;

class DeviceServerInterface
{
public:
    DeviceServerInterface(String baseUrl);
    void setAuthenticationToken(string authToken);
    int sendPlantData(string payload);
    string getAuthenticationToken();
    string getDeviceSensorIds();
    void setHttpUrl(string url);
    int getDeviceInfo();
    void setAuthHeader();

private:
    HTTPClient http;
    string baseUrl;
    string authToken;
};

#endif