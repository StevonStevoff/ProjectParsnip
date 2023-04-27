#include "unity.h"
#include "../../../../lib/receiverBase/Device.h"
// #include "Arduino.h"
// #include "TemperatureSensorDHT.h"

Device *device;

void setUp(void)
{
    // set stuff up here
    device = new Device();
}

void tearDown(void)
{
    // clean stuff up here
}

void test_function_should_doBlahAndBlah(void)
{
    // device->addSensor(new TemperatureSensorDHT(1, 4, 11));
    // TEST_ASSERT_EQUAL(1, device->getSensors().size());
}

void test_function_should_doAlsoDoBlah(void)
{
    // more test stuff
}

int runUnityTests(void)
{
    UNITY_BEGIN();
    RUN_TEST(test_function_should_doBlahAndBlah);
    RUN_TEST(test_function_should_doAlsoDoBlah);
    return UNITY_END();
}

// WARNING!!! PLEASE REMOVE UNNECESSARY MAIN IMPLEMENTATIONS //

/**
 * For native dev-platform or for some embedded frameworks
 */
int main(void)
{
    return runUnityTests();
}

/**
 * For Arduino framework
 */
void setup()
{
    // Wait ~2 seconds before the Unity test runner
    // establishes connection with a board Serial interface
    // delay(2000);

    runUnityTests();
}
void loop()
{
}

/**
 * For ESP-IDF framework
 */
void app_main()
{
    runUnityTests();
}