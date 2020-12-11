
-- Acknowledge
DELETE FROM acknowledge_vaccine;
DELETE FROM acknowledge;
ALTER SEQUENCE acknowledge_acknowledge_id_seq RESTART WITH 1;
ALTER SEQUENCE acknowledge_vaccine_acknowledge_vaccineid_seq RESTART WITH 1;
-- distribution
DELETE FROM distribution_vaccine;
DELETE FROM distribution;
ALTER SEQUENCE distribution_distributionid_seq RESTART WITH 1;
ALTER SEQUENCE distribution_vaccine_distributionvaccineid_seq RESTART WITH 1;
-- request
DELETE FROM request_vaccine;
DELETE FROM request;
ALTER SEQUENCE request_requestid_seq RESTART WITH 1;
ALTER SEQUENCE request_vaccine_requestvaccineid_seq RESTART WITH 1;
-- vaccine stock
DELETE FROM vaccines_stock;
ALTER SEQUENCE vaccines_vaccinestockid_seq RESTART WITH 1;
-- wastage
DELETE FROM wastage_vaccine;
DELETE FROM wastage;
ALTER SEQUENCE wastage_vaccine_wastage_vaccineid_seq RESTART WITH 1;
ALTER SEQUENCE wastage_wastage_id_seq RESTART WITH 1;
-- returns
DELETE FROM returns_vaccine;
DELETE FROM returns;
ALTER SEQUENCE returns_vaccine_returns_vaccineid_seq RESTART WITH 1;
ALTER SEQUENCE returns_return_id_seq RESTART WITH 1;
-- redistribution
DELETE FROM redistribution_vaccine;
DELETE FROM redistribution;
ALTER SEQUENCE redistribution_vaccine_redistribution_vaccineid_seq RESTART WITH 1;
ALTER SEQUENCE redistribution_redistribution_id_seq RESTART WITH 1;

-- dispense
DELETE FROM dispense_vaccine;
DELETE FROM dispense;
ALTER SEQUENCE dispense_vaccine_dispense_vaccineid_seq RESTART WITH 1;
ALTER SEQUENCE dispense_dispense_id_seq RESTART WITH 1;

-- users
DELETE FROM users;
ALTER SEQUENCE users_userid_seq RESTART WITH 1;
-- VACCINES
DELETE FROM vaccines;
ALTER SEQUENCE vaccines_id_seq RESTART WITH 1;