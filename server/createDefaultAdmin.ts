import { storage } from "./storage";

/**
 * Creates a default admin user if it doesn't already exist
 */
export async function createDefaultAdmin() {
  try {
    // Check if the admin user already exists
    const existingAdmin = await storage.getUserByUsername("admin");
    
    if (!existingAdmin) {
      console.log("Creating default admin user...");
      
      // Create a default admin user
      const adminUser = await storage.createUser({
        username: "admin",
        password: "admin1234", // In a real app, this would be hashed
        email: "admin@iskconjuhu.org",
        name: "Admin User",
        role: "admin"
      });
      
      console.log(`Default admin user created with ID: ${adminUser.id}`);
    } else {
      console.log("Default admin user already exists");
    }
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
}