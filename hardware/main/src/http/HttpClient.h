#include <WiFiClientSecure.h>

#ifdef ESP32 // Check if using ESP32 board
#include <WiFiClientSecure.h>
#endif

class HttpClient
{
public:
    HttpClient(const char *host, const uint16_t port);
    bool post(const char *path, const char *data);

private:
    WiFiClientSecure client_;
    const char *host_;
    const uint16_t port_;
};