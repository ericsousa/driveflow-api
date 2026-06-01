# 🚗 DriveFlow API

A simple and functional REST API developed in **TypeScript** with **Express.js** for managing a vehicle dealership.

This project was created as part of a Web Programming assignment focused on MVC architecture, CRUD operations, business rules, HTTP methods, JSON responses, TypeScript typing, and in-memory data persistence.

## 🚀 Features

- ✅ Complete customer management.
- ✅ Complete seller management.
- ✅ Complete vehicle management.
- ✅ Stock control for vehicles.
- ✅ Invoice issuance with stock decrement.
- ✅ Available vehicle listing based on stock quantity.
- ✅ Invoice listing by customer.
- ✅ Invoice listing by seller.
- ✅ Validation for duplicated CPF, seller registration, plate, and invoice number.
- ✅ Protection against invalid removals when related records already exist.

## 🛠️ Technologies Used

- **TypeScript**: Main language with static typing.
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework used to build the REST API.
- **ts-node**: Runs TypeScript files during development.

## 🧱 Project Structure

```text
src/
  controllers/
  models/
  repositories/
  services/
  app.ts
```

## ▶️ How to Run

Clone the repository:

```bash
git clone https://github.com/ericsousa/driveflow-api.git
cd driveflow-api
```

Install dependencies:

```bash
npm install
```

### Development

Start the API:

```bash
npm run dev
```

### Production

Build the project:

```bash
npm run build
```

Start the compiled API:

```bash
npm start
```

The server runs at:

```txt
http://localhost:3000
```

## 🔗 API Endpoints

### Root

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | API welcome message |

### Customers

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/clientes` | List all customers |
| `GET` | `/clientes/:id` | Find customer by ID |
| `GET` | `/clientes/notas/:id` | List invoices by customer |
| `POST` | `/clientes` | Create a customer |
| `PUT` | `/clientes/:id` | Update a customer |
| `DELETE` | `/clientes/:id` | Remove a customer if no invoices are linked |

### Sellers

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/vendedores` | List all sellers |
| `GET` | `/vendedores/:id` | Find seller by ID |
| `GET` | `/vendedores/notas/:id` | List invoices by seller |
| `POST` | `/vendedores` | Create a seller |
| `PUT` | `/vendedores/:id` | Update a seller |
| `DELETE` | `/vendedores/:id` | Remove a seller if no invoices are linked |

### Vehicles

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/carros` | List all vehicles |
| `GET` | `/carros/disponiveis` | List vehicles with stock quantity greater than zero |
| `GET` | `/carros/:id` | Find vehicle by ID |
| `POST` | `/carros` | Create a vehicle |
| `PUT` | `/carros/:id` | Update a vehicle |
| `DELETE` | `/carros/:id` | Remove a vehicle if no stock or invoices are linked |

### Stock

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/estoque` | List all stock records |
| `GET` | `/estoque/:id` | Find stock record by ID |
| `GET` | `/estoque/carro/:id_carro` | Find stock by vehicle ID |
| `POST` | `/estoque` | Create a stock record |
| `PUT` | `/estoque/:id` | Update stock record |
| `DELETE` | `/estoque/:id` | Remove stock record |

### Invoices

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/notas` | List all invoices |
| `GET` | `/notas/:id` | Find invoice by ID |
| `POST` | `/notas` | Issue an invoice and decrement stock |

## 🧪 Business Rules

- Customer CPF must be unique.
- Seller registration number must be unique.
- Vehicle plate must be unique.
- Invoice number must be unique.
- Vehicle year must be between `1950` and `current year + 1`.
- Vehicle price must be greater than zero.
- Seller commission must be between `0` and `30`.
- Stock quantity must be an integer greater than or equal to zero.
- Stock entry date cannot be in the future.
- Only one active stock record is allowed for each vehicle.
- An invoice can only be issued if the related vehicle has stock available.
- Issuing an invoice decrements the vehicle stock by `1`.
- Customers, sellers, and vehicles cannot be removed when linked invoices exist.
- Vehicles cannot be removed when linked stock records exist.

## 🧾 Example Request

```http
POST /notas
Content-Type: application/json
```

```json
{
  "numero_nota": "NF-001",
  "data_emissao": "2026-05-31",
  "valor_total": 85000,
  "id_cliente": 1,
  "id_vendedor": 1,
  "id_carro": 1
}
```

## 📌 Notes

- This project does not use a database.
- All data is stored in memory and is reset when the server restarts.
- The API follows an MVC structure using models, repositories, services, and controllers.
- A Postman collection is included in the repository for endpoint testing.
