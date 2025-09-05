# E-commerce Shop Backend

Welcome to the backend repository for the e-commerce shop. This project is a **comprehensive, scalable, and modular backend system** built with **Django** and **Django REST Framework**. It provides all the necessary APIs for a modern online shop, including:

* User management
* Product catalog
* Orders
* Inventory
* Support, Wishlist, Vendors, Returns, and more

---

## Project Structure

The repository is organized into three main directories to maintain clarity and separate concerns:

* **ER/**: Contains the **Entity-Relationship Diagram** for the database. This visual representation helps understand relationships between data models.
* **DBML/**: Contains the **Database Markup Language (DBML)** file (`DBML.dbml`) used to design the database schema. It provides a text-based, human-readable overview of tables, columns, and relationships.
* **code/**: Contains all source code for the Django project, including apps such as `users`, `catalog`, `orders`, etc., as well as the main project settings.

---

## Getting Started

Follow these steps to set up and run the backend locally.

### 1. Prerequisites

* **Python 3.13.x**
* **pip** (Python package installer)
* **Git**

---

### 2. Download and Setup

1. Clone the repository from GitHub:

```bash
git clone <repository_url>
cd code
```

2. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
```

---

### 3. Install Dependencies

Install the required Python libraries, including Django and Django REST Framework:

```bash
pip install Django djangorestframework
```

---

### 4. Database Setup

The project uses **SQLite**, so no database server configuration is needed. Just run migrations to create tables:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 5. Create an Administrator Account

To access the Django admin panel and manage data:

```bash
python manage.py createsuperuser
```

---

### 6. Run the Server

Start the development server:

```bash
python manage.py runserver
```

* The backend will be available at: `http://127.0.0.1:8000/`


Do you want me to do that?
