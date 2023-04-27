#include "DeviceServerInterface.h"

DeviceServerInterface::DeviceServerInterface(String baseUrl)
{
    this->baseUrl = baseUrl;
}

void DeviceServerInterface::setAuthenticationToken(String authToken)
{
    this->authToken = authToken;
}

void DeviceServerInterface::setHttpUrl(String url)
{
#ifdef ESP32
    this->http.begin(url);
#endif
#ifdef ESP8266
    WiFiClient client;
    this->http.begin(client, url);
#endif
}

String DeviceServerInterface::getAuthenticationToken()
{
    if (this->authToken == NULL)
        return "NULL";

    if (this->authToken == "")
        return "NULL";

    if (this->authToken.length() > 256)
        return "NULL";

    return this->authToken;
}

int DeviceServerInterface::sendPlantData(String payload)
{

    String address = this->baseUrl + "/plant_data";
    this->setHttpUrl(address);

    //creates headers for the payload
    this->http.addHeader("Content-Type", "application/json");

    this->http.setAuthorization("admin", "string");

    // set the authentication token
    http.addHeader("Authorization", "Bearer " + authToken);

    // send the POST request with the payload
    int statusCode = this->http.POST((uint8_t *)payload.c_str(), payload.length());

    return statusCode;
}

String DeviceServerInterface::getDeviceSensorIds()
{
    String address = this->baseUrl + "/sensors";
    this->setHttpUrl(address);
    this->http.addHeader("Content-Type", "application/json");

    int statusCode = this->http.GET();
    return http.getString();
}
