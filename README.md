# Robotic-Lawnmower-Administration-Service

## Project Description


## Installation 


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