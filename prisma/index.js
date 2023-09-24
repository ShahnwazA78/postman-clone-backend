require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getAllRestRequests = async () => {
  try {
    const allRestRequests = await prisma.restRequest.findMany();
    return allRestRequests;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    await prisma.$disconnect(); // Close the database connection
  }
};
module.exports = { prisma, getAllRestRequests };
