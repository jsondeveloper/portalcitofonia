CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  context VARCHAR(100),
  role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE extensions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  context VARCHAR(100),
  extension_number VARCHAR(10)
);

CREATE TABLE extension_numbers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  extension_id INT,
  priority VARCHAR(10),
  number VARCHAR(30),
  options VARCHAR(50),
  FOREIGN KEY (extension_id) REFERENCES extensions(id) ON DELETE CASCADE
);
