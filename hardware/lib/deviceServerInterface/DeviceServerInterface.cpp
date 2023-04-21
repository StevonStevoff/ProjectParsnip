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

void DeviceServerInterface::setAuthHeader()
{
    this->http.addHeader("X-SECRET-DEVICE", this->getAuthenticationToken());
}

int DeviceServerInterface::sendPlantData(std::map<std::string, float> sensorReadings)
{

    String address = this->baseUrl + "/plant_data";
    this->setHttpUrl(address);

    this->http.addHeader("Content-Type", "application/json");

    this->http.setAuthorization("admin", "string");

    // create the payload
    String payloadStr = "yes";

    // convert map to json object string
    // String payloadStr = "{"; // start the json object
    // for (auto const &x : sensorReadings)
    // {
    //     payloadStr += "\"" + String(x.first.c_str()) + "\":" + String(x.second) + ",";
    // }
    // payloadStr.remove(payloadStr.length() - 1); // remove the last comma
    // payloadStr += "}"; // end the json object

    // set the authentication token
    this->setAuthHeader();

    // send the POST request with the payload
    int statusCode = this->http.POST((uint8_t *)payloadStr.c_str(), payloadStr.length());

    return statusCode;
}

String DeviceServerInterface::getDeviceSensorIds()
{
    this->setHttpUrl(this->baseUrl + "/sensors");
    this->setHttpUrl(this->baseUrl);

    this->setAuthHeader();

    // this->http.addHeader("Authorization", "Bearer " + this->authToken);
    // String address = this->baseUrl + "/getSensorIds";
    int statusCode = this->http.GET();
    Serial.println(statusCode); // remove this when done debugging
    return http.getString();
}
