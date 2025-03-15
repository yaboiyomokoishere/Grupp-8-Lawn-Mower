# Robotic-Lawnmower-Administration-Service
## Project Description
The purpose of this project is to develop a centralized system for managing service-level agreements (SLAs) for robotic lawnmowers, enablingbusinesses to move from product-centric to service-centric models. The system consists of a web-based frontend where customers can create, modify, or teminate SLAs (e.g., adjusting grass height or working area) and multiple administrative interfaces for managing SLAs and related resources. All operations are tracked in an immutable log, ensuring transparency and accountability.
<br><br>
The backend consists of a REST API to support future types of frontends (e.g., mobile apps). It implements all the logic of the system, e.g., workflows for dynamic SLAs and role-based access control which provide flexibility and security. Inspired by a decentralized approach, this project focuses on scalability and user-based workflows for service management.

## Installation 

### Requirements
Node.js v22.14.0 (or higher) <br>
MongoDB database (Can be either on the cloud, e.g., MongoDB Atlas, or local) <br>
Permit.io account <br>

### MongoDB
If you want to use Atlas as we did you can follow: https://www.mongodb.com/docs/atlas/getting-started/ <br>
Follow the instructions and paste the connection link in the .env file in the CONNECTION_STRING variabel.
You should also be able to run Mongodb locally.

### Permit.io
Begin by creating a new project, then before opening the Dashboard for the newly project and copy the its API key as shown below. <br>
![alt text](images/image.png) <br>

Now in the code directory, replace the mockup API key in the backend/Middleware/authorization.js with yours. Afterwards go back to the <br>
Permit.io web application and select **Policy** in the sidebar. From there create 3 roles: **admin**, **customer**, and **technician**.<br>
The next step will be to create all the resources. For each resource provide a name and the methods allowed based on the following table<br>

| Actions | SLA | Robot | Reports | CustomerAccountInfo | CustomerAccountInfoPrivate |
|---------|-----|-------|---------|---------------------|----------------------------|
| read    | Yes | Yes   | Yes     | Yes                 | Yes                        |
| create  | Yes | Yes   | Yes     | Yes                 | Yes                        |
| update  | Yes | Yes   | No      | Yes                 | Yes                        |
| delete  | No  | Yes   | No      | Yes                 | Yes                        |

After having defined the resources and their allowed methods, you will have to map the methods to each role. Set the mappings for <br>
each role in the **Policy Editor** by following the images below. 

<img src="images/admin.png" width="600" height="300"/>

<img src="images/customer.png" width="600" height="300"/>

<img src="images/technician.png" width="600" height="300"/>
<br>

Lastly, navigate to **Directory** from the sidebar, and then create a user, which will be used to communicate with the service, for <br>
each role. Make sure that the respective **USER KEYS** and the **TOP LEVEL ACCESS** are the same as shown below. The user details   <br>
can be anything, common practice is to use an email for some use cases. 
![alt text](images/image1.png)
Once done with this part, the authorization set up using Permit.io should be complete.

### (Optional) Enable email notifications
When a SLA log is updated there is a possibility to have the changes being emailed to the customer. To enable this functionality <br>
you need an email, which will represent the system/corporation. Once the email is ready, start by removing the comments from line<br>
19-46 in **backend/Middleware/logSlaEvent**, then replace the email at lines 27 and 33 with yours. For line 28 there different   <br>
options depending on the service, for example the one being shown is a gmail application password that can be generated in the   <br>
throught the emails settings. 

### Final step 
Go into the **/backend** and **/web-app** folders respectively, and run the command **npm run install** to download all the        <br>
application dependecies. To start the API (backend) you only need to run **npm run start** (or npm run dev for a development server<br> with nodemon). Complications can sometimes arise due to dependencies in which case you have to delete the **node_modules** map and <br> reinstall them again with **npm run install**. To start the web-app you can either build the static files with **npm run build**   <br>
and then view them with **npm run preview**, or you can just the development server by running **npm run dev**.

## API Documentation
The documentation for the REST API are available in the swagger.yaml file stored in the backend directory. <br>
To view the document one can either start up the backend and visit the /api-docs route or simply paste the <br>
file content in a swagger editor, e.g., at https://editor.swagger.io/.


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
Dispatch,             dispat-2@student.ltu.se
