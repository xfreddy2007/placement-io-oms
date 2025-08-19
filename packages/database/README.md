# Database Package

This package contains the Prisma database schema and seed data for the Order Management System (OMS).

## Schema Overview

The database is designed to manage digital media campaigns and line items with a simplified structure that matches the provided sample data format.

### Core Models

1. **Campaign** - Orders/campaigns with unique identifiers and names
2. **LineItem** - Individual ads within a campaign with financial tracking

### Key Relationships

- **Campaign** → **LineItem** (1:many)

### Financial Flow

1. **Booked Amount** - Contracted amount for line items
2. **Actual Amount** - Performance-based amount
3. **Adjustments** - Manual billing adjustments (editable field)
4. **Final Amount** - Total to bill (actual + adjustments)

## Database Setup

### Prerequisites

- PostgreSQL database
- Node.js and npm/yarn

### Installation

1. Install dependencies:

```bash
cd packages/database
npm install
```

2. Set up environment variables:

```bash
# Create .env file
DATABASE_URL="postgresql://username:password@localhost:5432/oms_db"
```

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Push schema to database:

```bash
npm run db:push
```

5. Seed the database with sample data:

```bash
npm run db:seed
```

## Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio for database management
- `npm run db:seed` - Seed database with sample data

## Sample Data Format

The seed script creates data that matches the provided format:

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

### Sample Data Includes:

- **3 Campaigns**:
  - Satterfield-Turcotte : Multi-channelled next generation analyzer - e550
  - Schmitt Group : Visionary zero administration analyzer - f250
  - Klein LLC : Upgradable 24/7 analyzer - g750

- **8 Line Items**: Various products with different financial amounts and adjustments

## Usage Examples

### Query All Line Items with Campaign Data

```typescript
const lineItems = await prisma.lineItem.findMany({
  include: {
    campaign: true,
  },
});
```

### Update Line Item Adjustments

```typescript
const updatedLineItem = await prisma.lineItem.update({
  where: { id: 1 },
  data: {
    adjustments: 1500.0,
  },
});
```

### Get Campaign Summary

```typescript
const campaignSummary = await prisma.campaign.findUnique({
  where: { id: 1 },
  include: {
    lineItems: {
      select: {
        bookedAmount: true,
        actualAmount: true,
        adjustments: true,
      },
    },
  },
});
```

### Filter by Campaign

```typescript
const campaignLineItems = await prisma.lineItem.findMany({
  where: {
    campaignId: 1,
  },
  orderBy: {
    id: "asc",
  },
});
```

## Database Schema Features

- **Auto-incrementing IDs**: Both campaigns and line items use integer IDs
- **High Precision Decimals**: All monetary amounts use Decimal(15,10) for precision
- **Cascade Deletes**: Deleting a campaign removes all related line items
- **Timestamps**: All models include createdAt and updatedAt fields
- **Proper Relationships**: Foreign key relationships with referential integrity

## Data Structure

### Campaign Model

- `id` (Int, Primary Key) - Auto-incrementing campaign ID
- `name` (String) - Campaign name
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### LineItem Model

- `id` (Int, Primary Key) - Auto-incrementing line item ID
- `campaignId` (Int, Foreign Key) - Reference to campaign
- `campaignName` (String) - Campaign name (denormalized for convenience)
- `lineItemName` (String) - Line item name
- `bookedAmount` (Decimal) - Contracted amount
- `actualAmount` (Decimal) - Performance-based amount
- `adjustments` (Decimal) - Billing adjustments (editable field)
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

## Next Steps

This database schema provides the foundation for:

1. **List Views**: Display campaigns and line items in table format
2. **Detail Views**: Show comprehensive information for individual records
3. **Edit Functionality**: Update line item adjustments as required
4. **Reporting**: Generate financial reports and performance analytics
5. **API Development**: Build REST endpoints for frontend consumption
