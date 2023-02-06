#include "src/wifi/Wifi.h"

void setup() {
    Serial.begin(115200);
    Serial.print("Started");

    Wifi wifi("SeaniPhone", "will1234");
    Serial.print("Connected to wifi ");
}

void load() {
}