INSERT INTO users (id, email, username, name, hashed_password, is_active, is_superuser, is_verified)
VALUES (2, 'aimeeboyle@gmail.com', 'aimeebb', 'Aimee Boyle', '$2b$12$vzB0aG6/jTto7PBs1aU6vumUlyfiLLHoR.D8yTy1Shd1ZiqrzX0Ti', TRUE, FALSE, TRUE),
       (3, 'janeDoe@mail.com', 'janedoe', 'Jane Doe', '$2b$12$vzB0aG6/jTto7PBs1aU6vumUlyfiLLHoR.D8yTy1Shd1ZiqrzX0Ti', TRUE, FALSE, TRUE),
       (4, 'johnDoe@mail.com', 'johndoe', 'John Doe', '$2b$12$vzB0aG6/jTto7PBs1aU6vumUlyfiLLHoR.D8yTy1Shd1ZiqrzX0Ti', TRUE, FALSE, TRUE),
       (5, 'ryanDoe@mail.com', 'RyanD', 'Ryan Doe', '$2b$12$vzB0aG6/jTto7PBs1aU6vumUlyfiLLHoR.D8yTy1Shd1ZiqrzX0Ti', TRUE, FALSE, TRUE),
       (6, 'bobdoe@mail.com', 'BobD', 'Bob Doe', '$2b$12$vzB0aG6/jTto7PBs1aU6vumUlyfiLLHoR.D8yTy1Shd1ZiqrzX0Ti', TRUE, FALSE, TRUE),
       (7, 'sallydoe@mail.com', 'SallyD', 'Sally Doe', '$2b$12$vzB0aG6/jTto7PBs1aU6vumUlyfiLLHoR.D8yTy1Shd1ZiqrzX0Ti', TRUE, FALSE, TRUE),
       (8, 'suedoe@mail.com', 'SueD', 'Sue Doe', '$2b$12$vzB0aG6/jTto7PBs1aU6vumUlyfiLLHoR.D8yTy1Shd1ZiqrzX0Ti', TRUE, FALSE, TRUE);

INSERT INTO plant_types (id, name, description, user_created, creator_id)
VALUES (2, 'Tomato', 'A type of fruit.', FALSE, 1),
       (3, 'Cacti', 'Cactus type plants.', FALSE, 1);

INSERT INTO grow_property_types (id, name, description)
VALUES (2, 'Temperature', 'Temperature in degrees Celsius.'),
       (3, 'Humidity', 'Humidity as a percentage.'),
       (4, 'Light', 'Light as a percentage.'),
       (5, 'Soil Moisture', 'Soil moisture as a percentage.');

INSERT INTO sensors (id, name, description, grow_property_type_id)
VALUES (2, 'DHT11', 'Temperature Sensor', 2),
       (3, 'REES52', 'Soil Moisture', 5),
       (4, 'DHT21', 'Humidity Sensor', 3),
       (5, 'TSL2561', 'Light Sensor', 4);

INSERT INTO plant_profiles (id, name, description, public, user_created, grow_duration, plant_type_id, creator_id)
VALUES (2, 'Tomato Profile', 'A profile for growing tomatoes.', TRUE, TRUE, 10, 2, 1),
       (3, 'Cactus Profile', 'A profile for growing cacti.', TRUE, TRUE, 10, 3, 1);

INSERT INTO grow_property_ranges (id, min, max, grow_property_type_id, plant_profile_id, sensor_id)
VALUES (2, 13.0, 35.0, 2, 2, 2),
       (3, 40.0, 70.0, 3, 2, 4),
       (4, 50.0, 100.0, 4, 2, 5),
       (5, 50.0, 70.0, 5, 2, 3),
       (6, 18.0, 32.0, 2, 3, 2),
       (7, 10.0, 40.0, 3, 3, 4),
       (8, 80.0, 100.0, 4, 3, 5),
       (9, 10.0, 20.0, 5, 3, 3);

INSERT INTO devices (id, name, model_name, owner_id)
VALUES (2, 'Cactus Device', 'ESP32', 2),
       (3, 'Tomato Patch', 'ESP32', 2),
       (4, 'Cherry Tomato Patch', 'ESP32', 2),
       (5, 'Veg Patch', 'ESP8266', 4),
       (6, 'Veg Patch', 'ESP8266', 2);

INSERT INTO user_devices (id, user_id, device_id)
VALUES (2, 3, 4),
       (3, 4, 4),
       (4, 2, 5),
       (5, 3, 5),
       (6, 2, 2),
       (7, 2, 3),
       (8, 2, 4),
       (9, 4, 5),
       (10, 2, 6);

INSERT INTO device_sensors (id, device_id, sensor_id)
VALUES
       (2, 1, 2),
       (3, 1, 3),
       (4, 1, 4),
       (6, 2, 2),
       (7, 2, 3),
       (8, 2, 4),
       (9, 3, 1),
       (11, 3, 3),
       (12, 3, 4),
       (14, 4, 2), 
       (15, 5, 2), 
       (16, 6, 1);

INSERT INTO plants (id, name, device_id, plant_profile_id, plant_type_id)
VALUES (2, 'Tomato Plant', 3, 2, 2),
       (3, 'Cherry Tomato Plant', 4, 2, 2),
       (4, 'Cactus Plant', 2, 3, 3),
       (5, 'Vegtable Patch', null, 2, 2),
       (6, 'Outdoor Vegtable Patch', null, 2, 2);
