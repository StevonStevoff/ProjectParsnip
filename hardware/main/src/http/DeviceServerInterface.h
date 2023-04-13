#include <HTTPClient.h>

class DeviceServerInterface
{
public:
    DeviceServerInterface(String baseUrl);
    void setAuthToken(String authToken);
    int sendData(float value);
    String getDeviceId();

private:
    HTTPClient http;
    String baseUrl;
    String authToken;
};