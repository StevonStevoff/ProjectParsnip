#include "HTTPHandler.h"

HTTPHandler::HTTPHandler() {} //constructor

void HTTPHandler::testApiRequest() {
  const char* url = "https://jsonplaceholder.typicode.com/posts/1";
  HTTPClient http;
  http.begin(url);
  int httpCode = http.GET();
  String response = "";

  if (httpCode > 0) {
    response = http.getString();
    Serial.println(response);
  }

  http.end();
}