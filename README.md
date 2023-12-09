# Uchi-Lib: Library and Cataloguing System

"Uchi-Lib" is an innovative library and cataloguing system designed for students, teachers, and librarians. It offers easy access to educational resources, books, and facilitates the work of librarians. The system is created with the aim to enrich the learning experience and stimulate curiosity.

## Technology Stack

Uchi-Lib utilizes the following technologies:

- Java
- SpringBoot
- PostgreSQL
- Angular
- TypeScript
- Elasticsearch
- Logstash
- Kibana
- Docker
- Keycloak
- Keycloakify

## Getting Started

Here's a quick guide on how to get your Uchi-Lib system up and running:

1. **Clone the repository**: Use `git clone` to get a copy of the project on your local machine.

2. **Install dependencies**: Make sure you have all the necessary software installed on your machine (Java, Node.js, Docker, etc.). Then, navigate to the project directory and run `npm install` to install all the necessary packages for the Angular application. Alse, install all the Spring dependencies too by building the gradle script.
  
3. **Build the Keycloak Docker image**: Navigate to the `ACS_LMS_Backend_Keycloak` directory and run the following command to build the Keycloak Docker image:
    ```
    docker build -t keycloak-app .
    `

4. **Start the Docker containers**: Inside the `ACS_LMS_Backend_Keycloak` directory, execute the following command to start all the Docker containers:
    ```
    docker-compose up
    ```

5. **Set up Keycloak**: Navigate to Keycloak at `localhost:8080`. Create a new realm called "ACS_TEST". Add a new client called "frontend_client". In the advanced settings, enable PKCE. Also, add the following roles in the realm roles: ROLE_ADMIN, ROLE_ASSISTANT, ROLE_LIBRARIAN, ROLE_STUDENT, ROLE_TEACHER. Finally, add **your** admin user with the ROLE_ADMIN role.

  
6. **Start ELK and Postgres**: Navigate to the `ACS_LMS_Backend_Resource` directory, then go to the `src` directory by running `cd .\src\`. Run the following command to start the backend Docker containers:
    ```
    docker-compose up
    ```


7. **Start the backend**: Navigate to the backend directory `ACS_LMS_Backend_Resource` and start the Spring application.


8. **Start the frontend**: Navigate to the frontend directory and run `ng serve` to start the Angular application.

9. **Access the application**: Open your web browser and navigate to `http://localhost:4200` to start using Uchi-Lib!

