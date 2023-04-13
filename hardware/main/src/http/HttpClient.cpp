// #include "HTTPClient.h"

// HttpClient::HttpClient(const char *host, const uint16_t port)
//     : host_(host), port_(port)
// {
// }

// bool HttpClient::post(const char *path, const char *data)
// {
//     // Connect to the server
//     if (!client_.connect(host_, port_))
//     {
//         Serial.println("Connection failed");
//         return false;
//     }

//     // Send the HTTP POST request
//     client_.print(String("POST ") + path + " HTTP/1.1\r\n" +
//                   "Host: " + host_ + "\r\n" +
//                   "Content-Type: application/json\r\n" +
//                   "Content-Length: " + String(strlen(data)) + "\r\n" +
//                   "Connection: close\r\n" +
//                   "\r\n" +
//                   data);

//     // Wait for the server to respond
//     while (client_.connected())
//     {
//         if (client_.available())
//         {
//             String response = client_.readStringUntil('\n');
//             Serial.println(response);
//         }
//     }

//     // Close the connection
//     client_.stop();
//     return true;
// }