import prisma from "../../db";
import lineItems from "./placements_teaser_data.json";

async function main() {
  console.log("🌱 Starting database seed...");

  // Extract unique campaigns from line items and create them
  const uniqueCampaigns = Array.from(
    new Map(
      lineItems.map((item: any) => [
        item.campaign_id,
        { id: item.campaign_id, name: item.campaign_name },
      ])
    ).values()
  );

  for (const campaign of uniqueCampaigns) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: {},
      create: {
        id: campaign.id,
        name: campaign.name,
      },
    });
  }

  for (const lineItem of lineItems) {
    await prisma.lineItem.upsert({
      where: { id: lineItem.id },
      update: {},
      create: {
        id: lineItem.id,
        campaignId: lineItem.campaign_id,
        campaignName: lineItem.campaign_name,
        lineItemName: lineItem.line_item_name,
        bookedAmount: lineItem.booked_amount,
        actualAmount: lineItem.actual_amount,
        adjustments: lineItem.adjustments,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${await prisma.campaign.count()} campaigns`);
  console.log(`Created ${await prisma.lineItem.count()} line items`);

  // Display sample data
  console.log("\n📊 Sample Data:");
  const sampleLineItem = await prisma.lineItem.findFirst({
    include: {
      campaign: true,
    },
  });

  if (sampleLineItem) {
    console.log(JSON.stringify(sampleLineItem, null, 2));
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
