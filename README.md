#  Farmer App & Crop Management System

##  Overview
The **Farmer – Crop Management System** is a cross-platform mobile and web application that empowers farmers and administrators through a unified digital ecosystem.  
It streamlines crop management, order tracking, and communication between farmers and buyers — while providing admins full control over users, products, and orders.

---

##  Problem & Opportunity

### 🌱 Challenges in Modern Agriculture
- **Fragmented Data:** Farmers struggle to track crop health, yield, and schedules in one place.  
- **Information Gap:** Limited access to reliable and real-time farming advice.  
- **Logistics Bottlenecks:** Manual coordination leads to delays and waste.

### Our Opportunity
To create a **real-time digital ecosystem** that empowers farmers and simplifies agricultural management through:
- Centralized data management  
- Real-time communication  
- Streamlined logistics coordination  

---

## System Architecture
The system is built using an **MVC Architecture** with **RESTful APIs**, ensuring maintainability and scalability.

**Security Features:**
-  **JWT-Based Authentication**  
-  **Role-Based Access Control (RBAC)**
-  **Data Sanitization & Validation**  
-  **CORS & HTTPS Policies**

---

##  Farmer Mobile App

### 🧰 Technologies
- **React Native** – Cross-platform mobile development  
- **Expo** – Simplified testing & camera/image picker integration  
- **Axios** – Secure API communication  

###  Key Features
- **Farmer Dashboard:** Upload crops, track orders & chat with buyers  
- **Crop Upload:** Add name, quantity, price & image (camera/gallery)  
- **Orders Screen:** Real-time viewing of buyer requests & order statuses  
- **Chat Screen:** Instant messaging for seamless communication  
- **User-Friendly Design:** Clean, responsive & intuitive  

---

##  Admin Dashboard (Web)

###  Technologies
- **React.js**
- **CSS**

###  Core Functionalities
- **Dashboard Overview:** Total users, products, orders, and categories  
- **User Management:** Add, edit, delete & assign user roles (Admin/User)  
- **Product Management:** Manage items, prices, stock & availability  
- **Category Management:** Add and maintain product categories  
- **Order Management:** Track orders with statuses (Pending, Completed, Cancelled)  

---

##  Backend (API Layer)

###  Technologies
- **Node.js**
- **Express.js**
- **MySQL**
- **Sequelize ORM**

###  Core Functionalities
- User & Farmer Management  
- Crop & Order Processing  
- Integration between mobile app and admin dashboard  
- Middleware for logging, validation, and performance monitoring  

###  API Design
- RESTful API with standardized JSON responses  
- Pagination, filtering, and error handling support  

---

##  Security & Testing

- **JWT Authentication:** Secure session management  
- **RBAC:** Restricted access for Admin & Farmer roles  
- **Data Sanitization:** Protects against SQL injection & XSS  
- **API Testing:** Conducted using **Postman**  

**Test Coverage Includes:**
-  Status code validation (200, 400, 401, 500)  
-  Schema & data integrity  
-  Error handling & response time tracking  

---

## 👥 Team Contributions

| Team Member | Role | Responsibilities |
|--------------|------|------------------|
| **Dushani-Ekanayake** | Backend Developer & Tester | Node.js APIs, authentication, and testing |
| **Amenda-Welgama** | Backend Developer & Tester | Database integration, API logic, and validation |
| **Kasuntha-2002** | Frontend Developer (Web) | Admin dashboard UI and user management |
| **Dwijerathna** | Frontend Developer (Web) | Dashboard design, product & order management |
| **UNNuwantha** | Frontend Developer (Mobile App) | React Native app interface & feature implementation |

---

## Future Enhancements
-  AI-based crop disease detection  
-  Predictive analytics for yield forecasting  
-  Integration with logistics & payment systems  
-  Multilingual support  

---

## 📸 Screenshots

### 🌾 Farmer Mobile App

**Farmer Dashboard**
![Farmer Dashboard](assets/screenshots/farmer_dashboard.png)

**Crop Upload Screen**
![Crop Upload](assets/screenshots/crop_upload.png)

### 🖥️ Admin Dashboard

**Admin Overview Page**
![Admin Dashboard](assets/screenshots/admin_dashboard.png)

**Order Management**
![Order Management](assets/screenshots/order_management.png)

---

## 🙏 Acknowledgements
Special thanks to our mentors and coordinators for their continuous guidance and support throughout the project.

---


