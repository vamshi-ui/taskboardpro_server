# Task Management API Documentation

## Authentication Routes

### Register a New User

**Endpoint:** `/api/auth/register`

- **Method:** POST
- **Description:** Registers a new user.

### Login

**Endpoint:** `/api/auth/login`

- **Method:** POST
- **Description:** Logs in a user and returns a token.

### Get User Info

**Endpoint:** `/api/auth/userinfo`

- **Method:** GET
- **Description:** Retrieves authenticated user's information.
- **Authorization:** Required (admin, user)

### Logout

**Endpoint:** `/api/auth/logout`

- **Method:** GET
- **Description:** Logs out the user.

---

## Category Routes

### Create Category

**Endpoint:** `/api/category/insert-category`

- **Method:** POST
- **Description:** Creates a new category.
- **Request Body:**
  - `categoryName` (string, required)
  - `description` (string, required)

### Update Category

**Endpoint:** `/api/category/update/:categoryId`

- **Method:** PUT
- **Description:** Updates an existing category.
- **URL Params:**
  - `categoryId` (string, required)

### Delete Category

**Endpoint:** `/api/category/delete/:categoryId`

- **Method:** DELETE
- **Description:** Deletes a category.
- **URL Params:**
  - `categoryId` (string, required)

---

## Tag Routes

### Create Tag

**Endpoint:** `/api/tag/insert-tag`

- **Method:** POST
- **Description:** Creates a new tag.
- **Request Body:**
  - `tagName` (string, required)
  - `description` (string, required)

### Update Tag

**Endpoint:** `/api/tag/update/:tagId`

- **Method:** PUT
- **Description:** Updates an existing tag.
- **URL Params:**
  - `tagId` (string, required)

### Delete Tag

**Endpoint:** `/api/tag/delete/:tagId`

- **Method:** DELETE
- **Description:** Deletes a tag.
- **URL Params:**
  - `tagId` (string, required)

---

## Task Routes

### Create Task

**Endpoint:** `/api/task/create-task`

- **Method:** POST
- **Description:** Creates a new task.
- **Request Body:**
  - `taskName` (string, required)
  - `dueDate` (string, required)
  - `priority` (string, required, values: high, medium, low)
  - `status` (string, required, values: pending, in-progress, completed)
  - `category` (ObjectId, required)
  - `tags` (array of ObjectId, required)
  - `description` (string, required)
- **Authorization:** Required (admin, user)

### Get Task List

**Endpoint:** `/api/task/get-task-list`

- **Method:** GET
- **Description:** Retrieves all tasks.
- **Authorization:** Required (admin, user)

### Get Task Details

**Endpoint:** `/api/task/get-task/:taskId`

- **Method:** GET
- **Description:** Retrieves details of a specific task.
- **URL Params:**
  - `taskId` (string, required, valid MongoDB ObjectId)
- **Authorization:** Required (admin, user)

---

## Data Models

### User Model

- `firstName`, `lastName`, `mobileNumber`, `emailId`, `password`, `role`, `isActive`

### Task Model

- `taskName`, `dueDate`, `priority`, `status`, `category`, `tags`, `description`, `userId`

### Category Model

- `categoryName`, `description`

### Tag Model

- `tagName`, `description`

Let me know if you want me to refine this or add more details! 🚀

