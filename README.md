# Robotic-Lawnmower-Administration-Service

## Project Description

## Installation 


## How to Use


## Directory Structure
├── README.md
├── backend
│   ├── Controllers
│   │   ├── adminController.js
│   │   ├── customerController.js
│   │   ├── robotController.js
│   │   ├── slaController.js
│   │   └── userController.js
│   ├── Middleware
│   │   ├── ValidUser.js
│   │   ├── ValidateTokenHandler.js
│   │   ├── authorization.js
│   │   ├── dateCheck.js
│   │   ├── errorHandler.js
│   │   ├── logSlaEvent.js
│   │   └── priceCalculator.js
│   ├── Models
│   │   ├── notificationModel.js
│   │   ├── priceListModel.js
│   │   ├── reportModel.js
│   │   ├── robotModel.js
│   │   ├── slaLogModel.js
│   │   ├── slaModel.js
│   │   └── userModel.js
│   ├── Routes
│   │   ├── robotRoutes.js
│   │   ├── slaRoutes.js
│   │   └── userRoutes.js
│   ├── config
│   │   └── dbConnection.js
│   ├── constants.js
│   ├── index.js
│   └── package.json
├── package-lock.json
└── web-app
    ├── README.md
    ├── index.html
    ├── package.json
    ├── src
    │   ├── App.vue
    │   ├── assets
    │   │   └── main.css
    │   ├── components
    │   │   ├── AdminNavBar.vue
    │   │   ├── CustomerNavBar.vue
    │   │   ├── Logout.vue
    │   │   ├── ModelPricing.vue
    │   │   ├── Navbar.vue
    │   │   └── TechNavBar.vue
    │   ├── config
    │   │   └── axios.js
    │   ├── main.js
    │   ├── router
    │   │   └── index.js
    │   └── views
    │       ├── AdminViews
    │       │   ├── AdminContractView.vue
    │       │   ├── AdminCreateUser.vue
    │       │   ├── AdminMowerView.vue
    │       │   ├── EditUser.vue
    │       │   ├── PriceLists.vue
    │       │   ├── UpdateContractAsCustomer.vue
    │       │   ├── UpdatePriceList.vue
    │       │   └── UserManagement.vue
    │       ├── CustomerViews
    │       │   ├── CustomerConfirmOrder.vue
    │       │   ├── CustomerContract.vue
    │       │   ├── CustomerContractReport.vue
    │       │   ├── CustomerContracts.vue
    │       │   ├── CustomerLog.vue
    │       │   ├── CustomerNewOrder.vue
    │       │   ├── CustomerProfile.vue
    │       │   └── CustomerUpdateContract.vue
    │       ├── HomeView.vue
    │       ├── LoginView.vue
    │       ├── Pricing.vue
    │       ├── SignUpView.vue
    │       └── TechnicianViews
    │           ├── EditMower.vue
    │           ├── TechAddMower.vue
    │           ├── TechHandleReportView.vue
    │           ├── TechMowersView.vue
    │           └── TechReportsView.vue

## Group Members
Erik Helgesson,       rekhel-9@student.ltu.se <br>
Kalle Hedberg,        kalhed-2@student.ltu.se <br>
Sebastian Pettersson, sebpet-9@student.ltu.se <br>