SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `load_pincode_data` DEFAULT CHARACTER SET latin1 ;
USE `load_pincode_data` ;


-- -----------------------------------------------------
-- Table `load_pincode_data`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `load_pincode_data`.`users` ;

CREATE TABLE IF NOT EXISTS `load_pincode_data`.`users` (
  `user_id` INT(70) NULL AUTO_INCREMENT,
  `user_email` VARCHAR(45) NOT NULL,
  `user_password` VARCHAR(45) NOT NULL,
  `user_join_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `load_pincode_data`.`pin_data`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `load_pincode_data`.`pin_data` ;

CREATE TABLE IF NOT EXISTS `load_pincode_data`.`pin_data` (
  `pin_id` INT(70) NOT NULL ,
  `pin_office_name` VARCHAR(45),
  `pin_code` INT(45) NOT NULL,
  `pin_officeType` VARCHAR(45),
  `pin_Deliverystatus` VARCHAR(45),
  `pin_divisionname` VARCHAR(45),
  `pin_regionname` VARCHAR(45),
  `pin_circlename` VARCHAR(45),
  `pin_Taluk` VARCHAR(45),
  `pin_Districtname` VARCHAR(45),
  `pin_statename` VARCHAR(45),
  `pin_Telephone` VARCHAR(18),
  PRIMARY KEY (`pin_id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
