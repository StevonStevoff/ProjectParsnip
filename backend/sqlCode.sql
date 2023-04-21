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
       (3, 'Cacti', 'Cactus type plants.', FALSE, 1),
       (4, 'Rose', 'A type of flower.', FALSE, 1),
       (5, 'Sunflower', 'A type of flower with a large disk.', FALSE, 1),
       (6, 'Lettuce', 'A type of leaf vegetable.', FALSE, 1);

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
       (3, 'Cactus Profile', 'A profile for growing cacti.', TRUE, TRUE, 10, 3, 1),
       (4, 'Rose Profile', 'A profile for growing roses.', TRUE, TRUE, 15, 4, 1),
       (5, 'Sunflower Profile', 'A profile for growing sunflowers.', TRUE, TRUE, 25, 5, 1),
       (6, 'Lettuce Profile', 'A profile for growing lettuce.', TRUE, TRUE, 40, 6, 1);


INSERT INTO grow_property_ranges (id, min, max, grow_property_type_id, plant_profile_id, sensor_id)
VALUES (2, 13.0, 35.0, 2, 2, 2),
       (3, 40.0, 70.0, 3, 2, 4),
       (4, 50.0, 100.0, 4, 2, 5),
       (5, 50.0, 70.0, 5, 2, 3),
       (6, 18.0, 32.0, 2, 3, 2),
       (7, 10.0, 40.0, 3, 3, 4),
       (8, 80.0, 100.0, 4, 3, 5),
       (9, 10.0, 20.0, 5, 3, 3),
       (10, 15.0, 30.0, 2, 4, 2),
       (11, 40.0, 80.0, 3, 4, 4),
       (12, 50.0, 100.0, 4, 4, 5),
       (13, 40.0, 60.0, 5, 4, 3),
       (14, 20.0, 35.0, 2, 5, 2),
       (15, 30.0, 60.0, 3, 5, 4),
       (16, 70.0, 100.0, 4, 5, 5),
       (17, 20.0, 40.0, 5, 5, 3),
       (18, 8.0, 25.0, 2, 6, 2),
       (19, 50.0, 90.0, 3, 6, 4),
       (20, 60.0, 100.0, 4, 6, 5),
       (21, 30.0, 50.0, 5, 6, 3);

INSERT INTO devices (id, name, model_name, owner_id)
VALUES (2, 'Cactus Device', 'ESP32', 2),
       (3, 'Tomato Patch', 'ESP32', 2),
       (4, 'Cherry Tomato Patch', 'ESP32', 2),
       (5, 'Veg Patch', 'ESP8266', 4),
       (6, 'Veg Patch', 'ESP8266', 2),
       (7, 'Rose Garden', 'ESP32', 3),
       (8, 'Sunflower Patch', 'ESP32', 4),
       (9, 'Lettuce Farm', 'ESP8266', 5);

INSERT INTO user_devices (id, user_id, device_id)
VALUES (2, 3, 4),
       (3, 4, 4),
       (4, 2, 5),
       (5, 3, 5),
       (6, 2, 2),
       (7, 2, 3),
       (8, 2, 4),
       (9, 4, 5),
       (10, 2, 6),
       (11, 3, 7),
       (12, 4, 8),
       (13, 5, 9);

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
       (6, 'Outdoor Vegtable Patch', null, 2, 2),
       (7, 'Rose Plant', 7, 4, 4),
       (8, 'Sunflower Plant', 8, 5, 5),
       (9, 'Lettuce Plant', 9, 6, 6);



INSERT INTO plant_data (id, timestamp, plant_id)
VALUES 
       (2, '2023-04-01 13:00:00', 2),
       (3, '2023-04-01 17:00:00', 2),
       (4, '2023-04-01 21:00:00', 2),
       (5, '2023-04-02 09:00:00', 2),
       (6, '2023-04-02 13:00:00', 2),
       (7, '2023-04-02 17:00:00', 2),
       (8, '2023-04-02 21:00:00', 2),
       (9, '2023-04-01 09:00:00', 3),
       (10, '2023-04-01 13:00:00', 3),
       (11, '2023-04-01 17:00:00', 3),
       (12, '2023-04-01 21:00:00', 3),
       (13, '2023-04-02 09:00:00', 3),
       (14, '2023-04-02 13:00:00', 3),
       (15, '2023-04-02 17:00:00', 3),
       (16, '2023-04-02 21:00:00', 3),
       (17, '2023-04-01 09:00:00', 4),
       (18, '2023-04-01 13:00:00', 4),
       (19, '2023-04-01 17:00:00', 4),
       (20, '2023-04-01 21:00:00', 4),
       (21, '2023-04-02 09:00:00', 4),
       (22, '2023-04-02 13:00:00', 4),
       (23, '2023-04-02 17:00:00', 4),
       (24, '2023-04-02 21:00:00', 4),
       (25, '2023-04-01 09:00:00', 5),
       (26, '2023-04-01 13:00:00', 5),
       (27, '2023-04-01 17:00:00', 5),
       (28, '2023-04-01 21:00:00', 5),
       (29, '2023-04-02 09:00:00', 5),
       (30, '2023-04-02 13:00:00', 5),
       (31, '2023-04-02 17:00:00', 5),
       (32, '2023-04-02 21:00:00', 5),
       (33, '2023-04-01 09:00:00', 6),
       (34, '2023-04-01 13:00:00', 6),
       (35, '2023-04-01 17:00:00', 6),
       (36, '2023-04-01 21:00:00', 6),
       (37, '2023-04-02 09:00:00', 6),
       (38, '2023-04-02 13:00:00', 6),
       (39, '2023-04-02 17:00:00', 6),
       (40, '2023-04-02 21:00:00', 6),
       (21, '2023-04-22 08:00:00', 2),
       (22, '2023-04-22 12:00:00', 2),
       (23, '2023-04-22 16:00:00', 2),
       (24, '2023-04-22 20:00:00', 2),
       (25, '2023-04-23 08:00:00', 3),
       (26, '2023-04-23 12:00:00', 3),
       (27, '2023-04-23 16:00:00', 3),
       (28, '2023-04-23 20:00:00', 3),
       (29, '2023-04-24 08:00:00', 4),
       (30, '2023-04-24 12:00:00', 4),
       (31, '2023-04-24 16:00:00', 4),
       (32, '2023-04-24 20:00:00', 4),
       (33, '2023-04-25 08:00:00', 5),
       (34, '2023-04-25 12:00:00', 5),
       (35, '2023-04-25 16:00:00', 5),
       (36, '2023-04-25 20:00:00', 5);

INSERT INTO sensor_readings (id, value, sensor_id, grow_property_id, plant_data_id)
VALUES 
       (8, 56.0, 4, 3, 3),
       (9, 88.0, 5, 4, 3),
       (10, 20.0, 2, 2, 4),
       (11, 52.0, 3, 5, 4),
       (12, 54.0, 4, 3, 4),
       (13, 89.0, 5, 4, 4),
       (14, 22.0, 2, 2, 5),
       (15, 53.0, 3, 5, 5),
       (16, 55.0, 4, 3, 5),
       (17, 90.0, 5, 4, 5),
       (18, 21.0, 2, 2, 6),
       (19, 51.0, 3, 5, 6),
       (20, 56.0, 4, 3, 6),
       (21, 88.0, 5, 4, 6),
       (22, 20.0, 2, 2, 7),
       (23, 50.0, 3, 5, 7),
       (24, 54.0, 4, 3, 7),
       (25, 89.0, 5, 4, 7),
       (26, 22.0, 2, 2, 8),
       (27, 51.0, 3, 5, 8),
       (28, 55.0, 4, 3, 8),
       (29, 90.0, 5, 4, 8),
       (30, 21.0, 2, 2, 9),
       (31, 52.0, 3, 5, 9),
       (32, 56.0, 4, 3, 9),
       (33, 88.0, 5, 4, 9),
       (34, 20.0, 2, 2, 10),
       (35, 50.0, 3, 5, 10),
       (36, 54.0, 4, 3, 10),
       (37, 89.0, 5, 4, 10),
       (38, 22.0, 2, 2, 11),
       (39, 53.0, 3, 5, 11),
       (40, 55.0, 4, 3, 11),
       (41, 90.0, 5, 4, 11),
       (42, 23.0, 2, 2, 12),
       (43, 54.0, 3, 5, 12),
       (44, 57.0, 4, 3, 12),
       (45, 91.0, 5, 4, 12),
       (46, 24.0, 2, 2, 13),
       (47, 55.0, 3, 5, 13),
       (48, 58.0, 4, 3, 13),
       (49, 92.0, 5, 4, 13),
       (50, 25.0, 2, 2, 14),
       (51, 56.0, 3, 5, 14),
       (52, 59.0, 4, 3, 14),
       (53, 93.0, 5, 4, 14),
       (54, 26.0, 2, 2, 15),
       (55, 57.0, 3, 5, 15),
       (56, 60.0, 4, 3, 15),
       (57, 94.0, 5, 4, 15),
       (58, 27.0, 2, 2, 16),
       (59, 58.0, 3, 5, 16),
       (60, 61.0, 4, 3, 16),
       (61, 95.0, 5, 4, 16),
       (62, 28.0, 2, 2, 17),
       (63, 59.0, 3, 5, 17),
       (64, 62.0, 4, 3, 17),
       (65, 96.0, 5, 4, 17),
       (66, 29.0, 2, 2, 18),
       (67, 60.0, 3, 5, 18),
       (68, 63.0, 4, 3, 18),
       (69, 97.0, 5, 4, 18),
       (70, 30.0, 2, 2, 19),
       (71, 61.0, 3, 5, 19),
       (72, 64.0, 4, 3, 19),
       (73, 98.0, 5, 4, 19),
       (74, 31.0, 2, 2, 20),
       (75, 62.0, 3, 5, 20),
       (76, 65.0, 4, 3, 20),
       (77, 99.0, 5, 4, 20),
       (78, 32.0, 2, 21),
       (79, 63.0, 3, 21),
       (80, 66.0, 4, 21),
       (81, 100.0, 5, 21),
       (82, 33.0, 2, 22),
       (83, 64.0, 3, 22),
       (84, 67.0, 4, 22),
       (85, 101.0, 5, 22),
       (86, 34.0, 2, 23),
       (87, 65.0, 3, 23),
       (88, 68.0, 4, 23),
       (89, 102.0, 5, 23),
       (90, 35.0, 2, 24),
       (91, 66.0, 3, 24),
       (92, 69.0, 4, 24),
       (93, 103.0, 5, 24),
       (94, 36.0, 2, 25),
       (95, 67.0, 3, 25),
       (96, 70.0, 4, 25),
       (97, 104.0, 5, 25),
       (98, 37.0, 2, 26),
       (99, 68.0, 3, 26),
       (100, 71.0, 4, 26),
       (101, 105.0, 5, 26),
       (102, 38.0, 2, 27),
       (103, 69.0, 3, 27),
       (104, 72.0, 4, 27),
       (105, 106.0, 5, 27),
       (106, 39.0, 2, 28),
       (107, 70.0, 3, 28),
       (108, 73.0, 4, 28),
       (109, 107.0, 5, 28),
       (110, 40.0, 2, 29),
       (111, 71.0, 3, 29),
       (112, 74.0, 4, 29),
       (113, 108.0, 5, 29),
       (114, 41.0, 2, 30),
       (115, 72.0, 3, 30),
       (116, 75.0, 4, 30),
       (117, 109.0, 5, 30),
       (118, 42.0, 2, 31),
       (119, 73.0, 3, 31),
       (120, 76.0, 4, 31),
       (121, 110.0, 5, 31),
       (122, 43.0, 2, 32),
       (123, 74.0, 3, 32),
       (124, 77.0, 4, 32),
       (125, 111.0, 5, 32),
       (126, 44.0, 2, 33),
       (127, 75.0, 3, 33),
       (128, 78.0, 4, 33),
       (129, 112.0, 5, 33),
       (130, 45.0, 2, 34),
       (131, 76.0, 3, 34),
       (132, 79.0, 4, 34),
       (133, 113.0, 5, 34),
       (134, 46.0, 2, 35),
       (135, 77.0, 3, 35),
       (136, 80.0, 4, 35),
       (137, 114.0, 5, 35),
       (138, 47.0, 2, 36),
       (139, 78.0, 3, 36),
       (140, 81.0, 4, 36),
       (141, 115.0, 5, 36);