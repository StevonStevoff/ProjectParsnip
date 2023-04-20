#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_AHTX0.h>
#include <BH1750.h>
#include <LoRa.h>

#define ss 15
#define rst -1
#define dio0 10
#define air_moist 560
#define water_moist 300


BH1750 lightMeter;
Adafruit_AHTX0 aht;

void setup()
{
  Serial.begin(9600);
  Serial.setTimeout(2000);

  while (!Serial) { }

  Wire.begin();
  LoRa.setPins(ss, rst, dio0);
  Serial.println("wake");
  if (!LoRa.begin(433E6)) {
    Serial.println("Starting LoRa failed!");
  }
  else {
    Serial.println("LORA ACTIVE");
  }
  if (!lightMeter.begin()) {
    Serial.println("BH1750 LUX SENSOR FAILED!");
  }
  else {
    Serial.println("BH1750 LUX SENSOR ACTIVE");
  }

  if (! aht.begin()) {
    Serial.println("AHT FAILED");
  }
  else {
    Serial.println("AHT ACTIVE");
  }


  int soilMoistureValue = analogRead(A0);
  soilMoistureValue = ((air_moist - soilMoistureValue) * 100) / (air_moist - water_moist);
  soilMoistureValue = soilMoistureValue >= 0 ? soilMoistureValue : 0;
  sensors_event_t humidity, temp;
  aht.getEvent(&humidity, &temp);
  float lux = lightMeter.readLightLevel();

  LoRa.beginPacket();
  LoRa.print("Temp: ");
  LoRa.print(temp.temperature);
  LoRa.println(" C");
  LoRa.print("Hum:  ");
  LoRa.print(humidity.relative_humidity);
  LoRa.println("%");
  LoRa.print("Lux:");
  LoRa.println(lux);
  LoRa.print("Moist:  ");
  LoRa.print(soilMoistureValue);
  LoRa.print("%");

  Serial.println(LoRa.endPacket());
  Serial.println("Packet sent");
  Serial.println("sleep");
  ESP.deepSleep(1800e6); //sleep for 30mins

}

void loop() {

}
