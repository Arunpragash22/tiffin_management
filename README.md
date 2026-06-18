# Tiffin Management System

A full-stack Tiffin Management System built with **React.js (Vite)**, **Java Spring Boot 3** (Java 21), and **MySQL**. The application supports two user roles — **Admin** and **Student** — with JWT-based authentication and role-based authorization.

---

## Features

### Authentication Module
- Student Registration with Aadhaar image upload
- Student & Admin Login
- JWT-based stateless authentication
- Logout functionality
- BCrypt password encryption

### Student Portal
- View and update profile
- Upload/update Aadhaar card image
- View daily and weekly menus
- Place online tiffin orders
- View order history and cancel orders
- View attendance records

### Admin Panel
- Dashboard with key statistics
- Student CRUD with search and activate/deactivate
- View uploaded Aadhaar documents
- Attendance management (mark, view, update, delete)
- Menu management (daily/weekly)
- Order management with status updates

---

## Technology Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, Vite, Material UI, Axios, React Router |
| Backend    | Spring Boot 3, Java 21, Spring Security, JPA    |
| Database   | MySQL 8                                         |
| Auth       | JWT (jjwt), BCrypt                              |
| API Docs   | Swagger/OpenAPI (springdoc)                     |
| Build      | Maven (backend), npm (frontend)                 |

---

## Project Structure

```
tiffin-management/
├── src/main/java/com/tiffin/tiffin_management/
│   ├── config/          # Security, OpenAPI, Data initializer
│   ├── controller/      # REST API controllers
│   ├── dto/             # Request & Response DTOs
│   ├── entity/          # JPA entities & enums
│   ├── exception/       # Global exception handling
│   ├── repository/      # Spring Data JPA repositories
│   ├── security/        # JWT filter, UserDetails
│   ├── service/         # Business logic layer
│   └── util/            # File storage, DTO mapper
├── database/
│   ├── schema.sql
│   └── seed-data.sql
├── frontend/
├── postman/
└── README.md
```

---

## Prerequisites

- Java 21 (JDK)
- Maven 3.8+
- Node.js 18+ and npm
- MySQL 8.0+

---

## Database Setup

### Option 1: Automatic (Recommended)
Spring Boot auto-creates the database and tables on startup.

Update credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### Option 2: Manual SQL Scripts
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed-data.sql
```

---

## Backend Setup & Run

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Backend: **http://localhost:8080**

### Default Admin Credentials
| Email              | Password   |
|--------------------|------------|
| admin@tiffin.com   | Admin@123  |

### API Documentation
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

---

## Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` — Student registration (multipart)
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout

### Admin
- `GET /api/admin/dashboard` — Dashboard stats
- `GET/PUT/DELETE /api/admin/students/{id}` — Student CRUD
- `PATCH /api/admin/students/{id}/status` — Activate/deactivate
- `POST/GET/PUT/DELETE /api/admin/attendance` — Attendance CRUD
- `POST/GET/PUT/DELETE /api/admin/menus` — Menu CRUD
- `GET/PATCH/DELETE /api/admin/orders` — Order management

### Student
- `GET/PUT /api/student/profile` — Profile management
- `PUT /api/student/profile/aadhaar` — Aadhaar upload
- `GET /api/student/menus/daily|weekly` — View menus
- `POST/GET /api/student/orders` — Place/view orders
- `PATCH /api/student/orders/{id}/cancel` — Cancel order
- `GET /api/student/attendance` — View attendance

---

## Postman Collection

Import `postman/Tiffin-Management-API.postman_collection.json` into Postman. Login requests auto-save the JWT token.

---

## Security

- BCrypt password encryption
- JWT stateless authentication
- Role-based authorization (ADMIN, STUDENT)
- Protected frontend routes
- Request validation and global exception handling

---

## License

Open source — for educational and portfolio purposes.
