#include "Device.h"

// Defines the custom data should be stored in EEPROM.
typedef struct
{
    char token[257]; // 32 bytes for the token + 1 byte for the null terminator
} EEPROM_CONFIG_t;

String Device::onHandleAuthToken(AutoConnectAux &page, PageArgument &args)
{
    String input = args.arg(1);

    EEPROM_CONFIG_t eepromConfig;
    memset(&eepromConfig, 0, sizeof(eepromConfig));
    strncpy(eepromConfig.token, input.c_str(), sizeof(eepromConfig.token) - 1);

    EEPROM.begin(sizeof(eepromConfig));
    EEPROM.put(0, eepromConfig);
    EEPROM.commit();
    EEPROM.end();

    return String();
}

String Device::onLoadAuthPage(AutoConnectAux &page, PageArgument &args)
{
    EEPROM_CONFIG_t eepromConfig;
    EEPROM.begin(sizeof(eepromConfig));
    EEPROM.get(0, eepromConfig);
    EEPROM.end();

    page["input"].value = String(eepromConfig.token) + " (loaded from EEPROM)";

    return String();
}

Device::Device(String deviceServerAddress) : Portal(server), sensors_()
{
    this->deviceServerInterface = new DeviceServerInterface(deviceServerAddress);

    ACText(text, "Please enter your device token");
    ACInput(input, "", "Device Token");
    ACSubmit(save, "SAVE", "/handleAuth");

    ACText(confirmation, "Your device token has been saved!");

    AutoConnectAux auxInputToken = AutoConnectAux("/auth", "Authentication", true, {input, save, text});
    AutoConnectAux auxHandleToken = AutoConnectAux("/handleAuth", "Handle Input", false, {confirmation});

    auxInputToken.on(std::bind(&Device::onLoadAuthPage, this, std::placeholders::_1, std::placeholders::_2));
    auxHandleToken.on(std::bind(&Device::onHandleAuthToken, this, std::placeholders::_1, std::placeholders::_2));

    this->Portal.join({auxInputToken, auxHandleToken});
    this->Portal.begin();

    // this->deviceServerInterface = new DeviceServerInterface(deviceServerAddress);

    // // Add the authentication page to the portal
    // AutoConnectAux &authPage = this->Portal.aux("/auth");
    // authPage.loadElement("input", "token");
    // authPage.on(AUX_EVENT_SUBMIT, onHandleAuthToken);
    // authPage.on(AUX_EVENT_LOAD, onLoadAuthPage);
}

String Device::getAuthenticationToken()
{
    EEPROM_CONFIG_t eepromConfig;
    EEPROM.begin(sizeof(eepromConfig));
    EEPROM.get(0, eepromConfig);
    EEPROM.end();

    return eepromConfig.token;
}

AutoConnect &Device::getPortal()
{
    return this->Portal;
}

void Device::handleClientRequest()
{
    this->getPortal().handleClient();
}

void Device::beginServer()
{
    this->getPortal().begin();
}

void Device::addSensor(Sensor *sensor)
{
    this->sensors_.push_back(sensor);
}

void Device::removeSensor(int id)
{
    auto it = std::find_if(this->sensors_.begin(), sensors_.end(),
                           [&](const Sensor *s)
                           { return s->getId() == id; });

    if (it != this->sensors_.end())
    {
        this->sensors_.erase(it);
    }
}

// one sensor can have multiple readings
std::map<std::string, float> Device::readSensors()
{
    std::map<std::string, float> sensor_readings;
    // Loop through each sensor and take a reading
    for (auto sensor : sensors_)
    {
        std::map<std::string, float> values = sensor->read();
        // Send the sensor data to the server
        // char data[128];
        // sprintf(data, "{\"sensor_id\":%d,\"value\":%f}", sensor->getId(), value);
        Serial.println(values["temperature"]);
        Serial.println(values["humidity"]);
        // this->httpClient_->post("/api/sensor-data", data);
    }

    return sensor_readings;
}

// make a method that packages the data and sends it to the backend using the http client
void Device::sendSensorData()
{
    this->deviceServerInterface->setAuthenticationToken(this->getAuthenticationToken());

    // this->deviceServerInterface->sendPlantData(this->readSensors());

    Serial.println(this->deviceServerInterface->getDeviceSensorIds());

    // Serial.println(this->deviceServerInterface->getDeviceId());

    // if (this->readInterval < this->lastReadTime) // sync time with server
    // {
    //     this->readSensors();
    //     this->lastReadTime = 0;

    //     // send data to server
    //     // this->deviceServerInterface->sendSensorData();
    // }
    // else
    // {
    //     this->lastReadTime += 1000;
    // }
}
