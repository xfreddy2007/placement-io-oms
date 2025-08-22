# Placements.io OMS - Order Management System

A comprehensive Order Management System (OMS) for digital media publishers, designed to manage campaigns, line items, and billing adjustments. This project implements a simplified version of Placement.io's core functionality, focusing on the finance workflow for end-of-month billing.

## 🎯 Project Overview

### User Story

The primary user is a finance person responsible for end-of-month billing in a digital media platform. They need to:

- View campaigns and their associated line items
- Review booked vs actual amounts for each line item
- Make billing adjustments as needed
- Generate invoices based on performance data

### Business Model

- **Publishers** sell ad campaigns to **advertisers**
- **Campaigns** contain multiple **line items** representing different ads
- Each **line item** has:
  - **Booked amount**: Contracted value
  - **Actual amount**: Performance-based value (impressions/clicks)
  - **Adjustments**: Manual billing modifications (editable field)
- **Invoices** are generated from line items with final amounts calculated as: `actual + adjustments`

## 🏗️ Architecture & Technology Stack

### Monorepo Structure (Turborepo)

- **TypeScript** throughout for type safety
- **Prisma** for database management with PostgreSQL
- **Express.js** API with ts-rest for type-safe contracts
- **Next.js** for web applications
- **Swagger/OpenAPI** for API documentation

### Key Technologies

- **Database**: PostgreSQL with Prisma ORM
- **API**: Express.js with ts-rest for type-safe endpoints
- **Frontend**: Next.js with TypeScript
- **Documentation**: Swagger UI for API exploration
- **Build System**: Turborepo for monorepo management

## 📁 Folder Structure

```
placement-io-oms/
├── apps/
│   ├── api/                    # Express.js API server
│   │   ├── src/
│   │   │   ├── routes/         # API route handlers
│   │   │   │   ├── campaign/   # Campaign endpoints
│   │   │   │   └── lineItem/   # Line item endpoints
│   │   │   ├── server.ts       # Express server setup
│   │   │   └── main.ts         # Application entry point
│   │   └── package.json
│   ├── docs/                   # Documentation app (Next.js)
│   └── web/                    # Main web application (Next.js)
├── packages/
│   ├── database/               # Database package
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Sample data seeding
│   │   ├── rest-contract/      # ts-rest API contracts
│   │   └── package.json
│   ├── ui/                     # Shared UI components
│   ├── eslint-config/          # ESLint configurations
│   ├── typescript-config/      # TypeScript configurations
│   └── utils/                  # Shared utilities
├── docker-compose.yml          # Database container setup
├── package.json                # Root package.json
├── turbo.json                  # Turborepo configuration
└── README.md                   # This file
```

## 🚀 Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Docker** (optional, for database container)

### Quick Start

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd placement-io-oms
   npm install
   ```

2. **Database Setup**

   ```bash
   # Option A: Using Docker (recommended)
   docker-compose up -d

   # Option B: Using local PostgreSQL
   # Create a database and update DATABASE_URL in packages/database/.env
   ```

3. **Environment Configuration**

   ```bash
   # Create environment file for database
   cd packages/database
   cp .env.example .env
   # Update DATABASE_URL with your PostgreSQL connection string
   ```

4. **Database Migration & Seeding**

   ```bash
   yarn run db:generate    # Generate Prisma client
   yarn run db:push        # Push schema to database
   yarn run db:seed        # Seed with sample data
   ```

5. **Start Development Servers**

   ```bash
   # From root directory
   docker compose up           # Start PostgreSQL database container

   # New terminal for back end api
   yarn workspace api dev     # API server only

   # New terminal for front end web app
   yarn workspace web dev     # Web app only
   ```

### Development URLs

- **API Server**: http://localhost:8080
- **Web Application**: http://localhost:3000
- **API Documentation**: http://localhost:8080/swagger
- **Database Studio**: Run `yarn run db:studio` in root directory

## 🎯 Implementation Details

### What I Chose to Implement

#### 1. **Core Data Model** ✅

- **Campaigns**: Orders with unique identifiers and names
- **Line Items**: Individual ads within campaigns with financial tracking
- **Simplified Structure**: Focused on the essential entities for the finance workflow

#### 2. **API Endpoints** ✅

- **GET /campaigns**: List all campaigns
- **GET /campaigns/:id**: Get campaign details with line items
- **GET /line-items**: List line items with filtering options
- **PUT /line-items/update**: Update line item adjustments (editable field)

#### 3. **Database Schema** ✅

- **High Precision**: Decimal(30,15) for large financial amounts
- **Proper Relationships**: Campaign → LineItem (1:many)
- **Sample Data**: Comprehensive seeding with realistic financial data

#### 4. **Type Safety** ✅

- **ts-rest Contracts**: Type-safe API endpoints
- **Prisma Integration**: Type-safe database operations
- **Full TypeScript**: End-to-end type safety

### Design Decisions & Trade-offs

#### 1. **Simplified Data Model**

**Decision**: Removed complex entities (Publishers, Advertisers, Invoices) to focus on core functionality
**Why**: The user story emphasizes the finance person's workflow with campaigns and line items
**Trade-off**: Less comprehensive but more focused on the specific use case

#### 2. **High Precision Decimals**

**Decision**: Used Decimal(30,15) for financial amounts
**Why**: Sample data shows very large numbers (430,706.6871532752) requiring high precision
**Trade-off**: More storage space but ensures financial accuracy

#### 3. **Denormalized Campaign Names**

**Decision**: Store campaign name in both Campaign and LineItem tables
**Why**: Simplifies queries and matches the provided sample data format
**Trade-off**: Data duplication but better query performance

#### 4. **Type-Safe API Contracts**

**Decision**: Used ts-rest for API contracts instead of traditional Express routes
**Why**: Ensures type safety between frontend and backend
**Trade-off**: More setup complexity but better developer experience

#### 5. **Monorepo Structure**

**Decision**: Used Turborepo for managing multiple applications
**Why**: Allows sharing code between API, web app, and shared packages
**Trade-off**: More complex setup but better code organization

### Technical Challenges & Solutions

#### 1. **TypeScript Type Conflicts**

**Challenge**: Swagger UI Express types conflicted with Express types
**Solution**: Used type assertions (`as any`) to bypass conflicts while maintaining functionality

#### 2. **Response Structure Mismatch**

**Challenge**: ts-rest expected specific response formats
**Solution**: Ensured all API responses match the contract structure with proper `body` wrapping

#### 3. **Database Precision**

**Challenge**: Sample data had very large decimal numbers
**Solution**: Used PostgreSQL's Decimal type with high precision (30,15)

## 📊 Sample Data

The application comes with realistic sample data including:

- **3 Campaigns**: Various digital media campaigns
- **8 Line Items**: Different ad types with financial data
- **Realistic Amounts**: Large decimal numbers matching real-world scenarios
- **Adjustments**: Sample billing adjustments for testing

Example line item:

```json
{
  "id": 1,
  "campaign_id": 1,
  "campaign_name": "Satterfield-Turcotte : Multi-channelled next generation analyzer - e550",
  "line_item_name": "Awesome Plastic Car - 6475",
  "booked_amount": 430706.6871532752,
  "actual_amount": 401966.50504006835,
  "adjustments": 1311.0731142230268
}
```

## 🚀 Next Steps

This implementation provides a solid foundation for:

1. **Frontend Development**: Build list and detail views for campaigns and line items
2. **Invoice Generation**: Add invoice creation functionality
3. **Reporting**: Implement financial reports and analytics
4. **User Authentication**: Add user management and permissions
5. **Backend Data Caching**: Add cache mechanism (e.g. Redis) to help reducing backend processing time
6. **Advanced Features**: Add campaign status management, date ranges, etc.

## 📚 Additional Resources

- [Turborepo Documentation](https://turborepo.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [ts-rest Documentation](https://ts-rest.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
