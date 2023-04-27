#ifdef ESP32
#include <HTTPClient.h>
#endif

#ifdef ESP8266
#include <ESP8266HTTPClient.h>
#endif

#include <map>

class DeviceServerInterface
{
public:
    DeviceServerInterface(String baseUrl);
    void setAuthenticationToken(String authToken);
    int sendPlantData(String payload);
    String getAuthenticationToken();
    String getDeviceSensorIds();
    void setHttpUrl(String url);

private:
    HTTPClient http;
    String baseUrl;
    String authToken;
};