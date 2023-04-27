// #include <unity.h>

// int main(int argc, char **argv)
// {
//     UNITY_BEGIN();
//     UNITY_END();
// }
// Calculator calc;

// #include <calculator.h>
#include <unity.h>
// src imports
#include "DeviceESP32.h"
#include "TemperatureSensorDHT.h"

// initalize device
Device *device;

void setUp(void)
{
    // set stuff up here
    device = new DeviceESP32();

    delay(1000);
}

void tearDown(void)
{
    // clean stuff up here
}

void test_device_add_temperature_sensor(void)
{
    device->addSensor(new TemperatureSensorDHT(1, 4, 11));
    TEST_ASSERT_EQUAL(1, device->getSensors().size());
}

// void test_calculator_addition(void) {
//     TEST_ASSERT_EQUAL(32, calc.add(25, 7));
// }

// void test_calculator_subtraction(void) {
//     TEST_ASSERT_EQUAL(20, calc.sub(23, 3));
// }

// void test_calculator_multiplication(void) {
//     TEST_ASSERT_EQUAL(50, calc.mul(25, 2));
// }

// void test_calculator_division(void) {
//     TEST_ASSERT_EQUAL(32, calc.div(96, 3));
// }

// void test_expensive_operation(void) {
//     TEST_IGNORE();
// }

void RUN_UNITY_TESTS()
{
    UNITY_BEGIN();
    RUN_TEST(test_device_add_temperature_sensor);
    UNITY_END();
}

#ifdef ARDUINO

#include <Arduino.h>
void setup()
{
    // NOTE!!! Wait for >2 secs
    // if board doesn't support software reset via Serial.DTR/RTS
    delay(2000);
    RUN_UNITY_TESTS();
}

void loop()
{
    delay(500);
}

#else

int main(int argc, char **argv)
{
    RUN_UNITY_TESTS();
    return 0;
}

#endif