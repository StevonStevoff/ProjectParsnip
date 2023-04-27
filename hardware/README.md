Install PlatformIO (macOS/Linux):
https://docs.platformio.org/en/stable/core/installation/methods/installer-script.html#super-quick-macos-linux

Homebrew: brew install platformio

Windows install:
https://docs.platformio.org/en/stable/core/installation/methods/installer-script.html#local-download-macos-linux-windows

Install PlatformIO shell commands:
https://docs.platformio.org/en/stable/core/installation/shell-commands.html#unix-and-unix-like


Supported Platforms:
ESP32
ESP8266

Supported Sensors:
DHT11 Temperature & Humidity
DHT21 Temperature & Humidity
DHT22 Temperature & Humidity

platformio.ini has all the information about the platforms, dependencies and structure.

To compile code, go into a esp32 or esp8266 directory and run:
pio run -e esp32
pio run -e esp32_transmitter
pio run -e esp8266
pio run -e esp8266_transmitter


To compile and upload code to a device:
pio run -e <enironment> --target upload
Note: You may have to change the platformio.ini file and change the upload_port and monitor_port to the correct port.

To monitor the device (device must be plugged into the port) run:
pio device monitor


To run Doxyfile (documentation generator):
doxygen Doxyfile
