#include "DeviceServerInterface.h"

DeviceServerInterface::DeviceServerInterface(String baseUrl)
{
    this->baseUrl = baseUrl;
}

void DeviceServerInterface::setAuthToken(String authToken)
{
    this->authToken = authToken;
}

void DeviceServerInterface::getAuthToken()
{
    // send the GET request for the auth token
    // int statusCode = http.GET(this->baseUrl + "/getAuthToken");

    // // check the response status code
    // if (statusCode == HTTP_CODE_OK)
    // {
    //     String authToken = http.getString();
    //     this->authToken = authToken;
    // }
}

int DeviceServerInterface::sendData(float value)
{
    // create the payload
    String payloadStr = String(value);

    // set the authentication token
    http.addHeader("Authorization", "Bearer " + authToken);

    // send the POST request with the payload
    // int statusCode = this->http.POST(this->baseUrl + "/sendData", (uint8_t *)payloadStr.c_str(), payloadStr.length());

    // return statusCode;
    return 1;
}

String DeviceServerInterface::getDeviceId()
{
    // set the authentication token
    this->http.addHeader("Authorization", "Bearer " + authToken);

    // send the GET request for the device ID
    // int statusCode = http.GET(this->baseUrl + "/getDeviceId");

    // // check the response status code
    // if (statusCode == HTTP_CODE_OK)
    // {
    //     String deviceId = http.getString();
    //     return deviceId;
    // }
    // else
    // {
    //     return "";
    // }
}