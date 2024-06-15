# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# EcommerceAppFrontend
# School Application

## Introduction

This is a school application to maintain the records of the school, including students' and teachers' data. In this application, school management and other users can publish blogs for different activities such as school games, exams, exam results, video dates, promotions, cultural activities, blood donation camps, etc.

## Users

This school application has 7 different types of users, each with different features based on their user role:

- Headmaster
- Vice Headmaster
- Teacher Admin
- Teacher
- Student Admin
- Student Class Leader
- Student

## Pages

The school application has 9 different pages, each demonstrating some features, with some pages having user-specific features. The first two pages do not require user login.

### Home Page

On the homepage, everyone can visit without requiring a login. On the home page, some posts will appear which are posted by the school management, such as school games, promotions, results, and exam dates.

### Login Page

First-time users can create their profile using the sign-up page, but profiles can also be created by school management personnel like the headmaster, vice headmaster, or teacher admin. On the login page, users need to provide their credentials to log in.

### Blogs Page

Every user can visit the blogs page with login only. On this blogs page, there are some blogs posted by the school management and other users.

### Profile Detail Page

Every user can visit their profile detail page; user login is required.

### User Creation Page

Headmaster and teacher admin can visit and create new users; login is required. While creating users, they can assign the user role as well. When a user is created, an ID number will be generated for every user.

### Create Blog Page

Every user can visit and create new blogs and posts; user login is required. While creating a blog, it takes the user information like name, ID, and user role.

## Installation

This project uses React, Vite, and Bootstrap. Follow the steps below to set up the project.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/mySchoolFrontend.git
   cd mySchoolFrontend```
   
2. **Install Dependencies**
```npm install```

4. **Install Vite**

  Vite is a fast build tool for modern web projects. If you don't have Vite installed globally, you can install it using npm:
```npm install -g create-vite```

4. **Set Up Vite Project**

Create a new Vite project with React template:
```npm create vite@latest mySchoolFrontend --template react
cd mySchoolFrontend
```

5. **tart the Development Server**

Start the Vite development server:
```npm run dev```
