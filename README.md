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

1. AI-Based Crop Disease Detection

Purpose: Automatically detect crop diseases using AI and image recognition from photos uploaded by farmers.
Benefit: Early detection helps prevent crop loss and supports timely intervention.

2. AI-Based Chatbot

Purpose: Provide instant, real-time advice on crop management, pest control, and best farming practices.
Benefit: Reduces information gaps and supports farmers with accurate, actionable guidance anytime.

3. Predictive Analytics & Yield Forecasting

Purpose: Use historical and real-time data to forecast crop yields and market trends.
Benefit: Helps farmers plan production and sales more effectively, improving profitability.

4. Live Location Tracking

Purpose: Track the location of crops, farm equipment, and delivery vehicles in real-time.
Benefit: Optimizes logistics, reduces delays, and ensures timely collection and delivery.

5. Harvest Collection & Transport Management

Purpose: Coordinate crop harvest collection, route planning, and transport schedules efficiently.
Benefit: Minimizes wastage, improves supply chain efficiency, and ensures crops reach buyers on time.

6. Integrated Payment Methods

Purpose: Enable seamless digital transactions between farmers and buyers.
Features: Support for mobile wallets, bank transfers, and QR-based payments.
Benefit: Reduces cash handling risks, ensures fast, secure, and traceable payments.

7. Integration with Logistics & Payment Systems

Purpose: Link with third-party logistics and payment providers to streamline order fulfillment and transactions.
Benefit: Enhances scalability, improves operational efficiency, and reduces manual intervention.

8. Multilingual Support

Purpose: Provide app interfaces and guidance in multiple languages.
Benefit: Makes the system accessible to farmers from diverse linguistic backgrounds.

---

## 📸 Screenshots

###  Farmer Mobile App

**Farmer Dashboard**
![Farmer Dashboard](https://github.com/Amenda-Welgama/Farmer-Support-and-Crop-Collection-System-/issues/1#issuecomment-3453202374)

**Crop Upload Screen**
![Crop Upload](https://github.com/Amenda-Welgama/Farmer-Support-and-Crop-Collection-System-/issues/1#issuecomment-3453218193)


###  Admin Dashboard

**Admin Overview Page**
![Admin Dashboard](https://github.com/Amenda-Welgama/Farmer-Support-and-Crop-Collection-System-/issues/1#issuecomment-3453172995)

**Order Management**
![Order Management](https://github.com/Amenda-Welgama/Farmer-Support-and-Crop-Collection-System-/issues/1#issuecomment-3453195081)

**User Management**
![User Management](https://github.com/Amenda-Welgama/Farmer-Support-and-Crop-Collection-System-/issues/1#issuecomment-3453184818)

**Item Management**
![Item Management](https://github.com/Amenda-Welgama/Farmer-Support-and-Crop-Collection-System-/issues/1#issuecomment-3453192936)

**Category Management**
![Category Management](https://github.com/Amenda-Welgama/Farmer-Support-and-Crop-Collection-System-/issues/1#issuecomment-3453189677)


###  API Testing

**API Testing**
![API Testing](https://github.com/Amenda-Welgama/Farmer-Support-and-Crop-Collection-System-/issues/1#issuecomment-3453197608)


---

## 🙏 Acknowledgements
Special thanks to our mentors and coordinators for their continuous guidance and support throughout the project.

---


