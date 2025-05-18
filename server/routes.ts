import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import paymentRoutes from "./routes/payment";
import { 
  insertUserSchema, 
  insertBannerSchema, 
  insertQuoteSchema, 
  insertDonationCategorySchema, 
  insertEventSchema, 
  insertGallerySchema, 
  insertVideoSchema, 
  insertTestimonialSchema,
  insertContactMessageSchema,
  insertSocialLinkSchema,
  insertDonationSchema,
  insertSubscriptionSchema
} from "@shared/schema";

import express from "express";
import session from "express-session";
import { z } from "zod";
// This is a workaround for ESM compatibility
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Middleware to verify if user is authenticated
const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Check session or JWT token
  // For demo purposes, we'll just check for userId in the session
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Middleware to verify if user is an admin
const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Error in admin authorization:", error);
    return res.status(500).json({ message: "Error checking admin authorization" });
  }
};

// Extend express Request type to include session
declare module "express-session" {
  interface Session {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Use a simple in-memory session store for development
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "iskcon_juhu_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 } // 1 day
    })
  );

  // Banner API endpoints
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners.filter(b => b.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching banners" });
    }
  });

  app.post("/api/banners", isAdmin, async (req, res) => {
    try {
      const data = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(data);
      res.status(201).json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating banner" });
    }
  });

  app.put("/api/banners/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertBannerSchema.partial().parse(req.body);
      const banner = await storage.updateBanner(id, data);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating banner" });
    }
  });

  app.delete("/api/banners/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBanner(id);
      if (!success) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json({ message: "Banner deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting banner" });
    }
  });

  // Quotes API endpoints
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getQuotes();
      res.json(quotes.filter(q => q.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching quotes" });
    }
  });

  app.post("/api/quotes", isAdmin, async (req, res) => {
    try {
      const data = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(data);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating quote" });
    }
  });

  app.put("/api/quotes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertQuoteSchema.partial().parse(req.body);
      const quote = await storage.updateQuote(id, data);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating quote" });
    }
  });

  app.delete("/api/quotes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteQuote(id);
      if (!success) {
        return res.status(404).json({ message: "Quote not found" });
      }
      res.json({ message: "Quote deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting quote" });
    }
  });

  // Donation Categories API endpoints
  app.get("/api/donation-categories", async (req, res) => {
    try {
      const categories = await storage.getDonationCategories();
      res.json(categories.filter(c => c.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching donation categories" });
    }
  });

  app.get("/api/donation-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getDonationCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Donation category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donation category" });
    }
  });

  app.post("/api/donation-categories", isAdmin, async (req, res) => {
    try {
      const data = insertDonationCategorySchema.parse(req.body);
      const category = await storage.createDonationCategory(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating donation category" });
    }
  });

  app.put("/api/donation-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = insertDonationCategorySchema.partial().parse(req.body);
      
      // Handle suggestedAmounts separately to ensure correct type
      let data = { ...requestData };
      if (requestData.suggestedAmounts && !Array.isArray(requestData.suggestedAmounts)) {
        data = {
          ...requestData,
          suggestedAmounts: Array.isArray(requestData.suggestedAmounts) 
            ? requestData.suggestedAmounts 
            : null
        };
      }
      
      const category = await storage.updateDonationCategory(id, data);
      if (!category) {
        return res.status(404).json({ message: "Donation category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating donation category" });
    }
  });

  app.delete("/api/donation-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDonationCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Donation category not found" });
      }
      res.json({ message: "Donation category deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting donation category" });
    }
  });

  // Events API endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events.filter(e => e.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Error fetching event" });
    }
  });

  app.post("/api/events", isAdmin, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating event" });
    }
  });

  app.put("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = insertEventSchema.partial().parse(req.body);
      
      // Handle suggestedAmounts separately to ensure correct type
      let data = { ...requestData };
      if (requestData.suggestedAmounts && !Array.isArray(requestData.suggestedAmounts)) {
        data = {
          ...requestData,
          suggestedAmounts: Array.isArray(requestData.suggestedAmounts) 
            ? requestData.suggestedAmounts 
            : null
        };
      }
      
      const event = await storage.updateEvent(id, data);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating event" });
    }
  });

  app.delete("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event" });
    }
  });

  // Gallery API endpoints
  app.get("/api/gallery", async (req, res) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gallery items" });
    }
  });

  app.post("/api/gallery", isAdmin, async (req, res) => {
    try {
      const data = insertGallerySchema.parse(req.body);
      const galleryItem = await storage.createGalleryItem(data);
      res.status(201).json(galleryItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating gallery item" });
    }
  });

  app.put("/api/gallery/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertGallerySchema.partial().parse(req.body);
      const galleryItem = await storage.updateGalleryItem(id, data);
      if (!galleryItem) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      res.json(galleryItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating gallery item" });
    }
  });

  app.delete("/api/gallery/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGalleryItem(id);
      if (!success) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      res.json({ message: "Gallery item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting gallery item" });
    }
  });

  // Videos API endpoints
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Error fetching videos" });
    }
  });

  app.post("/api/videos", isAdmin, async (req, res) => {
    try {
      const data = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(data);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating video" });
    }
  });

  app.put("/api/videos/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(id, data);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating video" });
    }
  });

  app.delete("/api/videos/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteVideo(id);
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json({ message: "Video deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting video" });
    }
  });

  // Testimonials API endpoints
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });

  app.post("/api/testimonials", isAdmin, async (req, res) => {
    try {
      const data = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(data);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating testimonial" });
    }
  });

  app.put("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, data);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating testimonial" });
    }
  });

  app.delete("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTestimonial(id);
      if (!success) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json({ message: "Testimonial deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting testimonial" });
    }
  });

  // Contact API endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.status(201).json({ message: "Contact message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error sending contact message" });
    }
  });

  app.get("/api/contact-messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contact messages" });
    }
  });

  app.put("/api/contact-messages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = { isRead: true };
      const message = await storage.updateContactMessage(id, data);
      if (!message) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Error updating contact message" });
    }
  });

  app.delete("/api/contact-messages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContactMessage(id);
      if (!success) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      res.json({ message: "Contact message deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting contact message" });
    }
  });

  // Social links API endpoints
  app.get("/api/social-links", async (req, res) => {
    try {
      const socialLinks = await storage.getSocialLinks();
      res.json(socialLinks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching social links" });
    }
  });

  app.post("/api/social-links", isAdmin, async (req, res) => {
    try {
      const data = insertSocialLinkSchema.parse(req.body);
      const socialLink = await storage.createSocialLink(data);
      res.status(201).json(socialLink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating social link" });
    }
  });

  app.put("/api/social-links/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertSocialLinkSchema.partial().parse(req.body);
      const socialLink = await storage.updateSocialLink(id, data);
      if (!socialLink) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json(socialLink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating social link" });
    }
  });

  app.delete("/api/social-links/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSocialLink(id);
      if (!success) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json({ message: "Social link deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting social link" });
    }
  });

  // Donation API endpoints
  app.post("/api/donations", async (req, res) => {
    try {
      const data = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(data);
      
      // TODO: Implement PayU payment gateway integration here
      // This would create a payment link and redirect user to the payment page
      
      res.status(201).json({
        message: "Donation created successfully",
        donation,
        paymentUrl: `https://pay.example.com/${donation.id}` // Example payment URL
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating donation" });
    }
  });

  app.get("/api/donations", isAdmin, async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donations" });
    }
  });

  app.get("/api/user/donations", isAuthenticated, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const donations = await storage.getUserDonations(req.session.userId);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user donations" });
    }
  });

  // Payment webhook (for PayU)
  app.post("/api/donations/payment-webhook", async (req, res) => {
    try {
      // In a real implementation, this would validate the payment response from PayU
      // and update the donation status accordingly
      
      const { donationId, status, transactionId } = req.body;
      
      if (!donationId || !status) {
        return res.status(400).json({ message: "Invalid webhook data" });
      }
      
      const donation = await storage.getDonation(parseInt(donationId));
      
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      
      const updatedDonation = await storage.updateDonation(donation.id, {
        status,
        paymentId: transactionId
      });
      
      res.json({ message: "Payment status updated" });
    } catch (error) {
      res.status(500).json({ message: "Error processing payment webhook" });
    }
  });

  // Subscription newsletter endpoint
  app.post("/api/subscribe", async (req, res) => {
    try {
      const data = insertSubscriptionSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscription = await storage.getSubscriptionByEmail(data.email);
      
      if (existingSubscription) {
        if (!existingSubscription.isActive) {
          // Reactivate subscription
          await storage.updateSubscription(existingSubscription.id, { isActive: true });
        }
        
        return res.json({ message: "Subscription successful" });
      }
      
      // Create new subscription
      await storage.createSubscription(data);
      res.status(201).json({ message: "Subscription successful" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating subscription" });
    }
  });

  // Current user endpoint
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(200).json(null);
      }
      
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(200).json(null);
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Error fetching current user" });
    }
  });
  
  // User authentication API endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // In a real app, password would be hashed before storing
      const user = await storage.createUser(data);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      req.session.userId = user.id;
      
      res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error registering user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) { // In a real app, password comparison would use a secure method
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      if (!user.isActive) {
        return res.status(403).json({ message: "Account is deactivated" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      req.session.userId = user.id;
      
      res.json({
        message: "Login successful",
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.session.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });

  app.put("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const updateSchema = insertUserSchema.partial().omit({ password: true });
      const data = updateSchema.parse(req.body);
      
      const user = await storage.updateUser(req.session.userId, data);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating user profile" });
    }
  });

  // Admin user management API endpoints
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  app.put("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateSchema = insertUserSchema.partial();
      const data = updateSchema.parse(req.body);
      
      const user = await storage.updateUser(id, data);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating user" });
    }
  });

  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Prevent admin from deleting themselves
      if (id === req.session.userId) {
        return res.status(400).json({ message: "Cannot delete yourself" });
      }
      
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/dashboard-stats", isAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      const donations = await storage.getDonations();
      const contactMessages = await storage.getContactMessages();
      const donationCategories = await storage.getDonationCategories();
      
      // Calculate total donation amount
      const totalDonationAmount = donations.reduce((total, donation) => {
        if (donation.status === "success") {
          return total + donation.amount;
        }
        return total;
      }, 0);
      
      // Calculate pending donation amount
      const pendingDonationAmount = donations.reduce((total, donation) => {
        if (donation.status === "pending") {
          return total + donation.amount;
        }
        return total;
      }, 0);
      
      // Count messages by status
      const unreadMessages = contactMessages.filter(msg => !msg.isRead).length;
      
      // Donation counts by category
      const donationsByCategory = donationCategories.map(category => {
        const count = donations.filter(d => d.categoryId === category.id && d.status === "success").length;
        const amount = donations
          .filter(d => d.categoryId === category.id && d.status === "success")
          .reduce((sum, d) => sum + d.amount, 0);
        
        return {
          id: category.id,
          name: category.name,
          count,
          amount
        };
      });
      
      res.json({
        userCount: users.length,
        donationCount: donations.filter(d => d.status === "success").length,
        pendingDonationCount: donations.filter(d => d.status === "pending").length,
        totalDonationAmount,
        pendingDonationAmount,
        messageCount: contactMessages.length,
        unreadMessageCount: unreadMessages,
        donationsByCategory
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
