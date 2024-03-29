# Fragments Microservice

## Overview
The Fragments Microservice is a cloud-based solution designed to manage and process small fragments of text or images, catering to a diverse array of formats. This microservice seamlessly integrates with various systems, handling data from IoT devices, factory workers' mobile apps, and automated cameras in assembly lines.

## Key Features
- **CRUD Operations**: Create, retrieve, update, and delete functionalities for text and image fragments.
- **Data Conversion**: Convert fragment data between different formats, like Markdown to HTML or JPEG to PNG.
- **Secure and Isolated Data**: All operations require authorization, ensuring data privacy and security.
- **Scalability**: Designed to handle massive data storage needs.
- **Cloud Deployment**: Deployed on AWS for high availability and performance.

## API Version
The API endpoints begin with `/v1/*`, offering flexibility for future updates while maintaining support for older versions.

## Authentication
Supports Basic HTTP credentials or JSON Web Tokens (JWT) for secure access to the API.

## API Endpoints
- **Health Check**: An unauthenticated route for service health verification.
- **POST /fragments**: Create new fragments.
- **GET /fragments**: Retrieve all fragments for the authenticated user.
- **PUT /fragments/:id**: Update existing fragments.
- **DELETE /fragments/:id**: Delete a fragment.

## Technologies
- **AWS**: Leveraging various AWS services for storage, authentication, and deployment.
- **Docker Compose**: For running containers in development and CI workflows.
- **GitHub Actions**: Automated CI/CD workflows for building, testing, and deploying.

## Repository Links
- [Docker Hub Repository](https://hub.docker.com/r/dennisbaksheev1/fragments)
- [Fragments UI Repository](https://github.com/DennisBaksheev/fragments-ui)

### Front-End Integration

The Fragments Microservice is designed to work seamlessly with the Fragments UI front-end. The following integrations were implemented for a cohesive user experience:

1. **AWS Load Balancer Configuration**: Configured the AWS Load Balancer to handle requests from the front-end.

2. **API Security**: Ensured that all API endpoints require proper authentication and are capable of handling requests from the front-end.

3. **Deployment Strategy**: The microservice is deployed to AWS Elastic Container Service, with configurations to support requests from the front-end.



