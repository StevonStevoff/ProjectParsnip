#ifdef ESP32
#include <HTTPClient.h>
#endif

#ifdef ESP8266
#include <ESP8266HTTPClient.h>
#endif

class DeviceServerInterface
{
public:
    DeviceServerInterface(String baseUrl);
    void setAuthToken(String authToken);
    int sendData(float value);
    String getDeviceId();
    void getAuthToken();
    String getDeviceSensorIds();

private:
    HTTPClient http;
    String baseUrl;
    String authToken;
};