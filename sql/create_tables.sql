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
  `id` int(10) unsigned NOT NULL auto_increment,
  `username` varchar(255) NOT NULL default '',
  `email` varchar(255) NOT NULL default '',
  `uid` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`id`)
)
  COMMENT='Users'
  DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;

-- TODO