ALTER DATABASE vmis owner to vmis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE vaccines(
    vaccine_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    shortname VARCHAR(100),
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE acknowledge(
    acknowledge_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_orgunitid VARCHAR(50) ,
    from_orgunitname VARCHAR(100) ,
    to_orgunitid VARCHAR(50) ,
    to_orgunitname VARCHAR(100) ,
    acknowledgement_date date DEFAULT NOW()
);
CREATE TABLE acknowledge_vaccine(
    acknowledge_vaccineid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaccine_uuid UUID REFERENCES vaccines(vaccine_uuid),
    vaccinequantity BIGINT,
    expirationdate date,
    pcv_status BIGINT,
    acknowledge_uuid UUID NOT NULL REFERENCES acknowledge(acknowledge_uuid),
    comment TEXT
);

CREATE TABLE dispense (
    dispense_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    orgunit_id VARCHAR(50) NOT NULL,
    orgunit_name VARCHAR(100),
    dispense_date DATE DEFAULT NOW()
);
CREATE TABLE dispense_vaccine (
    dispense_vaccine_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispense_uuid UUID REFERENCES dispense(dispense_uuid),
    vaccine_uuid UUID NOT NULL  REFERENCES vaccines(vaccine_uuid),
    children_vaccinated BIGINT,
    batch_number VARCHAR(250)
);

CREATE TABLE distribution (
    distribution_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    distribution_origin_id VARCHAR(50),
    distribution_origin_name VARCHAR(100),
    request_origin_id VARCHAR(50),
    request_origin_name VARCHAR(100),
    request_uuid UUID NOT NULL REFERENCES request(request_uuid),
    date DATE DEFAULT NOW(),
);
CREATE TABLE distribution_vaccine (
    distribution_vaccine_uud UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    distribution_uuid UUID REFERENCES distribution(distribution_uuid),
    vaccine_uuid UUID REFERENCES vaccines(vaccine_uuid),
    quantity_requested BIGINT,
    quantity_supplied BIGINT,
    acknowledged BOOLEAN DEFAULT FALSE

);

CREATE TABLE redistribution (
    redistribution_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_orgunitid VARCHAR(50),
    from_orgunitname VARCHAR(100),
    parent_orgunitid VARCHAR(50),
    parent_orgunitname VARCHAR(100)
);
CREATE TABLE redistribution_vaccine (
    redistribution_vaccineid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaccine_uuid UUID NOT NULL REFERENCES vaccines(vaccine_uuid),
    batch_number VARCHAR(250),
    quantity BIGINT,
    redistribution_uuid UUID NOT NULL REFERENCES redistribution(redistribution_uuid)
);

CREATE TABLE request (
    request_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_source_orgunit_name VARCHAR(100),
    from_source_orgunit_id VARCHAR(50),
    to_source_orgunit_name VARCHAR(100),
    to_source_orgunit_id VARCHAR(50),
    status VARCHAR(50),
    date DATE DEFAULT NOW()
);
CREATE TABLE request_vaccine (
    requestvaccine_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaccinename VARCHAR(100),
    request_uuid UUID NOT NULL REFERENCES request(request_uuid),
    quantityrequested BIGINT,
    child_vaccination_number BIGINT,
    vaccine_uuid UUID NOT NULL REFERENCES vaccines(vaccine_uuid)
);

CREATE TABLE returns (
    return_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_orgunitid VARCHAR(50),
    from_orgunitname VARCHAR(100),
    to_orgunitid VARCHAR(50),
    to_orgunitname VARCHAR(100),
    return_date DATE DEFAULT NOW()
);

CREATE TABLE returns_vaccine (
    returns_vaccineid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_uuid UUID NOT NULL REFERENCES returns(return_uuid),
    vaccine_uuid UUID NOT NULL REFERENCES vaccines(vaccine_uuid),
    batch_number VARCHAR(250),
    quantity BIGINT
);
CREATE TABLE users (
    user_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100),
    surname VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(100),
    orgunit VARCHAR(100),
    orgunitlevel VARCHAR(100),
    password VARCHAR(500),
    parentorgunit VARCHAR(100),
    salt VARCHAR(100),
    token VARCHAR(1500),
    lastlogin DATE,
    orgunitname VARCHAR(100),
    parentorgunitname VARCHAR(100)
);
CREATE TABLE vaccines_stock (
    vaccinestock_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number VARCHAR(100),
    expiration_date date,
    quantity BIGINT,
    dose_per_vial BIGINT,
    vvm_status BIGINT,
    vaccine_uuid UUID NOT NULL REFERENCES vaccines(vaccine_uuid),
    orgunitid VARCHAR(50),
    orgunitname VARCHAR(100),
    stock_creation_date DATE DEFAULT NOW()
    -- UNIQUE(vaccine_uuid,batch_number)
);

CREATE TABLE wastage (
    wastage_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_orgunitid VARCHAR(50),
    from_orgunitname VARCHAR(100),
    to_orgunitid VARCHAR(50),
    to_orgunitname VARCHAR(100),
    wastage_date date DEFAULT NOW()
);

CREATE TABLE wastage_vaccine (
    wastage_vaccine_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaccine_uuid UUID NOT NULL REFERENCES vaccines(vaccine_uuid),
    batch_number VARCHAR(250),
    damagetype VARCHAR(100),
    quantity BIGINT,
    expirationdate date,
    comment TEXT,
    wastage_uuid UUID REFERENCES wastage(wastage_uuid)
);
CREATE TABLE stocktrack(
    stocktrack_uuid UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    orgunitid VARCHAR(50),
    orgunitname VARCHAR(100),
    vaccine_uuid UUID NOT NULL REFERENCES vaccines(vaccine_uuid),
    batch_number VARCHAR(250),
    quantity BIGINT,
    date DATE DEFAULT NOW());
    
INSERT INTO users(
    username, name, surname, email, phone, orgunit, orgunitlevel, password, parentorgunit, salt, orgunitname, parentorgunitname)
VALUES ('digiraneza', 'Didier', 'IGIRANEZA', 'di@gmail.com', 2508888, 'Hjw70Lodtf2', 1, '$2b$10$yInn6Q5D/1o.4USKY67gC.QnUlNo6p0WOxwVbb.0qVQV7zTq8GX.C', 'Hjw70Lodtf2', '$2b$10$yInn6Q5D/1o.4USKY67gC.', 'Rwanda', 'Rwanda' )