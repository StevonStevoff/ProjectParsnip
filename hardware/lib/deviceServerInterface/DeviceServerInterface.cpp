#include "DeviceServerInterface.h"

DeviceServerInterface::DeviceServerInterface(String baseUrl)
{
    this->baseUrl = baseUrl.c_str();
}

void DeviceServerInterface::setAuthenticationToken(string authToken)
{
    this->authToken = authToken.c_str();
}

void DeviceServerInterface::setHttpUrl(string url)
{
#ifdef ESP32
    this->http.begin(url.c_str());
#endif
#ifdef ESP8266
    WiFiClient client;
    this->http.begin(client, url.c_str());
#endif
}

string DeviceServerInterface::getAuthenticationToken()
{
    // if (this->authToken == NULL)
    //     return "NULL";

    // if (this->authToken == "")
    //     return "NULL";

    // if (this->authToken.length() > 256)
    //     return "NULL";

    return this->authToken;
}

int DeviceServerInterface::sendPlantData(string payload)
{

    string address = this->baseUrl + "/plant_data";
    this->setHttpUrl(address);

    // send the POST request with the payload
    int statusCode = this->http.POST((uint8_t *)payload.c_str(), payload.length());

    return statusCode;
}

string DeviceServerInterface::getDeviceSensorIds()
{
    string address = this->baseUrl + "/sensors";
    this->setHttpUrl(address);
    this->http.addHeader("Content-Type", "application/json");

    int statusCode = this->http.GET();
    return http.getString().c_str();
}

int DeviceServerInterface::getDeviceInfo()
{
    string address = this->baseUrl + "/devices/identify/";
    this->setHttpUrl(address);
    // // test token
    this->setAuthenticationToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VfaWQiOjEsInRva2VuX3V1aWQiOiJjNTM1ZTJjNDhkZTI0MjhlYWFjNjM3Y2FiZWQxNWVkMCJ9.igd7yZLeC2TyKNB3q9d1z4YB9KFT24skqclr375YALk");

    this->setAuthHeader();

    int statusCode = this->http.GET();

    Serial.println(F("yes"));
    Serial.println(http.getString());

    return statusCode;
}

void DeviceServerInterface::setAuthHeader()
{
    this->http.addHeader("X-SECRET-DEVICE", this->getAuthenticationToken().c_str());
}