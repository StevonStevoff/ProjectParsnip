#include "DeviceESP32.h"

DeviceESP32::DeviceESP32() : Portal(server), sensors_()
{
#ifdef ESP32 // Check if using ESP32 board
    server.on("/", std::bind(&DeviceESP32::rootPage, this));
    // if (Portal.begin()) {
    //     Serial.println("WiFi connected: " + WiFi.localIP().toString());
    // }
    const char *host = "api.thingspeak.com";
    const uint16_t port = 443;
    this->httpClient_ = new HttpClient(host, port);
#endif
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

void DeviceESP32::readSensors()
{
    for (const Sensor *sensor : this->sensors_)
    {
        sensor->read();
    }
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

void DeviceESP32::takeReadings()
{
    // Loop through each sensor and take a reading
    for (auto sensor : sensors_)
    {
        float value = sensor->read();

        // Send the sensor data to the server
        char data[128];
        sprintf(data, "{\"sensor_id\":%d,\"value\":%f}", sensor->getId(), value);
        this->httpClient_->post("/api/sensor-data", data);
    }
}