# Robotic-Lawnmower-Administration-Service
## Project Description
The purpose of this project is to develop a centralized system for managing service-level agreements (SLAs) for robotic lawnmowers, enablingbusinesses to move from product-centric to service-centric models. The system consists of a web-based frontend where customers can create, modify, or teminate SLAs (e.g., adjusting grass height or working area) and multiple administrative interfaces for managing SLAs and related resources. All operations are tracked in an immutable log, ensuring transparency and accountability.
<br><br>
The backend consists of a REST API to support future types of frontends (e.g., mobile apps). It implements all the logic of the system, e.g., workflows for dynamic SLAs and role-based access control which provide flexibility and security. Inspired by a decentralized approach, this project focuses on scalability and user-based workflows for service management.

## Installation 

### Requirements
Node.js v22.14.0 (or higher)
MongoDB account
Permit.io account (Requires email application password)



## How to Use


## Directory Structure

├── backend<br>
│   ├── Controllers<br>
│   │   ├── adminController.js<br>
│   │   ├── customerController.js<br>
│   │   ├── robotController.js<br>
│   │   ├── slaController.js<br>
│   │   └── userController.js<br>
│   ├── Middleware<br>
│   │   ├── ValidUser.js<br>
│   │   ├── ValidateTokenHandler.js<br>
│   │   ├── authorization.js<br>
│   │   ├── dateCheck.js<br>
│   │   ├── errorHandler.js<br>
│   │   ├── logSlaEvent.js<br>
│   │   └── priceCalculator.js<br>
│   ├── Models<br>
│   │   ├── notificationModel.js<br>
│   │   ├── priceListModel.js<br>
│   │   ├── reportModel.js<br>
│   │   ├── robotModel.js<br>
│   │   ├── slaLogModel.js<br>
│   │   ├── slaModel.js<br>
│   │   └── userModel.js<br>
│   ├── Routes<br>
│   │   ├── robotRoutes.js<br>
│   │   ├── slaRoutes.js<br>
│   │   └── userRoutes.js<br>
│   ├── config<br>
│   │   └── dbConnection.js<br>
│   ├── constants.js<br>
│   ├── index.js<br>
│   └── package.json<br>
├── package-lock.json<br>
└── web-app<br>
    ├── README.md<br>
    ├── index.html<br>
    ├── package.json<br>
    ├── src<br>
    │   ├── App.vue<br>
    │   ├── assets<br>
    │   │   └── main.css<br>
    │   ├── components<br>
    │   │   ├── AdminNavBar.vue<br>
    │   │   ├── CustomerNavBar.vue<br>
    │   │   ├── Logout.vue<br>
    │   │   ├── ModelPricing.vue<br>
    │   │   ├── Navbar.vue<br>
    │   │   └── TechNavBar.vue<br>
    │   ├── config<br>
    │   │   └── axios.js<br>
    │   ├── main.js<br>
    │   ├── router<br>
    │   │   └── index.js<br>
    │   └── views<br>
    │       ├── AdminViews<br>
    │       │   ├── AdminContractView.vue<br>
    │       │   ├── AdminCreateUser.vue<br>
    │       │   ├── AdminMowerView.vue<br>
    │       │   ├── EditUser.vue<br>
    │       │   ├── PriceLists.vue<br>
    │       │   ├── UpdateContractAsCustomer.vue<br>
    │       │   ├── UpdatePriceList.vue<br>
    │       │   └── UserManagement.vue<br>
    │       ├── CustomerViews<br>
    │       │   ├── CustomerConfirmOrder.vue<br>
    │       │   ├── CustomerContract.vue<br>
    │       │   ├── CustomerContractReport.vue<br>
    │       │   ├── CustomerContracts.vue<br>
    │       │   ├── CustomerLog.vue<br>
    │       │   ├── CustomerNewOrder.vue<br>
    │       │   ├── CustomerProfile.vue<br>
    │       │   └── CustomerUpdateContract.vue<br>
    │       ├── HomeView.vue<br>
    │       ├── LoginView.vue<br>
    │       ├── Pricing.vue<br>
    │       ├── SignUpView.vue<br>
    │       └── TechnicianViews<br>
    │           ├── EditMower.vue<br>
    │           ├── TechAddMower.vue<br>
    │           ├── TechHandleReportView.vue<br>
    │           ├── TechMowersView.vue<br>
    │           └── TechReportsView.vue<br>

## Group Members
Erik Helgesson,       rekhel-9@student.ltu.se <br>
Kalle Hedberg,        kalhed-2@student.ltu.se <br>
Sebastian Pettersson, sebpet-9@student.ltu.se <br>
Nahor Haile Tsegay,   nahtse-2@student.ltu.se