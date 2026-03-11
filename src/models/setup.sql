CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    project_date DATE NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
    (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    );

INSERT INTO service_projects (organization_id, title, description, location, project_date)
VALUES
(1, 'School Renovation', 'Renovating classrooms and providing desks.', 'Lusaka Primary School', '2026-04-15'),
(1, 'Community Housing Project', 'Building affordable housing for families.', 'Matero Township', '2026-04-22'),
(1, 'Water Well Construction', 'Installing wells to provide clean water.', 'Chongwe Village', '2026-05-05'),
(1, 'Library Setup', 'Creating a community library with donated books.', 'Woodlands Community Centre', '2026-05-12'),
(1, 'Playground Installation', 'Building safe play areas for children.', 'Kabwe Children’s Park', '2026-05-20');

INSERT INTO service_projects (organization_id, title, description, location, project_date)
VALUES
(2, 'Organic Farming Workshop', 'Training farmers in sustainable practices.', 'Ndola Civic Centre', '2026-04-18'),
(2, 'Community Garden', 'Establishing gardens to improve nutrition.', 'Kitwe Township', '2026-04-25'),
(2, 'Seed Distribution Drive', 'Providing seeds to small-scale farmers.', 'Mansa Market Square', '2026-05-02'),
(2, 'Irrigation System Setup', 'Installing drip irrigation for crops.', 'Kafue Rural Area', '2026-05-09'),
(2, 'Composting Training', 'Teaching communities how to compost waste.', 'Livingstone Community Hall', '2026-05-16');

INSERT INTO service_projects (organization_id, title, description, location, project_date)
VALUES
(3, 'Health Screening Camp', 'Providing free medical check-ups.', 'Roma Clinic', '2026-04-20'),
(3, 'Blood Donation Drive', 'Encouraging community blood donations.', 'University Teaching Hospital', '2026-04-27'),
(3, 'Youth Mentorship Program', 'Pairing youth with professional mentors.', 'Copperbelt University', '2026-05-03'),
(3, 'Disaster Relief Support', 'Providing aid to flood-affected families.', 'Chingola Township', '2026-05-10'),
(3, 'Literacy Campaign', 'Teaching adults basic reading and writing.', 'Lusaka Community Hall', '2026-05-17');
