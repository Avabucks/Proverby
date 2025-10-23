--
-- Database : `proverby`
--
CREATE DATABASE IF NOT EXISTS `proverby`
  DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE proverby;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  UNIQUE KEY unique_uid (uid)
)

-- TODO