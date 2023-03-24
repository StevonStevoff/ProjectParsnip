#include "DeviceESP32.h"

//webpage is not encrypted and also uses get rather than post requests.
//TODO improve webpage and security.
const char* index_html = R"rawliteral(
      <!DOCTYPE HTML>
      <html>
        <head>
          <title>Project Parsnip</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h3>Please enter your WiFi network credentials.</h3>
          <br><br>
          <form action="/get">
            <br>
            SSID: <input type="text" name="ssid">
            <br>
            Pass: <input type="text" name="pass">
            <br>
            <input type="submit" value="Submit">
          </form>
        </body>
      </html>
    )rawliteral";


DeviceESP32::DeviceESP32():
    server(80)
    {
    wifiSetupCompleteFlag = false;
}


void DeviceESP32::connectDeviceToWifi(const char* ssid, const char* password) {
    #ifdef ESP32 // Check if using ESP32 board
        WiFi.mode(WIFI_STA); // SETS TO STATION MODE!
        WiFi.begin(ssid, password);

        while (WiFi.status() != WL_CONNECTED) {
            delay(1500);
        }
    #endif
}

void DeviceESP32::deviceSetup(const char* ssid, const char* password) {
    // Set web server port number to 80
    // this.server = server(80);
    // Remove the password parameter, if you want the AP (Access Point) to be open
    WiFi.softAP(ssid, password);

    IPAddress IP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.println(IP);
    
    server.begin();

    user_ssid = "";
    user_pass = "";
    header = "";

    while(true) {
        this->deviceSetupLoop();
        //try to connect to wifi router 
        if(this->user_ssid.length() != 0 && this->user_pass.length() != 0) {
            this->connectDeviceToWifi(this->user_ssid, this->user_pass);
        }
        //if details are incorrect then load wrong details page
        //could not connect, please check details and try again.

        //if right then go to correct page

        // stop server and go to next part.
        if(this->wifiSetupCompleteFlag) break;
    }
    
}

void DeviceESP32::deviceSetupLoop() {
    WiFiClient client = server.available();   // Listen for incoming clients

    if (client) {
    Serial.println("New Client.");
    String currentLine = "";
    while (client.connected()) {
        if (client.available()) {
        char c = client.read();
        Serial.write(c);
        header += c;
        if (c == '\n') {
            if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();

            if (header.indexOf("GET /get") >= 0) {
                if (header.indexOf("ssid=") >= 0) {
                this->user_ssid = header.substring(header.indexOf("ssid=") + 5);
                if (this->user_pass.indexOf("&") >= 0) {
                    this->user_ssid = this->user_ssid.substring(0, this->user_ssid.indexOf("&"));
                }
                }
                if (header.indexOf("pass=") >= 0) {
                this->user_pass = header.substring(header.indexOf("pass=") + 5);
                if (this->user_pass.indexOf("&") >= 0) {
                    this->user_pass = this->user_pass.substring(0, this->user_pass.indexOf("&"));
                }
                }

                // Now you can use the ssid and pass variables as needed
                Serial.println("SSID: " + this->user_ssid);
                Serial.println("Pass: " + this->user_pass);
            }

            client.println(index_html);
            break;
            } else {
            currentLine = "";
            }
        } else if (c != '\r') {
            currentLine += c;
        }
        }
    }

    header = "";
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
    }
}


