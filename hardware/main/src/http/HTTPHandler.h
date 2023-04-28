#include <HTTPClient.h>

class HTTPHandler {
    public:
        HTTPHandler();
        void testApiRequest();
    private:
        WiFiClientSecure client;
};


