#include "DeviceESP32.h"

DeviceESP32::DeviceESP32() : Portal(server), sensors_()
{
#ifdef ESP32 // Check if using ESP32 board
    server.on("/", std::bind(&DeviceESP32::rootPage, this));
    // if (Portal.begin()) {
    //     Serial.println("WiFi connected: " + WiFi.localIP().toString());
    // }
#endif
    this->deviceServerInterface = new DeviceServerInterface("https://parsnipbackend.azurewebsites.net");
}

void DeviceESP32::rootPage()
{
    char content[] = "Hello, world";
    this->server.send(200, "text/plain", content);
}

AutoConnect &DeviceESP32::getPortal()
{
    return Portal;
}

void DeviceESP32::handleClientRequest()
{
    this->getPortal().handleClient();
}

void DeviceESP32::beginServer()
{
    this->getPortal().begin();
}

void DeviceESP32::addSensor(Sensor *sensor)
{
    this->sensors_.push_back(sensor);
}

void DeviceESP32::removeSensor(int id)
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
std::map<std::string, float> DeviceESP32::readSensors()
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
void DeviceESP32::sendSensorData()
{
    if (this->readInterval < this->lastReadTime) // sync time with server
    {
        this->readSensors();
        this->lastReadTime = 0;

        // send data to server
        // this->deviceServerInterface->sendSensorData();
    }
    else
    {
        this->lastReadTime += 1000;
    }
}
void DeviceESP32::setReadInterval(int interval)
{
    this->readInterval = interval;
}
int DeviceESP32::getReadInterval()
{
    return this->readInterval;
}

void DeviceESP32::setLastReadTime(int time)
{
    this->lastReadTime = time;
}
int DeviceESP32::getLastReadTime()
{
    return this->lastReadTime;
}