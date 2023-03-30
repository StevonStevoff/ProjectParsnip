#include <DNSServer.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebSrv.h>


DNSServer dnsServer;
AsyncWebServer server(80);

String ssid;
String pass;
bool ssid_received = false;
bool pass_received = false;

const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML><html><head>
  <title>Project Parsnip</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  </head><body>
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
</body></html>)rawliteral";

class CaptiveRequestHandler : public AsyncWebHandler {
public:
  CaptiveRequestHandler() {}
  virtual ~CaptiveRequestHandler() {}

  bool canHandle(AsyncWebServerRequest *request){
    //request->addInterestingHeader("ANY");
    return true;
  }

  void handleRequest(AsyncWebServerRequest *request) {
    request->send_P(200, "text/html", index_html); 
  }
};

void setupServer(){
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
      request->send_P(200, "text/html", index_html); 
      Serial.println("Client Connected");
  });
    
  server.on("/get", HTTP_GET, [] (AsyncWebServerRequest *request) {
      String inputMessage;
      String inputParam;
  
      if (request->hasParam("ssid")) {
        inputMessage = request->getParam("ssid")->value();
        inputParam = "ssid";
        ssid = inputMessage;
        ssid_received = true;
      }

      if (request->hasParam("pass")) {
        inputMessage = request->getParam("pass")->value();
        inputParam = "pass";
        pass = inputMessage;
        pass_received = true;
      }
      request->send(200, "text/html", "Network credentials successfullly saved. <br><a href=\"/\">Return to Home Page</a>");
  });
}


void setup(){
  //starting the serve
  //your other setup stuff...
  Serial.begin(9600);
  Serial.println();
  Serial.println("Setting up AP Mode");
  WiFi.mode(WIFI_AP); 
  WiFi.softAP("esp-captive");
  Serial.print("AP IP address: ");Serial.println(WiFi.softAPIP());
  Serial.println("Setting up Async WebServer");
  setupServer();
  Serial.println("Starting DNS Server");
  dnsServer.start(53, "*", WiFi.softAPIP());
  server.addHandler(new CaptiveRequestHandler()).setFilter(ON_AP_FILTER);//only when requested from AP
  //more handlers...
  server.begin();
  while(!ssid_received && !pass_received){
      dnsServer.processNextRequest();
      if(ssid_received && pass_received){
      Serial.print("Inputted SSID: ");Serial.println(ssid);
      Serial.print("Inputted Password: ");Serial.println(pass);
      Serial.println("We'll connect to your network now!");
    }
  }
  server.end();


  // connecting to wifi network
  WiFi.mode(WIFI_STA);
  Serial.printf("Attempting to connect to WiFi...%s",ssid.c_str());
  WiFi.begin(ssid.c_str(), pass.c_str()); // connecting to inputted network 
  while (WiFi.status() == WL_DISCONNECTED) {          // last saved credentials
    delay(500);
    Serial.print(".");
  }

  wl_status_t status = WiFi.status();
  if(status == WL_CONNECTED) {
//       display.clearDisplay();
    //   display.setCursor(0,28);
       Serial.println("\nConnected successfully to "+ssid+"\n");
    //   display.display();
       delay(2000);
  
  Serial.println("All Done!");
}
}

void loop(){
  
}
