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
    //initalize reading sensors
    Wire.begin();
    this->deviceServerInterface = new DeviceServerInterface(deviceServerAddress);
    AutoConnectConfig Config;
    Config.autoReconnect = true;
    Portal.config(Config);

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

std::vector<Sensor *> Device::getSensors()
{
    return this->sensors_;
}

void Device::readSensors()
{
    std::map<std::string, float> sensor_readings;
    // Loop through each sensor and take a reading
    for (auto sensor : sensors_)
    {
        std::map<std::string, float> values = sensor->read();
        // Combines all the sensor readings into one map

        // checks if the program should read it's own sensor data or wait for more Lora packets
        if (sensor->getId() == 4)
        {
            auto loraSensor = static_cast<LoraSensor *>(sensor);
            if (loraSensor->recieved)
            {
                if (values.size() > 1)
                {
                    this->lastSensorRead = values;
                }
                return;
            }
        }
        else
        {
            sensor_readings.insert(values.begin(), values.end());
        }
    }
    this->lastSensorRead = sensor_readings;
}

// make a method that packages the data and sends it to the backend using the http client
void Device::sendSensorData()
{
    readSensors();
    this->deviceServerInterface->setAuthenticationToken(this->getAuthenticationToken());

    // checks whether it's time to send data
    if (millis() - this->lastSendTime > 3600000) // 3600000 is 60mins
    {
        // creates a json object to POST to the API from the sensor data
        String payloadStr = "{";

        for (auto x = this->lastSensorRead.begin(); x != this->lastSensorRead.end(); ++x)
        {

            char floatStr[10];
            dtostrf(x->second, 5, 2, floatStr); // convert float to char array with 2 decimal places
            String keyValuePair = "\"" + String(x->first.c_str()) + "\":" + String(floatStr) + ",";
            payloadStr.concat(keyValuePair);
        }
        payloadStr.remove(payloadStr.length() - 1); // remove the last comma
        payloadStr += "}";                          // end the json object

        this->lastSendTime = millis();

        for (auto sensor : sensors_)
        {
            // resets Lora sensor's recieved flag
            if (sensor->getId() == 4)
            {
                static_cast<LoraSensor *>(sensor)->recieved = false;
            }
        }
    }
    // deals with the case where the millis() counter has overflowed
    else if (millis() < this->lastSendTime)
    {
        this->lastSendTime = 0;
    }
}
