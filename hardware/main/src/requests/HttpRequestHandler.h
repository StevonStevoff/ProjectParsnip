#ifndef HttpRequestHandler_h
#define HttpRequestHandler_h

#include "Arduino.h"

class HttpRequestHandler {
    public:
        void sendSensorData();
        void createHttpRequest();
    private:
};


#endif