var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/services/invoiceService.ts
var invoiceService_exports = {};
__export(invoiceService_exports, {
  generateDonationPDF: () => generateDonationPDF,
  generateInvoiceNumber: () => generateInvoiceNumber,
  sendWhatsAppReceipt: () => sendWhatsAppReceipt
});
import PDFDocument from "pdfkit";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import twilio from "twilio";
async function generateDonationPDF(donation) {
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  await setupPDF(doc, donation);
  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
}
async function setupPDF(doc, donation) {
  doc.fontSize(20).font("Helvetica-Bold").text("DONATION RECEIPT", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).font("Helvetica-Bold").text("ISKCON JUHU", { align: "center" });
  doc.fontSize(12).font("Helvetica").text("Hare Krishna Land, Juhu, Mumbai - 400049", { align: "center" });
  doc.moveDown(2);
  doc.font("Helvetica-Bold").text(`Receipt Number: ${donation.invoiceNumber}`, { align: "right" });
  doc.font("Helvetica").text(`Date: ${donation.date.toLocaleDateString()}`, { align: "right" });
  doc.moveDown(2);
  doc.font("Helvetica-Bold").text("Donation Details", { underline: true });
  doc.moveDown(0.5);
  doc.font("Helvetica").text(`Donor Name: ${donation.name}`);
  if (donation.email) {
    doc.text(`Email: ${donation.email}`);
  }
  if (donation.phone) {
    doc.text(`Phone: ${donation.phone}`);
  }
  doc.moveDown();
  doc.text(`Purpose: ${donation.purpose}`);
  doc.text(`Amount: \u20B9${donation.amount.toFixed(2)}`);
  doc.text(`Payment Method: ${donation.paymentMethod}`);
  doc.text(`Transaction ID: ${donation.txnid}`);
  doc.moveDown(2);
  doc.font("Helvetica-Bold").fillColor("#553c9a").text("Thank You for Your Generous Contribution!", { align: "center" });
  doc.font("Helvetica").fillColor("black").text("Your support helps us serve Krishna and His devotees.", { align: "center" });
  doc.moveDown();
  doc.fontSize(8).text("This is an electronically generated receipt and does not require a signature.", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(8).text("For any queries related to your donation, please contact us at sukadeva.bvks@gmail.com or call +91 88986 16150 (Sukadeva)", { align: "center" });
}
async function sendWhatsAppReceipt(phoneNumber, donationData) {
  try {
    if (!twilioClient) {
      console.warn("Twilio not configured - WhatsApp receipt not sent");
      return false;
    }
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (!formattedPhoneNumber) {
      console.error("Invalid phone number format:", phoneNumber);
      return false;
    }
    const pdfBuffer = await generateDonationPDF(donationData);
    const tempFileName = `donation_receipt_${nanoid()}.pdf`;
    const tempFilePath = path.join("/tmp", tempFileName);
    await fs.writeFile(tempFilePath, pdfBuffer);
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${formattedPhoneNumber}`,
      body: `Hare Krishna, ${donationData.name}! \u{1F64F}

Thank you for your donation of \u20B9${donationData.amount} towards ${donationData.purpose}.

Please find attached your donation receipt.`,
      mediaUrl: [`https://${process.env.REPLIT_DOMAINS?.split(",")[0]}/api/receipts/${tempFileName}`]
    });
    console.log(`Donation receipt sent to WhatsApp number: ${formattedPhoneNumber}`);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp receipt:", error);
    return false;
  }
}
function formatPhoneNumber(phone) {
  const numericPhone = phone.replace(/\D/g, "");
  if (!phone.startsWith("+")) {
    if (numericPhone.length === 10) {
      return `+91${numericPhone}`;
    } else if (numericPhone.length > 10) {
      return `+${numericPhone}`;
    }
  } else {
    return `+${numericPhone}`;
  }
  return null;
}
function generateInvoiceNumber() {
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1e4).toString().padStart(4, "0");
  return `INV-${year}${month}-${random}`;
}
var twilioClient;
var init_invoiceService = __esm({
  "server/services/invoiceService.ts"() {
    "use strict";
    twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;
  }
});

// server/services/notificationService.ts
var notificationService_exports = {};
__export(notificationService_exports, {
  sendFailedPaymentNotification: () => sendFailedPaymentNotification
});
import twilio2 from "twilio";
async function sendFailedPaymentNotification(phoneNumber, donorName, amount, purpose) {
  try {
    if (!twilioClient2) {
      console.warn("Twilio not configured - Failed payment notification not sent");
      return false;
    }
    const formattedPhoneNumber = formatPhoneNumber2(phoneNumber);
    if (!formattedPhoneNumber) {
      console.error("Invalid phone number format:", phoneNumber);
      return false;
    }
    await twilioClient2.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${formattedPhoneNumber}`,
      body: `Hare Krishna, ${donorName}! \u{1F64F}

We noticed there was an issue with your donation payment of \u20B9${amount} towards ${purpose}.

Please try again or contact our support team if you need assistance. You can visit our website at iskconjuhu.in or call us at +91 9876543210.

Thank you for your support.`
    });
    console.log(`Failed payment notification sent to WhatsApp number: ${formattedPhoneNumber}`);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
    return false;
  }
}
function formatPhoneNumber2(phone) {
  const numericPhone = phone.replace(/\D/g, "");
  if (!phone.startsWith("+")) {
    if (numericPhone.length === 10) {
      return `+91${numericPhone}`;
    } else if (numericPhone.length > 10) {
      return `+${numericPhone}`;
    }
  } else {
    return `+${numericPhone}`;
  }
  return null;
}
var twilioClient2;
var init_notificationService = __esm({
  "server/services/notificationService.ts"() {
    "use strict";
    twilioClient2 = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? twilio2(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;
  }
});

// server/services/upiService.ts
var upiService_exports = {};
__export(upiService_exports, {
  generateUpiIntent: () => generateUpiIntent,
  generateUpiQrData: () => generateUpiQrData,
  verifyUpiTransaction: () => verifyUpiTransaction
});
function generateUpiIntent(params) {
  const { upiId, txnid, amount } = params;
  const encodedParams = new URLSearchParams({
    pa: upiId || "iskconjuhu@sbi",
    // Use provided UPI ID or default to ISKCON Juhu UPI
    pn: "ISKCON Juhu",
    // Name of the payee
    tr: txnid,
    // Transaction ID
    am: amount.toString(),
    // Amount
    cu: "INR",
    // Currency
    tn: `Donation to ISKCON Juhu (${txnid})`
    // Transaction note
  }).toString();
  return `upi://pay?${encodedParams}`;
}
async function generateUpiQrData(params) {
  const { txnid, amount, upiId } = params;
  const encodedParams = new URLSearchParams({
    pa: upiId || "iskconjuhu@sbi",
    // Use provided UPI ID or default to ISKCON Juhu UPI
    pn: "ISKCON Juhu",
    tr: txnid,
    am: amount.toString(),
    cu: "INR",
    tn: `Donation to ISKCON Juhu (${txnid})`
  }).toString();
  const upiIntentUrl = `upi://pay?${encodedParams}`;
  try {
    const QRCode = await import("qrcode");
    const qrCodeDataUrl = await QRCode.toDataURL(upiIntentUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#5a189a",
        // QR code color - ISKCON purple
        light: "#ffffff"
        // Background color
      }
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("QR code generation error:", error);
    throw new Error("Failed to generate QR code for UPI payment");
  }
}
async function verifyUpiTransaction(txnid) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    const isSuccess = Math.random() < 0.8;
    if (isSuccess) {
      return {
        success: true,
        status: "success",
        message: "Transaction completed successfully"
      };
    } else {
      return {
        success: false,
        status: "failed",
        message: "Transaction failed or was canceled by the user"
      };
    }
  } catch (error) {
    console.error("UPI verification error:", error);
    return {
      success: false,
      status: "pending",
      message: "Unable to verify transaction status"
    };
  }
}
var init_upiService = __esm({
  "server/services/upiService.ts"() {
    "use strict";
  }
});

// server/index.ts
import "dotenv/config";
import express5 from "express";

// server/routes.ts
import { createServer } from "http";

// server/dbStorage.ts
import { eq, and, desc } from "drizzle-orm";

// server/db.ts
import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bankDetails: () => bankDetails,
  banners: () => banners,
  blogPosts: () => blogPosts,
  categoryBankDetails: () => categoryBankDetails,
  contactMessages: () => contactMessages,
  donationCards: () => donationCards,
  donationCategories: () => donationCategories,
  donations: () => donations,
  eventBankDetails: () => eventBankDetails,
  eventDonationCards: () => eventDonationCards,
  events: () => events,
  footerSettings: () => footerSettings,
  gallery: () => gallery,
  insertBankDetailsSchema: () => insertBankDetailsSchema,
  insertBannerSchema: () => insertBannerSchema,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertCategoryBankDetailsSchema: () => insertCategoryBankDetailsSchema,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertDonationCardSchema: () => insertDonationCardSchema,
  insertDonationCategorySchema: () => insertDonationCategorySchema,
  insertDonationSchema: () => insertDonationSchema,
  insertEventBankDetailsSchema: () => insertEventBankDetailsSchema,
  insertEventDonationCardSchema: () => insertEventDonationCardSchema,
  insertEventSchema: () => insertEventSchema,
  insertFooterSettingsSchema: () => insertFooterSettingsSchema,
  insertGallerySchema: () => insertGallerySchema,
  insertLiveVideoSchema: () => insertLiveVideoSchema,
  insertPoliciesPageSchema: () => insertPoliciesPageSchema,
  insertPolicySchema: () => insertPolicySchema,
  insertProcessSectionSchema: () => insertProcessSectionSchema,
  insertQuoteSchema: () => insertQuoteSchema,
  insertScheduleSchema: () => insertScheduleSchema,
  insertSocialLinkSchema: () => insertSocialLinkSchema,
  insertStatSchema: () => insertStatSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertTestimonialSchema: () => insertTestimonialSchema,
  insertUserSchema: () => insertUserSchema,
  insertVideoSchema: () => insertVideoSchema,
  liveVideos: () => liveVideos,
  policies: () => policies,
  policiesPage: () => policiesPage,
  processSections: () => processSections,
  quotes: () => quotes,
  schedules: () => schedules,
  socialLinks: () => socialLinks,
  stats: () => stats,
  subscriptions: () => subscriptions,
  testimonials: () => testimonials,
  users: () => users,
  videos: () => videos
});
import { pgTable, text, varchar, serial, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  role: text("role").default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isActive: true
});
var banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  mobileImageUrl: text("mobile_image_url"),
  imageAlt: text("image_alt"),
  // SEO alt text for banner image
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").notNull()
});
var insertBannerSchema = createInsertSchema(banners).omit({
  id: true
});
var quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  source: text("source"),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").notNull()
});
var insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true
});
var donationCategories = pgTable("donation_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt"),
  // SEO alt text for category image
  heading: text("heading"),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").notNull(),
  suggestedAmounts: json("suggested_amounts").$type()
});
var insertDonationCategorySchema = createInsertSchema(donationCategories).omit({
  id: true
});
var donationCards = pgTable("donation_cards", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => donationCategories.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").notNull()
});
var insertDonationCardSchema = createInsertSchema(donationCards).omit({
  id: true
});
var bankDetails = pgTable("bank_details", {
  id: serial("id").primaryKey(),
  accountName: text("account_name").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  swiftCode: text("swift_code"),
  qrCodeUrl: text("qr_code_url"),
  isActive: boolean("is_active").default(true).notNull()
});
var insertBankDetailsSchema = createInsertSchema(bankDetails).omit({
  id: true
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url").default("").notNull(),
  imageAlt: text("image_alt"),
  // SEO alt text for event image
  readMoreUrl: text("read_more_url"),
  isActive: boolean("is_active").default(true).notNull(),
  suggestedAmounts: json("suggested_amounts").$type(),
  customDonationEnabled: boolean("custom_donation_enabled").default(true).notNull(),
  customDonationTitle: text("custom_donation_title").default("Any Donation of Your Choice").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  date: z.union([z.string(), z.date()]).transform(
    (val) => typeof val === "string" ? new Date(val) : val
  )
});
var eventDonationCards = pgTable("event_donation_cards", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertEventDonationCardSchema = createInsertSchema(eventDonationCards).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var eventBankDetails = pgTable("event_bank_details", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
  accountName: text("account_name").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  swiftCode: text("swift_code"),
  qrCodeUrl: text("qr_code_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertEventBankDetailsSchema = createInsertSchema(eventBankDetails).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var categoryBankDetails = pgTable("category_bank_details", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => donationCategories.id, { onDelete: "cascade" }).notNull(),
  accountName: text("account_name").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  swiftCode: text("swift_code"),
  qrCodeUrl: text("qr_code_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertCategoryBankDetailsSchema = createInsertSchema(categoryBankDetails).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt"),
  // SEO alt text for gallery image
  order: integer("order").notNull()
});
var insertGallerySchema = createInsertSchema(gallery).omit({
  id: true
});
var videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  thumbnailAlt: text("thumbnail_alt"),
  // SEO alt text for video thumbnail
  youtubeUrl: text("youtube_url").notNull(),
  order: integer("order").notNull()
});
var insertVideoSchema = createInsertSchema(videos).omit({
  id: true
});
var liveVideos = pgTable("live_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertLiveVideoSchema = createInsertSchema(liveVideos).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  message: text("message").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull()
});
var insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true
});
var socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
  createdAt: true
});
var donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  categoryId: integer("category_id").references(() => donationCategories.id),
  eventId: integer("event_id").references(() => events.id),
  amount: integer("amount").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  panCard: text("pan_card"),
  message: text("message"),
  paymentId: text("payment_id"),
  status: text("status").default("pending").notNull(),
  paymentGatewayResponse: text("payment_gateway_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  invoiceNumber: text("invoice_number"),
  receiptSent: boolean("receipt_sent").default(false),
  notificationSent: boolean("notification_sent").default(false)
});
var insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  isActive: true,
  createdAt: true
});
var stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  value: integer("value").notNull(),
  suffix: varchar("suffix", { length: 20 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  time: varchar("time", { length: 10 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertStatSchema = createInsertSchema(stats, {
  value: z.number().min(1),
  suffix: z.string().min(1).max(20),
  label: z.string().min(1).max(255)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertScheduleSchema = createInsertSchema(schedules, {
  time: z.string().min(1).max(10),
  title: z.string().min(1).max(255),
  description: z.string().optional()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt"),
  // SEO alt text for main image
  author: text("author").notNull(),
  readTime: integer("read_time").notNull(),
  // in minutes
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  seoTitle: text("seo_title"),
  // SEO meta title
  seoDescription: text("seo_description"),
  // SEO meta description
  seoKeywords: text("seo_keywords"),
  // SEO keywords
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertBlogPostSchema = createInsertSchema(blogPosts, {
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  imageUrl: z.string().min(1),
  // Allow any non-empty string for relative URLs
  imageAlt: z.string().min(1).max(125).optional(),
  author: z.string().min(1).max(100),
  readTime: z.number().min(1),
  publishedAt: z.union([z.string(), z.date()]).optional().transform((val) => {
    if (typeof val === "string") {
      return new Date(val);
    }
    return val;
  }),
  seoTitle: z.string().min(1).max(60).optional(),
  seoDescription: z.string().min(1).max(160).optional(),
  seoKeywords: z.string().optional()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var processSections = pgTable("process_sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("ISKCON FOOD FOR CHILD"),
  description: text("description"),
  desktopImageUrl: text("desktop_image_url").notNull(),
  mobileImageUrl: text("mobile_image_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertProcessSectionSchema = createInsertSchema(processSections, {
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  desktopImageUrl: z.string().min(1),
  mobileImageUrl: z.string().min(1),
  isActive: z.boolean().optional()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var footerSettings = pgTable("footer_settings", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().default("Hare Krishna Land, Juhu, Mumbai, Maharashtra 400049, India"),
  phone: text("phone").notNull().default("+91 22 2620 0072"),
  email: text("email").notNull().default("info@iskconjuhu.in"),
  templeHours: text("temple_hours").notNull().default("Daily: 4:30 AM - 9:00 PM"),
  templeHoursSpecial: text("temple_hours_special").notNull().default("Special timings during festivals"),
  introDescription: text("intro_description").notNull().default("We'd love to hear from you. Reach out for inquiries, spiritual guidance, or to participate in our services."),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertFooterSettingsSchema = createInsertSchema(footerSettings, {
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  templeHours: z.string().min(1),
  templeHoursSpecial: z.string().min(1),
  introDescription: z.string().min(1)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertPolicySchema = createInsertSchema(policies, {
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1),
  isActive: z.boolean().optional(),
  order: z.number().optional()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var policiesPage = pgTable("policies_page", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Policies of Usage"),
  description: text("description").notNull().default("Please review our policies to understand how we operate and your rights as a user."),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertPoliciesPageSchema = createInsertSchema(policiesPage, {
  title: z.string().min(1).max(255),
  description: z.string().min(1)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
var { Pool } = pkg;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });

// server/dbStorage.ts
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(user) {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  async getUsers() {
    return await db.select().from(users);
  }
  async updateUser(id, userData) {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user;
  }
  async deleteUser(id) {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }
  // Banner operations
  async getBanners() {
    try {
      return await db.select().from(banners);
    } catch (error) {
      console.error("Error in getBanners:", error);
      throw error;
    }
  }
  async getBanner(id) {
    const [banner] = await db.select().from(banners).where(eq(banners.id, id));
    return banner;
  }
  async createBanner(banner) {
    try {
      console.log("Inserting banner:", banner);
      const [newBanner] = await db.insert(banners).values(banner).returning();
      console.log("Banner created:", newBanner);
      return newBanner;
    } catch (error) {
      console.error("Error in createBanner:", error);
      throw error;
    }
  }
  async updateBanner(id, bannerData) {
    const [banner] = await db.update(banners).set(bannerData).where(eq(banners.id, id)).returning();
    return banner;
  }
  async deleteBanner(id) {
    const result = await db.delete(banners).where(eq(banners.id, id));
    return result.rowCount > 0;
  }
  // Quote operations
  async getQuotes() {
    return await db.select().from(quotes);
  }
  async getQuote(id) {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }
  async createQuote(quote) {
    const [newQuote] = await db.insert(quotes).values(quote).returning();
    return newQuote;
  }
  async updateQuote(id, quoteData) {
    const [quote] = await db.update(quotes).set(quoteData).where(eq(quotes.id, id)).returning();
    return quote;
  }
  async deleteQuote(id) {
    const result = await db.delete(quotes).where(eq(quotes.id, id));
    return result.rowCount > 0;
  }
  // Donation category operations
  async getDonationCategories() {
    return await db.select().from(donationCategories);
  }
  async getDonationCategory(id) {
    const [category] = await db.select().from(donationCategories).where(eq(donationCategories.id, id));
    return category;
  }
  async createDonationCategory(category) {
    const [newCategory] = await db.insert(donationCategories).values(category).returning();
    return newCategory;
  }
  async updateDonationCategory(id, categoryData) {
    const [category] = await db.update(donationCategories).set(categoryData).where(eq(donationCategories.id, id)).returning();
    return category;
  }
  async deleteDonationCategory(id) {
    try {
      const existingDonations = await db.select().from(donations).where(eq(donations.categoryId, id));
      if (existingDonations.length > 0) {
        return {
          success: false,
          message: `Cannot delete category with ${existingDonations.length} existing donation(s). Please contact administrator to handle existing donations first.`
        };
      }
      const deletedCards = await db.delete(donationCards).where(eq(donationCards.categoryId, id));
      const deletedCardsCount = deletedCards.rowCount || 0;
      const result = await db.delete(donationCategories).where(eq(donationCategories.id, id));
      return {
        success: result.rowCount > 0,
        deletedCards: deletedCardsCount
      };
    } catch (error) {
      console.error("Error in deleteDonationCategory:", error);
      return {
        success: false,
        message: "Database error occurred while deleting category"
      };
    }
  }
  // Donation card operations
  async getDonationCards() {
    return await db.select().from(donationCards);
  }
  async getDonationCard(id) {
    const [card] = await db.select().from(donationCards).where(eq(donationCards.id, id));
    return card;
  }
  async getDonationCardsByCategory(categoryId) {
    return await db.select().from(donationCards).where(eq(donationCards.categoryId, categoryId)).orderBy(donationCards.order, donationCards.id);
  }
  async createDonationCard(card) {
    const existingCard = await db.select().from(donationCards).where(and(
      eq(donationCards.categoryId, card.categoryId),
      eq(donationCards.title, card.title),
      eq(donationCards.amount, card.amount)
    )).limit(1);
    if (existingCard.length > 0) {
      console.log("Duplicate card detected, updating existing instead of creating new:", existingCard[0]);
      const [updatedCard] = await db.update(donationCards).set({
        description: card.description,
        imageUrl: card.imageUrl,
        isActive: card.isActive,
        order: card.order
      }).where(eq(donationCards.id, existingCard[0].id)).returning();
      return updatedCard;
    }
    console.log("Creating new card:", card);
    const [newCard] = await db.insert(donationCards).values(card).returning();
    return newCard;
  }
  async updateDonationCard(id, cardData) {
    const [card] = await db.update(donationCards).set(cardData).where(eq(donationCards.id, id)).returning();
    return card;
  }
  async deleteDonationCard(id) {
    const result = await db.delete(donationCards).where(eq(donationCards.id, id));
    return result.rowCount > 0;
  }
  // Bank details operations
  async getBankDetails() {
    return await db.select().from(bankDetails);
  }
  async getBankDetail(id) {
    const [detail] = await db.select().from(bankDetails).where(eq(bankDetails.id, id));
    return detail;
  }
  async createBankDetails(details) {
    const [newDetails] = await db.insert(bankDetails).values(details).returning();
    return newDetails;
  }
  async updateBankDetails(id, detailsData) {
    const [details] = await db.update(bankDetails).set(detailsData).where(eq(bankDetails.id, id)).returning();
    return details;
  }
  async deleteBankDetails(id) {
    const result = await db.delete(bankDetails).where(eq(bankDetails.id, id));
    return result.rowCount > 0;
  }
  // Event-specific bank details operations
  async getEventBankDetails(eventId) {
    return await db.select().from(eventBankDetails).where(eq(eventBankDetails.eventId, eventId));
  }
  async getEventBankDetail(id) {
    const [detail] = await db.select().from(eventBankDetails).where(eq(eventBankDetails.id, id));
    return detail;
  }
  async createEventBankDetails(details) {
    const [newDetails] = await db.insert(eventBankDetails).values(details).returning();
    return newDetails;
  }
  async updateEventBankDetails(id, detailsData) {
    const [details] = await db.update(eventBankDetails).set(detailsData).where(eq(eventBankDetails.id, id)).returning();
    return details;
  }
  async deleteEventBankDetails(id) {
    const result = await db.delete(eventBankDetails).where(eq(eventBankDetails.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Category-specific bank details operations
  async getCategoryBankDetails(categoryId) {
    return await db.select().from(categoryBankDetails).where(eq(categoryBankDetails.categoryId, categoryId));
  }
  async getCategoryBankDetail(id) {
    const [detail] = await db.select().from(categoryBankDetails).where(eq(categoryBankDetails.id, id));
    return detail;
  }
  async createCategoryBankDetails(details) {
    const [newDetails] = await db.insert(categoryBankDetails).values(details).returning();
    return newDetails;
  }
  async updateCategoryBankDetails(id, detailsData) {
    const [details] = await db.update(categoryBankDetails).set(detailsData).where(eq(categoryBankDetails.id, id)).returning();
    return details;
  }
  async deleteCategoryBankDetails(id) {
    const result = await db.delete(categoryBankDetails).where(eq(categoryBankDetails.id, id));
    return (result.rowCount || 0) > 0;
  }
  // Event operations
  async getEvents() {
    return await db.select().from(events);
  }
  async getEvent(id) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  async createEvent(event) {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }
  async updateEvent(id, eventData) {
    const [event] = await db.update(events).set(eventData).where(eq(events.id, id)).returning();
    return event;
  }
  async deleteEvent(id) {
    try {
      const existingDonations = await db.select().from(donations).where(eq(donations.eventId, id));
      if (existingDonations.length > 0) {
        return {
          success: false,
          message: `Cannot delete event with ${existingDonations.length} existing donation(s). Please contact administrator to handle existing donations first.`
        };
      }
      await db.delete(eventDonationCards).where(eq(eventDonationCards.eventId, id));
      await db.delete(eventBankDetails).where(eq(eventBankDetails.eventId, id));
      const result = await db.delete(events).where(eq(events.id, id));
      return {
        success: result.rowCount > 0
      };
    } catch (error) {
      console.error("Error deleting event:", error);
      return {
        success: false,
        message: "Database error occurred while deleting event"
      };
    }
  }
  // Event donation card operations
  async getEventDonationCards(eventId) {
    return await db.select().from(eventDonationCards).where(eq(eventDonationCards.eventId, eventId));
  }
  async getEventDonationCard(id) {
    const [card] = await db.select().from(eventDonationCards).where(eq(eventDonationCards.id, id));
    return card;
  }
  async createEventDonationCard(card) {
    const [newCard] = await db.insert(eventDonationCards).values(card).returning();
    return newCard;
  }
  async updateEventDonationCard(id, cardData) {
    const [card] = await db.update(eventDonationCards).set(cardData).where(eq(eventDonationCards.id, id)).returning();
    return card;
  }
  async deleteEventDonationCard(id) {
    const result = await db.delete(eventDonationCards).where(eq(eventDonationCards.id, id));
    return result.rowCount > 0;
  }
  // Gallery operations
  async getGalleryItems() {
    return await db.select().from(gallery);
  }
  async getGalleryItem(id) {
    const [item] = await db.select().from(gallery).where(eq(gallery.id, id));
    return item;
  }
  async createGalleryItem(galleryItem) {
    const [newItem] = await db.insert(gallery).values(galleryItem).returning();
    return newItem;
  }
  async updateGalleryItem(id, galleryData) {
    const [item] = await db.update(gallery).set(galleryData).where(eq(gallery.id, id)).returning();
    return item;
  }
  async deleteGalleryItem(id) {
    const result = await db.delete(gallery).where(eq(gallery.id, id));
    return result.rowCount > 0;
  }
  // Video operations
  async getVideos() {
    return await db.select().from(videos);
  }
  async getVideo(id) {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }
  async createVideo(video) {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }
  async updateVideo(id, videoData) {
    const [video] = await db.update(videos).set(videoData).where(eq(videos.id, id)).returning();
    return video;
  }
  async deleteVideo(id) {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return result.rowCount > 0;
  }
  // Live Video operations
  async getLiveVideos() {
    return await db.select().from(liveVideos);
  }
  async getLiveVideo(id) {
    const [liveVideo] = await db.select().from(liveVideos).where(eq(liveVideos.id, id));
    return liveVideo;
  }
  async createLiveVideo(liveVideo) {
    const [newLiveVideo] = await db.insert(liveVideos).values(liveVideo).returning();
    return newLiveVideo;
  }
  async updateLiveVideo(id, liveVideoData) {
    const [liveVideo] = await db.update(liveVideos).set(liveVideoData).where(eq(liveVideos.id, id)).returning();
    return liveVideo;
  }
  async deleteLiveVideo(id) {
    const result = await db.delete(liveVideos).where(eq(liveVideos.id, id));
    return result.rowCount > 0;
  }
  // Testimonial operations
  async getTestimonials() {
    return await db.select().from(testimonials);
  }
  async getTestimonial(id) {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }
  async createTestimonial(testimonial) {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }
  async updateTestimonial(id, testimonialData) {
    const [testimonial] = await db.update(testimonials).set(testimonialData).where(eq(testimonials.id, id)).returning();
    return testimonial;
  }
  async deleteTestimonial(id) {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return result.rowCount > 0;
  }
  // Contact message operations
  async getContactMessages() {
    return await db.select().from(contactMessages);
  }
  async getContactMessage(id) {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }
  async createContactMessage(message) {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  async updateContactMessage(id, messageData) {
    const [message] = await db.update(contactMessages).set(messageData).where(eq(contactMessages.id, id)).returning();
    return message;
  }
  async markContactMessageAsRead(id) {
    const [message] = await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id)).returning();
    return message;
  }
  async deleteContactMessage(id) {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return result.rowCount > 0;
  }
  // Social link operations
  async getSocialLinks() {
    return await db.select().from(socialLinks);
  }
  async getSocialLink(id) {
    const [link] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
    return link;
  }
  async createSocialLink(link) {
    const [newLink] = await db.insert(socialLinks).values(link).returning();
    return newLink;
  }
  async updateSocialLink(id, linkData) {
    const [link] = await db.update(socialLinks).set(linkData).where(eq(socialLinks.id, id)).returning();
    return link;
  }
  async deleteSocialLink(id) {
    const result = await db.delete(socialLinks).where(eq(socialLinks.id, id));
    return result.rowCount > 0;
  }
  // Donation operations
  async getDonations() {
    return await db.select().from(donations);
  }
  async getAllDonations() {
    return await db.select({
      id: donations.id,
      amount: donations.amount,
      name: donations.name,
      email: donations.email,
      phone: donations.phone,
      address: donations.address,
      panCard: donations.panCard,
      message: donations.message,
      paymentId: donations.paymentId,
      status: donations.status,
      createdAt: donations.createdAt,
      categoryName: donationCategories.name,
      eventTitle: events.title,
      invoiceNumber: donations.invoiceNumber,
      receiptSent: donations.receiptSent,
      notificationSent: donations.notificationSent
    }).from(donations).leftJoin(donationCategories, eq(donations.categoryId, donationCategories.id)).leftJoin(events, eq(donations.eventId, events.id)).orderBy(desc(donations.createdAt));
  }
  async getDonation(id) {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation;
  }
  async getDonationByPaymentId(paymentId) {
    const [donation] = await db.select().from(donations).where(eq(donations.paymentId, paymentId));
    return donation;
  }
  async getUserDonations(userId) {
    return await db.select().from(donations).where(eq(donations.userId, userId));
  }
  async createDonation(donation) {
    const [newDonation] = await db.insert(donations).values(donation).returning();
    return newDonation;
  }
  async updateDonation(id, donationData) {
    const [donation] = await db.update(donations).set(donationData).where(eq(donations.id, id)).returning();
    return donation;
  }
  async deleteDonation(id) {
    const result = await db.delete(donations).where(eq(donations.id, id));
    return result.rowCount > 0;
  }
  async getDonationsByDateRange(fromDate, toDate) {
    return await db.select({
      id: donations.id,
      amount: donations.amount,
      name: donations.name,
      email: donations.email,
      phone: donations.phone,
      address: donations.address,
      panCard: donations.panCard,
      message: donations.message,
      paymentId: donations.paymentId,
      status: donations.status,
      createdAt: donations.createdAt,
      categoryName: donationCategories.name,
      eventTitle: events.title,
      invoiceNumber: donations.invoiceNumber,
      receiptSent: donations.receiptSent,
      notificationSent: donations.notificationSent
    }).from(donations).leftJoin(donationCategories, eq(donations.categoryId, donationCategories.id)).leftJoin(events, eq(donations.eventId, events.id)).where(and(
      donations.createdAt >= fromDate,
      donations.createdAt <= toDate
    )).orderBy(desc(donations.createdAt));
  }
  // Subscription operations
  async getSubscriptions() {
    return await db.select().from(subscriptions);
  }
  async getSubscription(id) {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
  }
  async getSubscriptionByEmail(email) {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.email, email));
    return subscription;
  }
  async createSubscription(subscription) {
    const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
    return newSubscription;
  }
  async updateSubscription(id, subscriptionData) {
    const [subscription] = await db.update(subscriptions).set(subscriptionData).where(eq(subscriptions.id, id)).returning();
    return subscription;
  }
  async deleteSubscription(id) {
    const result = await db.delete(subscriptions).where(eq(subscriptions.id, id));
    return result.rowCount > 0;
  }
  // Stats operations
  async getStats() {
    return await db.select().from(stats);
  }
  async getStat(id) {
    const [stat] = await db.select().from(stats).where(eq(stats.id, id));
    return stat;
  }
  async createStat(stat) {
    const [newStat] = await db.insert(stats).values(stat).returning();
    return newStat;
  }
  async updateStat(id, statData) {
    const [stat] = await db.update(stats).set(statData).where(eq(stats.id, id)).returning();
    return stat;
  }
  async deleteStat(id) {
    const result = await db.delete(stats).where(eq(stats.id, id));
    return result.rowCount > 0;
  }
  // Schedule operations
  async getSchedules() {
    return await db.select().from(schedules);
  }
  async getSchedule(id) {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule;
  }
  async createSchedule(schedule) {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }
  async updateSchedule(id, scheduleData) {
    const [schedule] = await db.update(schedules).set(scheduleData).where(eq(schedules.id, id)).returning();
    return schedule;
  }
  async deleteSchedule(id) {
    const result = await db.delete(schedules).where(eq(schedules.id, id));
    return result.rowCount > 0;
  }
  // Blog post operations
  async getBlogPosts() {
    return await db.select().from(blogPosts);
  }
  async getBlogPost(id) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  async getBlogPostBySlug(slug) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  async createBlogPost(post) {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
  async updateBlogPost(id, postData) {
    const [post] = await db.update(blogPosts).set(postData).where(eq(blogPosts.id, id)).returning();
    return post;
  }
  async deleteBlogPost(id) {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }
  // Process section operations
  async getProcessSection() {
    const [section] = await db.select().from(processSections).limit(1);
    return section;
  }
  async updateProcessSection(sectionData) {
    const existing = await this.getProcessSection();
    if (!existing) {
      const [newSection] = await db.insert(processSections).values(sectionData).returning();
      return newSection;
    }
    const [updated] = await db.update(processSections).set(sectionData).where(eq(processSections.id, existing.id)).returning();
    return updated;
  }
  // Footer settings operations
  async getFooterSettings() {
    const [settings] = await db.select().from(footerSettings).limit(1);
    return settings;
  }
  async updateFooterSettings(settingsData) {
    const existing = await this.getFooterSettings();
    if (!existing) {
      const [newSettings] = await db.insert(footerSettings).values(settingsData).returning();
      return newSettings;
    }
    const [updated] = await db.update(footerSettings).set(settingsData).where(eq(footerSettings.id, existing.id)).returning();
    return updated;
  }
  // Policy operations
  async getPolicies() {
    return await db.select().from(policies).where(eq(policies.isActive, true)).orderBy(policies.order);
  }
  async getPolicy(id) {
    const [policy] = await db.select().from(policies).where(eq(policies.id, id));
    return policy;
  }
  async getPolicyBySlug(slug) {
    const [policy] = await db.select().from(policies).where(eq(policies.slug, slug));
    return policy;
  }
  async createPolicy(policy) {
    const [newPolicy] = await db.insert(policies).values(policy).returning();
    return newPolicy;
  }
  async updatePolicy(id, policyData) {
    const [policy] = await db.update(policies).set(policyData).where(eq(policies.id, id)).returning();
    return policy;
  }
  async deletePolicy(id) {
    const result = await db.delete(policies).where(eq(policies.id, id));
    return result.rowCount > 0;
  }
  async getAllPolicies() {
    return await db.select().from(policies).orderBy(policies.order);
  }
  // Policies Page Settings operations
  async getPoliciesPage() {
    const [page] = await db.select().from(policiesPage).limit(1);
    return page;
  }
  async updatePoliciesPage(pageData) {
    const existing = await this.getPoliciesPage();
    if (!existing) {
      const [newPage] = await db.insert(policiesPage).values(pageData).returning();
      return newPage;
    }
    const [updated] = await db.update(policiesPage).set(pageData).where(eq(policiesPage.id, existing.id)).returning();
    return updated;
  }
};

// server/storage.ts
var storage = new DatabaseStorage();

// server/routes/payment.ts
import express from "express";

// server/services/payuService.ts
import crypto from "crypto-js";

// server/paymentConfig.ts
var PAYMENT_CONFIG = {
  // PayU Live Production Configuration
  PAYU: {
    MODE: "LIVE",
    BASE_URL: "https://secure.payu.in",
    PAYMENT_URL: "https://secure.payu.in/_payment",
    VERIFY_URL: "https://secure.payu.in/merchant/postservice.php?form=2",
    MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY,
    MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT
  },
  // UPI Production Configuration
  UPI: {
    MODE: "LIVE",
    MERCHANT_ID: "iskconjuhu@sbi",
    MERCHANT_NAME: "ISKCON Juhu",
    CURRENCY: "INR"
  },
  // Notification Configuration
  NOTIFICATIONS: {
    WHATSAPP_ENABLED: true,
    EMAIL_ENABLED: false,
    // Can be enabled if SENDGRID is configured
    SMS_ENABLED: false
  },
  // Transaction Configuration
  TRANSACTION: {
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 5e5,
    // 5 Lakh limit for online donations
    CURRENCY: "INR",
    TIMEOUT: 900
    // 15 minutes
  },
  // Receipt Configuration
  RECEIPT: {
    AUTO_GENERATE: true,
    FORMAT: "PDF",
    TEMPLATE: "ISKCON_DONATION"
  }
};
function validatePaymentConfig() {
  const errors = [];
  if (!PAYMENT_CONFIG.PAYU.MERCHANT_KEY) {
    errors.push("PAYU_MERCHANT_KEY is required for live payments");
  }
  if (!PAYMENT_CONFIG.PAYU.MERCHANT_SALT) {
    errors.push("PAYU_MERCHANT_SALT is required for live payments");
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

// server/services/payuService.ts
var payuConfig = {
  merchantKey: PAYMENT_CONFIG.PAYU.MERCHANT_KEY,
  merchantSalt: PAYMENT_CONFIG.PAYU.MERCHANT_SALT,
  baseURL: PAYMENT_CONFIG.PAYU.BASE_URL,
  paymentURL: PAYMENT_CONFIG.PAYU.PAYMENT_URL,
  verifyURL: PAYMENT_CONFIG.PAYU.VERIFY_URL,
  mode: PAYMENT_CONFIG.PAYU.MODE
};
function generateHash(paymentData) {
  if (!payuConfig.merchantKey || !payuConfig.merchantSalt) {
    throw new Error("PayU merchant key or salt is missing");
  }
  const hashString = `${payuConfig.merchantKey}|${paymentData.txnid}|${paymentData.amount}|${paymentData.productinfo}|${paymentData.firstname}|${paymentData.email}|${paymentData.udf1 || ""}|${paymentData.udf2 || ""}|${paymentData.udf3 || ""}|${paymentData.udf4 || ""}|${paymentData.udf5 || ""}||||||${payuConfig.merchantSalt}`;
  console.log("PayU Hash String:", hashString);
  const hash = crypto.SHA512(hashString).toString();
  console.log("PayU Generated Hash:", hash);
  return hash;
}
function getPaymentFormData(paymentRequest) {
  if (!payuConfig.merchantKey) {
    throw new Error("PayU merchant key is missing");
  }
  const hash = generateHash(paymentRequest);
  const formData = {
    key: payuConfig.merchantKey,
    txnid: paymentRequest.txnid,
    amount: paymentRequest.amount.toString(),
    productinfo: paymentRequest.productinfo,
    firstname: paymentRequest.firstname,
    email: paymentRequest.email,
    phone: paymentRequest.phone,
    surl: paymentRequest.surl,
    furl: paymentRequest.furl,
    hash,
    // Optional parameters
    ...paymentRequest.lastname && { lastname: paymentRequest.lastname },
    ...paymentRequest.address1 && { address1: paymentRequest.address1 },
    ...paymentRequest.address2 && { address2: paymentRequest.address2 },
    ...paymentRequest.city && { city: paymentRequest.city },
    ...paymentRequest.state && { state: paymentRequest.state },
    ...paymentRequest.country && { country: paymentRequest.country },
    ...paymentRequest.zipcode && { zipcode: paymentRequest.zipcode },
    ...paymentRequest.udf1 && { udf1: paymentRequest.udf1 },
    ...paymentRequest.udf2 && { udf2: paymentRequest.udf2 },
    ...paymentRequest.udf3 && { udf3: paymentRequest.udf3 },
    ...paymentRequest.udf4 && { udf4: paymentRequest.udf4 },
    ...paymentRequest.udf5 && { udf5: paymentRequest.udf5 }
  };
  return {
    formUrl: payuConfig.paymentURL,
    formData
  };
}

// server/routes/payment.ts
import { nanoid as nanoid2 } from "nanoid";

// server/services/receiptService.ts
import PDFKit from "pdfkit";
import nodemailer from "nodemailer";
var createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    // or your email service
    auth: {
      user: process.env.EMAIL_USER || "sukadeva.bvks@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "your-app-password"
    }
  });
};
async function generatePDFReceipt(receiptData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFKit({ size: "A4", margin: 50 });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
      doc.fontSize(20).fillColor("#FF6B35").text("ISKCON JUHU", 50, 50, { align: "center" }).fontSize(14).fillColor("#000").text("International Society for Krishna Consciousness", 50, 80, { align: "center" }).text("Hare Krishna Land, Juhu, Mumbai - 400049", 50, 100, { align: "center" }).text("Phone: +91 88986 16150 (Sukadeva) | Email: sukadeva.bvks@gmail.com", 50, 120, { align: "center" });
      doc.fontSize(18).fillColor("#FF6B35").text("DONATION RECEIPT", 50, 160, { align: "center" }).fontSize(12).fillColor("#000").text("(Eligible for Tax Deduction under Section 80G)", 50, 185, { align: "center" });
      doc.rect(50, 210, 495, 200).stroke().fontSize(12);
      const startY = 230;
      const lineHeight = 25;
      let currentY = startY;
      const addReceiptLine = (label, value) => {
        doc.text(label + ":", 70, currentY, { width: 150 }).text(value, 250, currentY, { width: 250 });
        currentY += lineHeight;
      };
      addReceiptLine("Receipt No", receiptData.invoiceNumber);
      addReceiptLine("Transaction ID", receiptData.txnid);
      addReceiptLine("Date", receiptData.date.toLocaleDateString("en-IN"));
      addReceiptLine("Donor Name", receiptData.name);
      addReceiptLine("Email", receiptData.email);
      addReceiptLine("Phone", receiptData.phone);
      if (receiptData.panCard) {
        addReceiptLine("PAN Card", receiptData.panCard);
      }
      doc.fontSize(14).fillColor("#FF6B35").text("Donation Purpose:", 70, currentY, { width: 150 }).fillColor("#000").text(receiptData.purpose, 250, currentY, { width: 250 });
      currentY += lineHeight;
      doc.fontSize(14).fillColor("#FF6B35").text("Amount: \u20B9" + receiptData.amount.toLocaleString("en-IN"), 70, currentY, { width: 400 });
      currentY += 50;
      doc.fontSize(10).fillColor("#000").text("This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.", 50, currentY, { width: 495, align: "center" }).text("Please retain this receipt for your tax filing purposes.", 50, currentY + 20, { width: 495, align: "center" });
      doc.fontSize(8).fillColor("#666").text("This is a computer-generated receipt and does not require a signature.", 50, 720, { width: 495, align: "center" }).text("Generated on: " + (/* @__PURE__ */ new Date()).toLocaleString("en-IN"), 50, 735, { width: 495, align: "center" });
      doc.fontSize(12).fillColor("#FF6B35").text("\u{1F64F} Thank you for your generous contribution to ISKCON Juhu", 50, 600, { width: 495, align: "center" }).fontSize(10).fillColor("#000").text("May Lord Krishna bless you abundantly for your devotion and generosity.", 50, 625, { width: 495, align: "center" });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
async function sendReceiptEmail(receiptData, pdfBuffer) {
  try {
    const transporter = createEmailTransporter();
    const mailOptions = {
      from: "ISKCON Juhu <sukadeva.bvks@gmail.com>",
      to: receiptData.email,
      subject: `Donation Receipt - ${receiptData.invoiceNumber} | ISKCON Juhu`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF6B35, #F7931E); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">\u{1F64F} ISKCON JUHU</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Hare Krishna Land, Mumbai</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #FF6B35; margin-bottom: 20px;">Thank You for Your Donation!</h2>
            
            <p>Dear ${receiptData.name},</p>
            
            <p>We are deeply grateful for your generous contribution of <strong>\u20B9${receiptData.amount.toLocaleString("en-IN")}</strong> to ISKCON Juhu.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #FF6B35; margin-top: 0;">Donation Details:</h3>
              <p><strong>Receipt No:</strong> ${receiptData.invoiceNumber}</p>
              <p><strong>Transaction ID:</strong> ${receiptData.txnid}</p>
              <p><strong>Date:</strong> ${receiptData.date.toLocaleDateString("en-IN")}</p>
              <p><strong>Purpose:</strong> ${receiptData.purpose}</p>
              <p><strong>Amount:</strong> \u20B9${receiptData.amount.toLocaleString("en-IN")}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2;"><strong>\u{1F4CB} Tax Benefit Information:</strong></p>
              <p style="margin: 10px 0 0; font-size: 14px;">This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961. Please retain the attached receipt for your tax filing purposes.</p>
            </div>
            
            <p>Your contribution helps us continue our spiritual and community service. May Lord Krishna bless you abundantly for your devotion and generosity.</p>
            
            <p style="margin-top: 30px;">
              With gratitude,<br>
              <strong>ISKCON Juhu Team</strong>
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">ISKCON Juhu | Hare Krishna Land, Juhu, Mumbai - 400049</p>
            <p style="margin: 5px 0 0;">Phone: +91 88986 16150 (Sukadeva) | Email: sukadeva.bvks@gmail.com</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `ISKCON_Receipt_${receiptData.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending receipt email:", error);
    return false;
  }
}

// server/routes/payment.ts
var router = express.Router();
router.post("/initiate", async (req, res) => {
  try {
    console.log("=== Payment Initiation Request ===");
    const {
      amount,
      name,
      email,
      phone,
      message,
      categoryId,
      eventId,
      panCard,
      paymentMethod = "netbanking"
      // Default payment method
    } = req.body;
    console.log(`Initiating payment for: ${name} (${email}), Amount: \u20B9${amount}`);
    if (!amount || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment fields"
      });
    }
    const txnid = `ISKCON_${nanoid2(8)}`;
    console.log(`Generated transaction ID: ${txnid}`);
    const isLocalhost = req.headers.host?.includes("localhost") || req.headers.host?.includes("127.0.0.1");
    const protocol = req.headers["x-forwarded-proto"] || (isLocalhost ? "http" : "https");
    const host = req.headers.host || req.hostname;
    const baseUrl = `${protocol}://${host}`;
    const surl = `${baseUrl}/api/payments/success`;
    const furl = `${baseUrl}/api/payments/failure`;
    const categoryName = categoryId ? "Temple Donation" : "General Donation";
    const productinfo = `Donation for ISKCON Juhu - ${categoryName}`;
    const paymentRequest = {
      txnid,
      amount: Number(amount),
      productinfo,
      firstname: name,
      email,
      phone,
      surl,
      furl,
      // Include UPI specific fields if UPI payment method is selected
      ...paymentMethod === "upi" && {
        udf1: "upi",
        // Use UDF fields to pass payment method info
        pg: "UPI"
        // Payment gateway - UPI
      }
    };
    const { formUrl, formData } = getPaymentFormData(paymentRequest);
    console.log("Creating donation record in database with status: pending");
    const donation = await storage.createDonation({
      email,
      name,
      phone,
      amount: Number(amount),
      message: message || null,
      status: "pending",
      categoryId: categoryId ? Number(categoryId) : null,
      eventId: eventId ? Number(eventId) : null,
      panCard: panCard || null,
      userId: req.user?.id || null,
      paymentId: txnid
    });
    console.log(`\u2713 Donation record created with ID: ${donation.id}`);
    console.log(`Payment gateway URL: ${formUrl}`);
    console.log(`Success callback URL: ${surl}`);
    console.log(`Failure callback URL: ${furl}`);
    console.log("=== Payment Initiation Complete ===\n");
    res.json({
      success: true,
      txnid,
      payuUrl: formUrl,
      paymentData: formData,
      // Include UPI data if UPI is selected
      ...paymentMethod === "upi" && {
        upiData: {
          payeeVpa: "iskconjuhu@sbi",
          // ISKCON Juhu UPI ID
          payeeName: "ISKCON Juhu",
          amount: Number(amount),
          transactionId: txnid,
          transactionNote: productinfo
        }
      }
    });
  } catch (error) {
    console.error("=== Payment Initiation ERROR ===");
    console.error("Error details:", error);
    console.error("=== END ERROR ===\n");
    res.status(500).json({
      success: false,
      message: "Payment initialization failed"
    });
  }
});
router.post("/success", async (req, res) => {
  try {
    const paymentResponse = req.body;
    console.log("=== PayU SUCCESS Callback Received ===");
    console.log("Payment Response:", JSON.stringify(paymentResponse, null, 2));
    const { generateInvoiceNumber: generateInvoiceNumber2, sendWhatsAppReceipt: sendWhatsAppReceipt2 } = await Promise.resolve().then(() => (init_invoiceService(), invoiceService_exports));
    let purpose = "ISKCON Juhu Donation";
    if (paymentResponse && paymentResponse.txnid) {
      console.log(`Looking up donation with payment ID: ${paymentResponse.txnid}`);
      const donation = await storage.getDonationByPaymentId(paymentResponse.txnid);
      console.log("Found donation:", donation ? `ID=${donation.id}, Status=${donation.status}` : "NOT FOUND");
      if (donation) {
        const invoiceNumber = generateInvoiceNumber2();
        console.log(`Generated invoice number: ${invoiceNumber}`);
        console.log(`Updating donation ${donation.id} to 'completed' status...`);
        await storage.updateDonation(donation.id, {
          status: "completed",
          // Keep original paymentId (txnid) - don't overwrite with mihpayid
          invoiceNumber
        });
        console.log("\u2713 Donation status updated successfully");
        if (donation.categoryId) {
          const category = await storage.getDonationCategory(donation.categoryId);
          if (category) {
            purpose = category.name;
          }
        } else if (donation.eventId) {
          const event = await storage.getEvent(donation.eventId);
          if (event) {
            purpose = event.title;
          }
        }
        const receiptData = {
          txnid: donation.paymentId || paymentResponse.txnid,
          amount: donation.amount,
          name: donation.name,
          email: donation.email,
          phone: donation.phone,
          purpose,
          invoiceNumber,
          date: donation.createdAt || /* @__PURE__ */ new Date(),
          panCard: donation.panCard || void 0
        };
        try {
          const pdfBuffer = await generatePDFReceipt(receiptData);
          const emailSent = await sendReceiptEmail(receiptData, pdfBuffer);
          if (emailSent) {
            console.log(`PDF receipt sent to ${donation.email}`);
          }
        } catch (receiptError) {
          console.error("Error sending PDF receipt:", receiptError);
        }
        if (donation.phone && !donation.receiptSent) {
          try {
            const { sendWhatsAppReceipt: sendWhatsAppReceipt3 } = await Promise.resolve().then(() => (init_invoiceService(), invoiceService_exports));
            await sendWhatsAppReceipt3(donation.phone, {
              txnid: donation.paymentId || paymentResponse.txnid,
              amount: donation.amount,
              name: donation.name,
              email: donation.email,
              phone: donation.phone,
              date: donation.createdAt,
              paymentMethod: "Online Payment",
              purpose,
              invoiceNumber
            });
            await storage.updateDonation(donation.id, {
              receiptSent: true
            });
            console.log(`WhatsApp receipt sent to ${donation.phone}`);
          } catch (receiptError) {
            console.error("Error sending WhatsApp receipt:", receiptError);
          }
        }
      }
    }
    const params = new URLSearchParams({
      txnid: paymentResponse.txnid || "",
      amount: paymentResponse.amount || "",
      firstname: paymentResponse.firstname || "",
      email: paymentResponse.email || "",
      status: "success",
      purpose,
      categoryName: purpose
    });
    const redirectUrl = `/payment/success?${params.toString()}`;
    console.log(`Redirecting to: ${redirectUrl}`);
    console.log("=== PayU SUCCESS Callback Complete ===\n");
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("=== PayU SUCCESS Callback ERROR ===");
    console.error("Error details:", error);
    console.error("=== END ERROR ===\n");
    const errorParams = new URLSearchParams({
      error: "payment_failed"
    });
    res.redirect(`/payment/failure?${errorParams.toString()}`);
  }
});
router.post("/failure", async (req, res) => {
  try {
    const paymentResponse = req.body;
    const { sendFailedPaymentNotification: sendFailedPaymentNotification2 } = await Promise.resolve().then(() => (init_notificationService(), notificationService_exports));
    if (paymentResponse && paymentResponse.txnid) {
      const donation = await storage.getDonationByPaymentId(paymentResponse.txnid);
      if (donation) {
        await storage.updateDonation(donation.id, {
          status: "failed"
        });
        let purpose = "ISKCON Juhu Donation";
        if (donation.categoryId) {
          const category = await storage.getDonationCategory(donation.categoryId);
          if (category) {
            purpose = category.name;
          }
        } else if (donation.eventId) {
          const event = await storage.getEvent(donation.eventId);
          if (event) {
            purpose = event.title;
          }
        }
        if (donation.phone && !donation.notificationSent) {
          try {
            await sendFailedPaymentNotification2(
              donation.phone,
              donation.name,
              donation.amount,
              purpose
            );
            await storage.updateDonation(donation.id, {
              notificationSent: true
            });
            console.log(`Failed payment notification sent to ${donation.phone}`);
          } catch (notifyError) {
            console.error("Error sending payment failure notification:", notifyError);
          }
        }
      }
    }
    const params = new URLSearchParams({
      txnid: paymentResponse.txnid || "",
      amount: paymentResponse.amount || "",
      firstname: paymentResponse.firstname || "",
      email: paymentResponse.email || "",
      status: "failure",
      error: paymentResponse.error_Message || "Payment failed"
    });
    res.redirect(`/donate/payment-failed?${params.toString()}`);
  } catch (error) {
    console.error("PayU failure callback error:", error);
    res.redirect("/donate/payment-failed");
  }
});
router.post("/upi-intent", async (req, res) => {
  try {
    const upiId = "iskconjuhu@sbi";
    const { txnid, amount } = req.body;
    if (!txnid || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required UPI fields"
      });
    }
    const { generateUpiIntent: generateUpiIntent2, generateUpiQrData: generateUpiQrData2 } = await Promise.resolve().then(() => (init_upiService(), upiService_exports));
    const upiParams = { upiId, txnid, amount };
    const upiIntent = generateUpiIntent2(upiParams);
    const qrCodeData = await generateUpiQrData2(upiParams);
    const donation = await storage.getDonationByPaymentId(txnid);
    if (donation) {
      await storage.updateDonation(donation.id, {
        status: "pending_upi"
        // Special status for UPI payments in progress
      });
    }
    res.json({
      success: true,
      upiIntent,
      qrCodeData,
      txnid,
      payeeVpa: upiId,
      payeeName: "ISKCON Juhu"
    });
  } catch (error) {
    console.error("UPI intent error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create UPI payment intent"
    });
  }
});
router.post("/verify-upi", async (req, res) => {
  try {
    const { txnid } = req.body;
    if (!txnid) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }
    const { verifyUpiTransaction: verifyUpiTransaction2 } = await Promise.resolve().then(() => (init_upiService(), upiService_exports));
    const { sendFailedPaymentNotification: sendFailedPaymentNotification2 } = await Promise.resolve().then(() => (init_notificationService(), notificationService_exports));
    const { generateInvoiceNumber: generateInvoiceNumber2, sendWhatsAppReceipt: sendWhatsAppReceipt2 } = await Promise.resolve().then(() => (init_invoiceService(), invoiceService_exports));
    const donation = await storage.getDonationByPaymentId(txnid);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation record not found"
      });
    }
    let purpose = "ISKCON Juhu Donation";
    if (donation.categoryId) {
      const category = await storage.getDonationCategory(donation.categoryId);
      if (category) {
        purpose = category.name;
      }
    } else if (donation.eventId) {
      const event = await storage.getEvent(donation.eventId);
      if (event) {
        purpose = event.title;
      }
    }
    const verificationResult = await verifyUpiTransaction2(txnid);
    if (verificationResult.success) {
      const invoiceNumber = generateInvoiceNumber2();
      await storage.updateDonation(donation.id, {
        status: "completed_upi",
        invoiceNumber
      });
      if (donation.phone && !donation.receiptSent) {
        try {
          const receiptData = {
            txnid: donation.paymentId || txnid,
            amount: donation.amount,
            name: donation.name,
            email: donation.email,
            phone: donation.phone,
            date: donation.createdAt,
            paymentMethod: "UPI",
            purpose,
            invoiceNumber
          };
          await sendWhatsAppReceipt2(donation.phone, receiptData);
          await storage.updateDonation(donation.id, {
            receiptSent: true
          });
          console.log(`UPI payment receipt sent to ${donation.phone}`);
        } catch (receiptError) {
          console.error("Error sending UPI payment receipt:", receiptError);
        }
      }
      return res.json({
        success: true,
        status: "success",
        message: "Payment verified successfully",
        donation: {
          id: donation.id,
          amount: donation.amount,
          name: donation.name,
          email: donation.email
        }
      });
    } else {
      const newStatus = verificationResult.status === "pending" ? "pending" : "failed_upi";
      await storage.updateDonation(donation.id, {
        status: newStatus
      });
      if (newStatus === "failed_upi" && donation.phone && !donation.notificationSent) {
        try {
          await sendFailedPaymentNotification2(
            donation.phone,
            donation.name,
            donation.amount,
            purpose
          );
          await storage.updateDonation(donation.id, {
            notificationSent: true
          });
          console.log(`UPI failed payment notification sent to ${donation.phone}`);
        } catch (notifyError) {
          console.error("Error sending UPI payment failure notification:", notifyError);
        }
      }
      return res.json({
        success: false,
        status: verificationResult.status,
        message: verificationResult.message
      });
    }
  } catch (error) {
    console.error("UPI verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify UPI payment"
    });
  }
});
router.get("/receipt/:txnid", async (req, res) => {
  try {
    const { txnid } = req.params;
    const donation = await storage.getDonationByPaymentId(txnid);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    let purpose = "ISKCON Juhu Donation";
    if (donation.categoryId) {
      const category = await storage.getDonationCategory(donation.categoryId);
      if (category) {
        purpose = category.name;
      }
    } else if (donation.eventId) {
      const event = await storage.getEvent(donation.eventId);
      if (event) {
        purpose = event.title;
      }
    }
    const receiptData = {
      txnid: donation.paymentId || txnid,
      amount: donation.amount,
      name: donation.name,
      email: donation.email,
      phone: donation.phone,
      purpose,
      invoiceNumber: donation.invoiceNumber || `INV-${txnid}`,
      date: donation.createdAt || /* @__PURE__ */ new Date(),
      panCard: donation.panCard || void 0
    };
    const pdfBuffer = await generatePDFReceipt(receiptData);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=ISKCON_Receipt_${receiptData.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating receipt PDF:", error);
    res.status(500).json({ error: "Failed to generate receipt" });
  }
});
router.post("/send-receipt", async (req, res) => {
  try {
    const { txnid } = req.body;
    const donation = await storage.getDonationByPaymentId(txnid);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    let purpose = "ISKCON Juhu Donation";
    if (donation.categoryId) {
      const category = await storage.getDonationCategory(donation.categoryId);
      if (category) {
        purpose = category.name;
      }
    } else if (donation.eventId) {
      const event = await storage.getEvent(donation.eventId);
      if (event) {
        purpose = event.title;
      }
    }
    const receiptData = {
      txnid: donation.paymentId || txnid,
      amount: donation.amount,
      name: donation.name,
      email: donation.email,
      phone: donation.phone,
      purpose,
      invoiceNumber: donation.invoiceNumber || `INV-${txnid}`,
      date: donation.createdAt || /* @__PURE__ */ new Date(),
      panCard: donation.panCard || void 0
    };
    const pdfBuffer = await generatePDFReceipt(receiptData);
    const emailSent = await sendReceiptEmail(receiptData, pdfBuffer);
    if (emailSent) {
      res.json({ success: true, message: "Receipt sent successfully" });
    } else {
      res.status(500).json({ error: "Failed to send receipt email" });
    }
  } catch (error) {
    console.error("Error sending receipt:", error);
    res.status(500).json({ error: "Failed to send receipt" });
  }
});
var payment_default = router;

// server/routes/receipt.ts
init_invoiceService();
import express2 from "express";
import { promises as fs2 } from "fs";
import path2 from "path";
var router2 = express2.Router();
var TEMP_DIR = "/tmp";
router2.post("/send-whatsapp", async (req, res) => {
  try {
    const { donationId } = req.body;
    if (!donationId) {
      return res.status(400).json({
        success: false,
        message: "Donation ID is required"
      });
    }
    const donation = await storage.getDonation(Number(donationId));
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });
    }
    let purpose = "ISKCON Juhu Donation";
    if (donation.categoryId) {
      const category = await storage.getDonationCategory(donation.categoryId);
      if (category) {
        purpose = category.name;
      }
    } else if (donation.eventId) {
      const event = await storage.getEvent(donation.eventId);
      if (event) {
        purpose = event.title;
      }
    }
    if (!donation.phone) {
      return res.status(400).json({
        success: false,
        message: "Donor phone number is required for WhatsApp receipt"
      });
    }
    const invoiceNumber = generateInvoiceNumber();
    const receiptData = {
      txnid: donation.paymentId || "N/A",
      amount: donation.amount,
      name: donation.name,
      email: donation.email,
      phone: donation.phone,
      date: donation.createdAt,
      paymentMethod: donation.status.includes("upi") ? "UPI" : "Online Payment",
      purpose,
      invoiceNumber
    };
    const sent = await sendWhatsAppReceipt(donation.phone, receiptData);
    if (sent) {
      await storage.updateDonation(donation.id, {
        receiptSent: true,
        invoiceNumber
      });
      res.json({
        success: true,
        message: "Receipt sent successfully via WhatsApp"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send receipt via WhatsApp"
      });
    }
  } catch (error) {
    console.error("Error sending receipt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send receipt"
    });
  }
});
router2.get("/download/:donationId", async (req, res) => {
  try {
    const { donationId } = req.params;
    const donation = await storage.getDonation(Number(donationId));
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found"
      });
    }
    let purpose = "ISKCON Juhu Donation";
    if (donation.categoryId) {
      const category = await storage.getDonationCategory(donation.categoryId);
      if (category) {
        purpose = category.name;
      }
    } else if (donation.eventId) {
      const event = await storage.getEvent(donation.eventId);
      if (event) {
        purpose = event.title;
      }
    }
    const invoiceNumber = donation.invoiceNumber || generateInvoiceNumber();
    const receiptData = {
      txnid: donation.paymentId || "N/A",
      amount: donation.amount,
      name: donation.name,
      email: donation.email,
      phone: donation.phone,
      date: donation.createdAt,
      paymentMethod: donation.status.includes("upi") ? "UPI" : "Online Payment",
      purpose,
      invoiceNumber
    };
    const pdfBuffer = await generateDonationPDF(receiptData);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="donation_receipt_${donationId}.pdf"`);
    res.send(pdfBuffer);
    if (!donation.invoiceNumber) {
      await storage.updateDonation(donation.id, {
        invoiceNumber
      });
    }
  } catch (error) {
    console.error("Error generating receipt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate receipt"
    });
  }
});
router2.get("/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    if (!/^[a-zA-Z0-9_-]+\.pdf$/.test(filename)) {
      return res.status(400).send("Invalid filename");
    }
    const filePath = path2.join(TEMP_DIR, filename);
    try {
      await fs2.access(filePath);
    } catch (error) {
      return res.status(404).send("File not found");
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    const fileBuffer = await fs2.readFile(filePath);
    res.send(fileBuffer);
    setTimeout(async () => {
      try {
        await fs2.unlink(filePath);
        console.log(`Cleaned up temporary receipt file: ${filename}`);
      } catch (error) {
        console.error(`Error cleaning up file ${filename}:`, error);
      }
    }, 5 * 60 * 1e3);
  } catch (error) {
    console.error("Error serving receipt file:", error);
    res.status(500).send("Error serving file");
  }
});
var receipt_default = router2;

// server/routes.ts
import multer from "multer";
import path3 from "path";
import fs3 from "fs";
import express3 from "express";
import session from "express-session";
import jwt from "jsonwebtoken";
import { z as z2 } from "zod";
import { createRequire } from "module";
var require2 = createRequire(import.meta.url);
var JWT_SECRET = process.env.JWT_SECRET || "iskcon_juhu_jwt_secret";
var isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
var isAdmin = async (req, res, next) => {
  next();
};
async function registerRoutes(app2) {
  app2.use("/uploads", (req, res, next) => {
    res.set("Cache-Control", "public, max-age=2592000");
    res.set("ETag", `"${Date.now()}"`);
    next();
  });
  const MemoryStore = require2("memorystore")(session);
  app2.use(
    session({
      secret: process.env.SESSION_SECRET || "iskcon_juhu_secret",
      store: new MemoryStore({
        checkPeriod: 864e5
        // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 864e5,
        // 1 day
        httpOnly: true,
        secure: false,
        // Set to true in production with HTTPS
        sameSite: "lax"
      }
    })
  );
  app2.use((req, res, next) => {
    console.log("Session middleware check:", {
      sessionId: req.sessionID,
      userId: req.session?.userId,
      sessionExists: !!req.session
    });
    next();
  });
  const uploadsDir = path3.join(process.cwd(), "uploads");
  const bannersDir = path3.join(uploadsDir, "banners");
  const cardsDir = path3.join(uploadsDir, "cards");
  const qrCodesDir = path3.join(uploadsDir, "qr-codes");
  const galleryDir = path3.join(uploadsDir, "gallery");
  const videosDir = path3.join(uploadsDir, "videos");
  const blogDir = path3.join(uploadsDir, "blog");
  const socialIconsDir = path3.join(uploadsDir, "social-icons");
  [uploadsDir, bannersDir, cardsDir, qrCodesDir, galleryDir, videosDir, blogDir, socialIconsDir].forEach((dir) => {
    if (!fs3.existsSync(dir)) {
      fs3.mkdirSync(dir, { recursive: true });
    }
  });
  const storage_multer = multer.diskStorage({
    destination: function(req, file, cb) {
      const type = req.body.type || "banner";
      let destDir = bannersDir;
      if (type === "card") {
        destDir = cardsDir;
      } else if (type === "qr") {
        destDir = qrCodesDir;
      } else if (type === "gallery") {
        destDir = galleryDir;
      } else if (type === "video") {
        destDir = videosDir;
      } else if (type === "blog") {
        destDir = blogDir;
      } else if (type === "social-icon") {
        destDir = socialIconsDir;
      }
      console.log("Upload destination for type", type, ":", destDir);
      cb(null, destDir);
    },
    filename: function(req, file, cb) {
      const type = req.body.type || "banner";
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = type + "-" + uniqueSuffix + path3.extname(file.originalname);
      console.log("Generated filename for type", type, ":", filename);
      cb(null, filename);
    }
  });
  const upload = multer({
    storage: storage_multer,
    limits: {
      fileSize: 1 * 1024 * 1024
      // 1MB limit
    },
    fileFilter: function(req, file, cb) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"));
      }
    }
  });
  app2.use("/uploads/banners", express3.static(bannersDir, {
    setHeaders: (res, path6) => {
      if (path6.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
    }
  }));
  app2.use("/uploads/cards", express3.static(cardsDir, {
    setHeaders: (res, path6) => {
      if (path6.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
    }
  }));
  app2.use("/uploads/qr-codes", express3.static(qrCodesDir, {
    setHeaders: (res, path6) => {
      if (path6.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
    }
  }));
  app2.use("/uploads/gallery", express3.static(galleryDir, {
    setHeaders: (res, path6) => {
      if (path6.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
    }
  }));
  app2.use("/uploads/videos", express3.static(videosDir, {
    setHeaders: (res, path6) => {
      if (path6.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
    }
  }));
  app2.use("/uploads/blog", express3.static(blogDir, {
    setHeaders: (res, path6) => {
      if (path6.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
    }
  }));
  app2.use("/uploads/social-icons", express3.static(socialIconsDir, {
    setHeaders: (res, path6) => {
      if (path6.endsWith(".svg")) {
        res.setHeader("Content-Type", "image/svg+xml");
      }
    }
  }));
  app2.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const type = req.body.type || "banner";
      console.log("Processing upload for type:", type);
      let targetDir = bannersDir;
      let folder = "banners";
      if (type === "card") {
        targetDir = cardsDir;
        folder = "cards";
      } else if (type === "qr") {
        targetDir = qrCodesDir;
        folder = "qr-codes";
      } else if (type === "gallery") {
        targetDir = galleryDir;
        folder = "gallery";
      } else if (type === "video") {
        targetDir = videosDir;
        folder = "videos";
      } else if (type === "blog") {
        targetDir = blogDir;
        folder = "blog";
      } else if (type === "social-icon") {
        targetDir = socialIconsDir;
        folder = "social-icons";
      }
      const currentPath = req.file.path;
      const correctFilename = type + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + path3.extname(req.file.originalname);
      const correctPath = path3.join(targetDir, correctFilename);
      console.log("Moving file from:", currentPath, "to:", correctPath);
      if (currentPath !== correctPath) {
        fs3.renameSync(currentPath, correctPath);
        console.log("File moved successfully to:", correctPath);
      }
      if (!fs3.existsSync(correctPath)) {
        console.error("File not found at target path:", correctPath);
        return res.status(500).json({ message: "File upload failed - file not moved to correct directory" });
      }
      const imageUrl = `/uploads/${folder}/${correctFilename}`;
      console.log("File uploaded successfully:", imageUrl, "Size:", fs3.statSync(correctPath).size, "bytes");
      res.json({ url: imageUrl });
    } catch (error) {
      console.log("Error processing upload:", error);
      res.status(500).json({ message: "Error processing uploaded file", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/upload/banner", isAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const imageUrl = `/uploads/banners/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Error uploading file", error: error instanceof Error ? error.message : String(error) });
    }
  });
  const galleryUpload = multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, galleryDir);
      },
      filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "gallery-" + uniqueSuffix + path3.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 20 * 1024 * 1024
      // 20MB limit
    },
    fileFilter: function(req, file, cb) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"));
      }
    }
  });
  app2.post("/api/upload/gallery", isAdmin, galleryUpload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const imageUrl = `/uploads/gallery/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Error uploading gallery image", error: error instanceof Error ? error.message : String(error) });
    }
  });
  const videoUpload = multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, videosDir);
      },
      filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "video-" + uniqueSuffix + path3.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 20 * 1024 * 1024
      // 20MB limit
    },
    fileFilter: function(req, file, cb) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"));
      }
    }
  });
  app2.post("/api/upload/videos", isAdmin, videoUpload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const imageUrl = `/uploads/videos/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Error uploading video thumbnail", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.use("/api/payments", payment_default);
  app2.use("/api/receipts", receipt_default);
  app2.get("/api/banners", async (req, res) => {
    try {
      const banners2 = await storage.getBanners();
      res.json(banners2.filter((b) => b.isActive));
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({
        message: "Error fetching banners",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/banners", isAdmin, async (req, res) => {
    try {
      console.log("Creating banner with data:", req.body);
      const data = insertBannerSchema.parse(req.body);
      console.log("Parsed banner data:", data);
      const banner = await storage.createBanner(data);
      res.status(201).json(banner);
    } catch (error) {
      console.error("Error creating banner:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({
        message: "Error creating banner",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.put("/api/banners/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Updating banner:", id, "with data:", req.body);
      const data = insertBannerSchema.partial().parse(req.body);
      console.log("Parsed data:", data);
      const banner = await storage.updateBanner(id, data);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(banner);
    } catch (error) {
      console.error("Banner update error:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating banner", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.delete("/api/banners/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/quotes", async (req, res) => {
    try {
      const quotes2 = await storage.getQuotes();
      res.json(quotes2.filter((q) => q.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching quotes" });
    }
  });
  app2.get("/api/admin/quotes", isAdmin, async (req, res) => {
    try {
      const quotes2 = await storage.getQuotes();
      res.json(quotes2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quotes" });
    }
  });
  app2.post("/api/quotes", isAdmin, async (req, res) => {
    try {
      const data = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(data);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating quote" });
    }
  });
  app2.put("/api/quotes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertQuoteSchema.partial().parse(req.body);
      const quote = await storage.updateQuote(id, data);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      res.json(quote);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating quote" });
    }
  });
  app2.delete("/api/quotes/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/donation-categories", async (req, res) => {
    try {
      const categories = await storage.getDonationCategories();
      res.json(categories.filter((c) => c.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching donation categories" });
    }
  });
  app2.get("/api/donation-categories/:id", async (req, res) => {
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
  app2.post("/api/donation-categories", isAdmin, async (req, res) => {
    try {
      const data = insertDonationCategorySchema.parse(req.body);
      const category = await storage.createDonationCategory(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating donation category" });
    }
  });
  app2.put("/api/donation-categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = insertDonationCategorySchema.partial().parse(req.body);
      const data = { ...requestData };
      if (requestData.suggestedAmounts !== void 0) {
        if (Array.isArray(requestData.suggestedAmounts)) {
          data.suggestedAmounts = requestData.suggestedAmounts;
        } else if (typeof requestData.suggestedAmounts === "string") {
          data.suggestedAmounts = requestData.suggestedAmounts.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
        } else {
          data.suggestedAmounts = null;
        }
      }
      const category = await storage.updateDonationCategory(id, data);
      if (!category) {
        return res.status(404).json({ message: "Donation category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating donation category:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating donation category", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.delete("/api/donation-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Attempting to delete donation category with ID:", id);
      const result = await storage.deleteDonationCategory(id);
      if (!result.success) {
        console.log("Delete operation failed:", result.message);
        return res.status(400).json({
          message: result.message || "Cannot delete donation category"
        });
      }
      console.log(`Successfully deleted donation category ${id} and ${result.deletedCards || 0} related cards`);
      res.json({
        message: "Donation category deleted successfully",
        deletedCards: result.deletedCards || 0
      });
    } catch (error) {
      console.error("Error deleting donation category:", error);
      res.status(500).json({
        message: "Error deleting donation category",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/donation-cards", async (req, res) => {
    try {
      const cards = await storage.getDonationCards();
      res.json(cards.filter((c) => c.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching donation cards" });
    }
  });
  app2.get("/api/donation-cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const card = await storage.getDonationCard(id);
      if (!card) {
        return res.status(404).json({ message: "Donation card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donation card" });
    }
  });
  app2.get("/api/donation-cards/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const cards = await storage.getDonationCardsByCategory(categoryId);
      res.json(cards.filter((c) => c.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching donation cards by category" });
    }
  });
  app2.post("/api/donation-cards", isAdmin, async (req, res) => {
    try {
      console.log("Donation card creation request body:", JSON.stringify(req.body, null, 2));
      const data = insertDonationCardSchema.parse(req.body);
      console.log("Parsed donation card data:", JSON.stringify(data, null, 2));
      const card = await storage.createDonationCard(data);
      console.log("Created donation card:", JSON.stringify(card, null, 2));
      res.status(201).json(card);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        console.log("Donation card validation error:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.log("Donation card creation error:", error);
      res.status(500).json({ message: "Error creating donation card" });
    }
  });
  app2.put("/api/donation-cards/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertDonationCardSchema.partial().parse(req.body);
      const card = await storage.updateDonationCard(id, data);
      if (!card) {
        return res.status(404).json({ message: "Donation card not found" });
      }
      res.json(card);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating donation card" });
    }
  });
  app2.delete("/api/donation-cards/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDonationCard(id);
      if (!success) {
        return res.status(404).json({ message: "Donation card not found" });
      }
      res.json({ message: "Donation card deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting donation card" });
    }
  });
  app2.get("/api/bank-details", async (req, res) => {
    try {
      const details = await storage.getBankDetails();
      res.json(details.filter((d) => d.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching bank details" });
    }
  });
  app2.get("/api/categories/:categoryId/bank-details", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const categoryBankDetails2 = await storage.getCategoryBankDetails(categoryId);
      if (categoryBankDetails2 && categoryBankDetails2.length > 0) {
        res.json(categoryBankDetails2.filter((d) => d.isActive));
      } else {
        const category = await storage.getDonationCategory(categoryId);
        const categoryName = category ? category.name : `Category ${categoryId}`;
        const newCategoryBankDetails = await storage.createCategoryBankDetails({
          categoryId,
          accountName: `${categoryName} Fund`,
          bankName: "State Bank of India",
          accountNumber: `100000000${categoryId}`,
          ifscCode: "SBIN0000001",
          swiftCode: "SBININBB",
          qrCodeUrl: "",
          isActive: true
        });
        res.json([newCategoryBankDetails]);
      }
    } catch (error) {
      console.error("Error fetching category bank details:", error);
      res.status(500).json({ error: "Failed to fetch category bank details" });
    }
  });
  app2.post("/api/bank-details", isAdmin, async (req, res) => {
    try {
      const data = insertBankDetailsSchema.parse(req.body);
      const details = await storage.createBankDetails(data);
      res.status(201).json(details);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating bank details" });
    }
  });
  app2.put("/api/bank-details/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertBankDetailsSchema.partial().parse(req.body);
      const details = await storage.updateBankDetails(id, data);
      if (!details) {
        return res.status(404).json({ message: "Bank details not found" });
      }
      res.json(details);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating bank details" });
    }
  });
  app2.post("/api/categories/:categoryId/bank-details", isAdmin, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      console.log("Creating/updating category bank details for categoryId:", categoryId);
      console.log("Request body:", req.body);
      const existingDetails = await storage.getCategoryBankDetails(categoryId);
      if (existingDetails && existingDetails.length > 0) {
        const bankDetails2 = await storage.updateCategoryBankDetails(existingDetails[0].id, req.body);
        if (bankDetails2) {
          res.json(bankDetails2);
        } else {
          res.status(404).json({ message: "Bank details not found" });
        }
      } else {
        const bankDetailsData = {
          ...req.body,
          categoryId,
          isActive: true
        };
        const bankDetails2 = await storage.createCategoryBankDetails(bankDetailsData);
        res.status(201).json(bankDetails2);
      }
    } catch (error) {
      console.error("Error creating/updating category bank details:", error);
      res.status(500).json({ message: "Error creating/updating category bank details" });
    }
  });
  app2.put("/api/categories/:categoryId/bank-details/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryId = parseInt(req.params.categoryId);
      const existingDetails = await storage.getCategoryBankDetail(id);
      if (!existingDetails || existingDetails.categoryId !== categoryId) {
        return res.status(404).json({ message: "Bank details not found for this category" });
      }
      const bankDetails2 = await storage.updateCategoryBankDetails(id, req.body);
      if (bankDetails2) {
        res.json(bankDetails2);
      } else {
        res.status(404).json({ message: "Bank details not found" });
      }
    } catch (error) {
      console.error("Error updating category bank details:", error);
      res.status(500).json({ message: "Error updating category bank details" });
    }
  });
  app2.delete("/api/bank-details/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBankDetails(id);
      if (!success) {
        return res.status(404).json({ message: "Bank details not found" });
      }
      res.json({ message: "Bank details deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting bank details" });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const events2 = await storage.getEvents();
      res.json(events2.filter((e) => e.isActive));
    } catch (error) {
      console.error("Events API error:", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  });
  app2.get("/api/events/:id", async (req, res) => {
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
  app2.post("/api/events", isAdmin, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating event" });
    }
  });
  app2.put("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = insertEventSchema.partial().parse(req.body);
      let data = { ...requestData };
      if (requestData.suggestedAmounts && !Array.isArray(requestData.suggestedAmounts)) {
        data = {
          ...requestData,
          suggestedAmounts: Array.isArray(requestData.suggestedAmounts) ? requestData.suggestedAmounts : null
        };
      }
      const event = await storage.updateEvent(id, data);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating event" });
    }
  });
  app2.delete("/api/events/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Attempting to delete event with ID:", id);
      const result = await storage.deleteEvent(id);
      if (!result.success) {
        console.log("Delete operation failed:", result.message);
        return res.status(400).json({
          message: result.message || "Cannot delete event"
        });
      }
      console.log(`Successfully deleted event ${id}`);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({
        message: "Error deleting event",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/events/:eventId/donation-cards", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const cards = await storage.getEventDonationCards(eventId);
      res.json(cards.filter((c) => c.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching event donation cards" });
    }
  });
  app2.post("/api/event-donation-cards", async (req, res) => {
    try {
      const card = await storage.createEventDonationCard(req.body);
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ message: "Error creating event donation card" });
    }
  });
  app2.put("/api/event-donation-cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const card = await storage.updateEventDonationCard(id, req.body);
      if (!card) {
        return res.status(404).json({ message: "Event donation card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Error updating event donation card" });
    }
  });
  app2.delete("/api/event-donation-cards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEventDonationCard(id);
      if (!success) {
        return res.status(404).json({ message: "Event donation card not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting event donation card" });
    }
  });
  app2.get("/api/events/:id/bank-details", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const bankDetails2 = await storage.getEventBankDetails(eventId);
      res.json(bankDetails2.filter((bd) => bd.isActive));
    } catch (error) {
      console.error("Event bank details API error:", error);
      res.status(500).json({ message: "Error fetching event bank details" });
    }
  });
  app2.post("/api/events/:id/bank-details", isAdmin, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const data = { ...req.body, eventId };
      const bankDetails2 = await storage.createEventBankDetails(data);
      res.status(201).json(bankDetails2);
    } catch (error) {
      console.error("Create event bank details error:", error);
      res.status(500).json({ message: "Error creating event bank details" });
    }
  });
  app2.put("/api/events/:eventId/bank-details/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventId = parseInt(req.params.eventId);
      const data = { ...req.body, eventId };
      const bankDetails2 = await storage.updateEventBankDetails(id, data);
      if (!bankDetails2) {
        return res.status(404).json({ message: "Event bank details not found" });
      }
      res.json(bankDetails2);
    } catch (error) {
      console.error("Update event bank details error:", error);
      res.status(500).json({ message: "Error updating event bank details" });
    }
  });
  app2.delete("/api/events/:eventId/bank-details/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEventBankDetails(id);
      if (!success) {
        return res.status(404).json({ message: "Event bank details not found" });
      }
      res.json({ message: "Event bank details deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event bank details" });
    }
  });
  app2.get("/api/gallery", async (req, res) => {
    try {
      const galleryItems = await storage.getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gallery items" });
    }
  });
  app2.post("/api/gallery", isAdmin, async (req, res) => {
    try {
      const data = insertGallerySchema.parse(req.body);
      const galleryItem = await storage.createGalleryItem(data);
      res.status(201).json(galleryItem);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating gallery item" });
    }
  });
  app2.put("/api/gallery/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertGallerySchema.partial().parse(req.body);
      const galleryItem = await storage.updateGalleryItem(id, data);
      if (!galleryItem) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      res.json(galleryItem);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating gallery item" });
    }
  });
  app2.delete("/api/gallery/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/videos", async (req, res) => {
    try {
      const videos2 = await storage.getVideos();
      res.json(videos2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching videos" });
    }
  });
  app2.post("/api/videos", isAdmin, async (req, res) => {
    try {
      const data = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(data);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating video" });
    }
  });
  app2.put("/api/videos/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(id, data);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating video" });
    }
  });
  app2.delete("/api/videos/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/live-videos", async (req, res) => {
    try {
      const liveVideos2 = await storage.getLiveVideos();
      res.json(liveVideos2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching live videos" });
    }
  });
  app2.post("/api/live-videos", isAdmin, async (req, res) => {
    try {
      const data = insertLiveVideoSchema.parse(req.body);
      const liveVideo = await storage.createLiveVideo(data);
      res.status(201).json(liveVideo);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating live video" });
    }
  });
  app2.put("/api/live-videos/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertLiveVideoSchema.partial().parse(req.body);
      const liveVideo = await storage.updateLiveVideo(id, data);
      if (!liveVideo) {
        return res.status(404).json({ message: "Live video not found" });
      }
      res.json(liveVideo);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating live video" });
    }
  });
  app2.delete("/api/live-videos/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLiveVideo(id);
      if (!success) {
        return res.status(404).json({ message: "Live video not found" });
      }
      res.json({ message: "Live video deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting live video" });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials2 = await storage.getTestimonials();
      res.json(testimonials2.filter((t) => t.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });
  app2.get("/api/admin/testimonials", isAdmin, async (req, res) => {
    try {
      const testimonials2 = await storage.getTestimonials();
      res.json(testimonials2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching testimonials" });
    }
  });
  app2.post("/api/testimonials", isAdmin, async (req, res) => {
    try {
      const data = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(data);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating testimonial" });
    }
  });
  app2.put("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, data);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating testimonial" });
    }
  });
  app2.delete("/api/testimonials/:id", isAdmin, async (req, res) => {
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
  app2.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.status(201).json({ message: "Contact message sent successfully" });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error sending contact message" });
    }
  });
  app2.get("/api/contact-messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contact messages" });
    }
  });
  app2.put("/api/contact-messages/:id", isAdmin, async (req, res) => {
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
  app2.put("/api/contact-messages/:id/read", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markContactMessageAsRead(id);
      if (!message) {
        return res.status(404).json({ message: "Contact message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Error marking message as read" });
    }
  });
  app2.delete("/api/contact-messages/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/social-links", async (req, res) => {
    try {
      const socialLinks2 = await storage.getSocialLinks();
      res.json(socialLinks2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching social links" });
    }
  });
  app2.post("/api/social-links", isAdmin, async (req, res) => {
    try {
      const data = insertSocialLinkSchema.parse(req.body);
      const socialLink = await storage.createSocialLink(data);
      res.status(201).json(socialLink);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating social link" });
    }
  });
  app2.put("/api/social-links/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertSocialLinkSchema.partial().parse(req.body);
      const socialLink = await storage.updateSocialLink(id, data);
      if (!socialLink) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json(socialLink);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating social link" });
    }
  });
  app2.delete("/api/social-links/:id", isAdmin, async (req, res) => {
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
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users2 = await storage.getUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  app2.put("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, data);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating user" });
    }
  });
  app2.delete("/api/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });
  app2.get("/api/stats", async (req, res) => {
    try {
      const stats2 = await storage.getStats();
      res.json(stats2.filter((s) => s.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });
  app2.get("/api/schedules", async (req, res) => {
    try {
      const schedules2 = await storage.getSchedules();
      res.json(schedules2.filter((s) => s.isActive));
    } catch (error) {
      res.status(500).json({ message: "Error fetching schedules" });
    }
  });
  app2.post("/api/donations", async (req, res) => {
    try {
      const data = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(data);
      res.status(201).json({
        message: "Donation created successfully",
        donation,
        paymentUrl: `https://pay.example.com/${donation.id}`
        // Example payment URL
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating donation" });
    }
  });
  app2.get("/api/donations", isAdmin, async (req, res) => {
    try {
      const donations2 = await storage.getDonations();
      res.json(donations2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donations" });
    }
  });
  app2.get("/api/admin/donations", isAdmin, async (req, res) => {
    try {
      const donations2 = await storage.getAllDonations();
      res.json(donations2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donations" });
    }
  });
  app2.get("/api/user/donations", isAuthenticated, async (req, res) => {
    try {
      const donations2 = await storage.getUserDonations(req.session.userId);
      res.json(donations2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user donations" });
    }
  });
  app2.get("/api/donations/by-payment-id/:paymentId", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const donation = await storage.getDonationByPaymentId(paymentId);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching donation" });
    }
  });
  app2.get("/api/donations/export", isAdmin, async (req, res) => {
    try {
      const { fromDate, toDate } = req.query;
      if (!fromDate || !toDate) {
        return res.status(400).json({ message: "fromDate and toDate query parameters are required" });
      }
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        return res.status(400).json({ message: "Invalid date format. Use ISO string format." });
      }
      const donations2 = await storage.getDonationsByDateRange(from, to);
      res.json(donations2);
    } catch (error) {
      console.error("Error fetching donations for export:", error);
      res.status(500).json({ message: "Error fetching donations for export" });
    }
  });
  app2.post("/api/donations/payment-webhook", async (req, res) => {
    try {
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
  app2.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts.filter((post) => post.isPublished));
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });
  app2.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      if (!post.isPublished) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });
  app2.get("/api/admin/blog-posts", isAdmin, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });
  app2.post("/api/admin/blog-posts", isAdmin, async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating blog post" });
    }
  });
  app2.put("/api/admin/blog-posts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Server received blog update request for ID:", id);
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      const requestBody = { ...req.body };
      if (requestBody.publishedAt && typeof requestBody.publishedAt === "string") {
        requestBody.publishedAt = new Date(requestBody.publishedAt);
      }
      const data = insertBlogPostSchema.partial().parse(requestBody);
      console.log("Parsed data successfully:", Object.keys(data));
      const post = await storage.updateBlogPost(id, data);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        console.log("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.log("Server error updating blog post:", error);
      res.status(500).json({ message: "Error updating blog post" });
    }
  });
  app2.delete("/api/admin/blog-posts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting blog post" });
    }
  });
  app2.post("/api/subscribe", async (req, res) => {
    try {
      const data = insertSubscriptionSchema.parse(req.body);
      const existingSubscription = await storage.getSubscriptionByEmail(data.email);
      if (existingSubscription) {
        if (!existingSubscription.isActive) {
          await storage.updateSubscription(existingSubscription.id, { isActive: true });
        }
        return res.json({ message: "Subscription successful" });
      }
      await storage.createSubscription(data);
      res.status(201).json({ message: "Subscription successful" });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating subscription" });
    }
  });
  app2.get("/api/auth/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No authorization header or invalid format");
        return res.status(200).json(null);
      }
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Token decoded successfully, userId:", decoded.userId);
        const user = await storage.getUser(decoded.userId);
        if (!user) {
          console.log("User not found in DB");
          return res.status(200).json(null);
        }
        const { password, ...userWithoutPassword } = user;
        console.log("Returning user:", userWithoutPassword);
        res.json(userWithoutPassword);
      } catch (tokenError) {
        console.log("Invalid token:", tokenError);
        return res.status(200).json(null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Error fetching current user" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const user = await storage.createUser(data);
      const { password, ...userWithoutPassword } = user;
      req.session.userId = user.id;
      res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error registering user" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, username, password } = req.body;
      console.log("Login attempt:", { email, username, password: "***" });
      if (!email && !username || !password) {
        return res.status(400).json({ message: "Email/username and password are required" });
      }
      const user = email ? await storage.getUserByEmail(email) : await storage.getUserByUsername(username);
      console.log("User found:", user ? { id: user.id, username: user.username, isActive: user.isActive } : null);
      console.log("Password match:", user ? user.password === password : false);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (!user.isActive) {
        return res.status(403).json({ message: "Account is deactivated" });
      }
      const { password: _, ...userWithoutPassword } = user;
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      console.log("Login successful, generating token for user:", user.id);
      res.json({
        message: "Login successful",
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error during login" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });
  app2.put("/api/user/profile", isAuthenticated, async (req, res) => {
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
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating user profile" });
    }
  });
  app2.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users2 = await storage.getUsers();
      const usersWithoutPasswords = users2.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  app2.put("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateSchema = insertUserSchema.partial();
      const data = updateSchema.parse(req.body);
      const user = await storage.updateUser(id, data);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating user" });
    }
  });
  app2.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
  app2.get("/api/admin/dashboard-stats", isAdmin, async (req, res) => {
    try {
      const users2 = await storage.getUsers();
      const donations2 = await storage.getDonations();
      const contactMessages2 = await storage.getContactMessages();
      const donationCategories2 = await storage.getDonationCategories();
      const totalDonationAmount = donations2.reduce((total, donation) => {
        if (donation.status === "success") {
          return total + donation.amount;
        }
        return total;
      }, 0);
      const pendingDonationAmount = donations2.reduce((total, donation) => {
        if (donation.status === "pending") {
          return total + donation.amount;
        }
        return total;
      }, 0);
      const unreadMessages = contactMessages2.filter((msg) => !msg.isRead).length;
      const donationsByCategory = donationCategories2.map((category) => {
        const count = donations2.filter((d) => d.categoryId === category.id && d.status === "success").length;
        const amount = donations2.filter((d) => d.categoryId === category.id && d.status === "success").reduce((sum, d) => sum + d.amount, 0);
        return {
          id: category.id,
          name: category.name,
          count,
          amount
        };
      });
      res.json({
        userCount: users2.length,
        donationCount: donations2.filter((d) => d.status === "success").length,
        pendingDonationCount: donations2.filter((d) => d.status === "pending").length,
        totalDonationAmount,
        pendingDonationAmount,
        messageCount: contactMessages2.length,
        unreadMessageCount: unreadMessages,
        donationsByCategory
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard stats" });
    }
  });
  app2.post("/api/payment/create-payu-order", async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        amount,
        message,
        categoryId,
        cardId,
        eventId,
        eventCardId,
        isCustomAmount
      } = req.body;
      if (!name || !email || !phone || !amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: name, email, phone, and amount are required"
        });
      }
      const crypto2 = require2("crypto");
      const { nanoid: nanoid4 } = require2("nanoid");
      if (!process.env.PAYU_MERCHANT_KEY || !process.env.PAYU_MERCHANT_SALT) {
        return res.status(500).json({
          success: false,
          message: "Payment gateway not configured. Please contact administrator."
        });
      }
      const txnid = `TXN_${nanoid4(12)}_${Date.now()}`;
      const isLocalhost = req.get("host")?.includes("localhost") || req.get("host")?.includes("127.0.0.1");
      const proto = req.headers["x-forwarded-proto"] || (isLocalhost ? "http" : "https");
      const payuParams = {
        key: process.env.PAYU_MERCHANT_KEY,
        txnid,
        amount: parseFloat(amount).toFixed(2),
        productinfo: isCustomAmount ? "Custom Donation" : cardId ? "Donation Card" : "Event Donation",
        firstname: name.split(" ")[0],
        lastname: name.split(" ").slice(1).join(" ") || "",
        email,
        phone,
        address1: address || "",
        city: "",
        state: "",
        country: "India",
        zipcode: "",
        udf1: categoryId?.toString() || "",
        udf2: cardId?.toString() || "",
        udf3: eventId?.toString() || "",
        udf4: eventCardId?.toString() || "",
        udf5: isCustomAmount ? "true" : "false",
        surl: `${proto}://${req.get("host")}/api/payments/success`,
        furl: `${proto}://${req.get("host")}/api/payments/failure`,
        hash: ""
      };
      const hashString = `${payuParams.key}|${payuParams.txnid}|${parseFloat(payuParams.amount).toFixed(2)}|${payuParams.productinfo}|${payuParams.firstname}|${payuParams.email}|${payuParams.udf1 || ""}|${payuParams.udf2 || ""}|${payuParams.udf3 || ""}|${payuParams.udf4 || ""}|${payuParams.udf5 || ""}||||||${process.env.PAYU_MERCHANT_SALT}`;
      console.log("Hash String:", hashString);
      payuParams.hash = crypto2.createHash("sha512").update(hashString).digest("hex");
      console.log("Generated Hash:", payuParams.hash);
      console.log("PayU Payment Request:", {
        environment: "LIVE",
        key: payuParams.key,
        txnid: payuParams.txnid,
        amount: payuParams.amount,
        hashGenerated: true
      });
      const donationData = {
        name,
        email,
        phone,
        address: address || "",
        amount: parseInt(amount),
        message: message || "",
        paymentId: txnid,
        status: "pending",
        categoryId: categoryId || null,
        eventId: eventId || null,
        userId: req.session?.userId || null
      };
      await storage.createDonation(donationData);
      res.json({
        success: true,
        paymentUrl: "https://secure.payu.in/_payment",
        params: payuParams,
        txnid
      });
    } catch (error) {
      console.error("PayU order creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment order"
      });
    }
  });
  app2.post("/payment/success", async (req, res) => {
    try {
      const {
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        status,
        hash,
        payuMoneyId,
        mihpayid
      } = req.body;
      console.log("PayU Success Callback:", { txnid, amount, status, firstname, email, hash });
      const crypto2 = require2("crypto");
      const reverseHashString = `${process.env.PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
      const reverseHash = crypto2.createHash("sha512").update(reverseHashString).digest("hex");
      console.log("Hash verification:", {
        received: hash,
        calculated: reverseHash,
        string: reverseHashString
      });
      const skipHashVerification = process.env.NODE_ENV === "development";
      if (!skipHashVerification && hash !== reverseHash) {
        console.error("Hash verification failed");
        return res.redirect("/payment/failure?error=verification_failed");
      }
      const donation = await storage.getDonationByPaymentId(txnid);
      if (donation) {
        await storage.updateDonation(donation.id, {
          status: status === "success" ? "success" : "failed",
          paymentGatewayResponse: JSON.stringify(req.body),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      if (status === "success") {
        res.redirect(`/payment/success?txnid=${txnid}&amount=${amount}`);
      } else {
        res.redirect(`/payment/failure?txnid=${txnid}&error=payment_failed`);
      }
    } catch (error) {
      console.error("Payment success handler error:", error);
      res.redirect("/payment/failure?error=processing_error");
    }
  });
  app2.get("/api/donation/:txnid", async (req, res) => {
    try {
      const { txnid } = req.params;
      const donation = await storage.getDonationByPaymentId(txnid);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      let additionalDetails = {};
      if (donation.eventId) {
        const event = await storage.getEvent(donation.eventId);
        additionalDetails = {
          type: "event",
          event
        };
      } else if (donation.categoryId) {
        const category = await storage.getDonationCategory(donation.categoryId);
        additionalDetails = {
          type: "category",
          category
        };
      }
      let user = null;
      if (donation.userId) {
        user = await storage.getUser(donation.userId);
      }
      res.json({
        donation,
        user: user ? {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          phone: user.phone
        } : null,
        ...additionalDetails
      });
    } catch (error) {
      console.error("Error fetching donation details:", error);
      res.status(500).json({ message: "Failed to fetch donation details" });
    }
  });
  app2.put("/api/donations/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const donation = await storage.updateDonation(parseInt(id), { status });
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json({ message: "Donation status updated", donation });
    } catch (error) {
      console.error("Error updating donation status:", error);
      res.status(500).json({ message: "Failed to update donation status" });
    }
  });
  app2.post("/payment/failure", async (req, res) => {
    try {
      const { txnid, status } = req.body;
      console.log("PayU Failure Callback:", { txnid, status });
      const donation = await storage.getDonationByPaymentId(txnid);
      if (donation) {
        await storage.updateDonation(donation.id, {
          status: "failed",
          paymentGatewayResponse: JSON.stringify(req.body),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      res.redirect(`/payment/failure?txnid=${txnid}&error=payment_cancelled`);
    } catch (error) {
      console.error("Payment failure handler error:", error);
      res.redirect("/payment/failure?error=processing_error");
    }
  });
  app2.post("/api/upload/social-icon", isAdmin, upload.single("icon"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const originalPath = req.file.path;
      const filename = "social-icon-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + path3.extname(req.file.originalname);
      const targetPath = path3.join(socialIconsDir, filename);
      fs3.renameSync(originalPath, targetPath);
      const imageUrl = `/uploads/social-icons/${filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Error uploading social icon:", error);
      res.status(500).json({ message: "Error uploading social icon", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/process-section", async (req, res) => {
    try {
      const section = await storage.getProcessSection();
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Error fetching process section" });
    }
  });
  app2.put("/api/process-section", isAdmin, async (req, res) => {
    try {
      const data = insertProcessSectionSchema.partial().parse(req.body);
      const section = await storage.updateProcessSection(data);
      res.json(section);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating process section" });
    }
  });
  app2.get("/api/footer-settings", async (req, res) => {
    try {
      const settings = await storage.getFooterSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching footer settings" });
    }
  });
  app2.put("/api/footer-settings", isAdmin, async (req, res) => {
    try {
      const data = insertFooterSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateFooterSettings(data);
      res.json(settings);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating footer settings" });
    }
  });
  app2.get("/api/policies", async (req, res) => {
    try {
      const policies2 = await storage.getPolicies();
      res.json(policies2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching policies" });
    }
  });
  app2.get("/api/policies/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const policy = await storage.getPolicyBySlug(slug);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      res.json(policy);
    } catch (error) {
      res.status(500).json({ message: "Error fetching policy" });
    }
  });
  app2.get("/api/admin/policies", isAdmin, async (req, res) => {
    try {
      const allPolicies = await storage.getAllPolicies();
      res.json(allPolicies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching policies" });
    }
  });
  app2.post("/api/admin/policies", isAdmin, async (req, res) => {
    try {
      const data = insertPolicySchema.parse(req.body);
      const policy = await storage.createPolicy(data);
      res.json(policy);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating policy" });
    }
  });
  app2.put("/api/admin/policies/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertPolicySchema.partial().parse(req.body);
      const policy = await storage.updatePolicy(parseInt(id), data);
      if (!policy) {
        return res.status(404).json({ message: "Policy not found" });
      }
      res.json(policy);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating policy" });
    }
  });
  app2.delete("/api/admin/policies/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePolicy(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "Policy not found" });
      }
      res.json({ message: "Policy deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting policy" });
    }
  });
  app2.get("/api/policies-page", async (req, res) => {
    try {
      const page = await storage.getPoliciesPage();
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Error fetching policies page" });
    }
  });
  app2.put("/api/admin/policies-page", isAdmin, async (req, res) => {
    try {
      const data = insertPoliciesPageSchema.partial().parse(req.body);
      const page = await storage.updatePoliciesPage(data);
      res.json(page);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating policies page" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express4 from "express";
import fs4 from "fs";
import path5 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path4 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path4.resolve(import.meta.dirname, "client", "src"),
      "@shared": path4.resolve(import.meta.dirname, "shared"),
      "@assets": path4.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path4.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path4.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Production optimization settings
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor": ["react", "react-dom"],
          "ui": ["@radix-ui/react-dialog", "@radix-ui/react-select"],
          "query": ["@tanstack/react-query"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3,
    reportCompressedSize: false
  }
});

// server/vite.ts
import { nanoid as nanoid3 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path5.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs4.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid3()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path5.resolve(import.meta.dirname, "public");
  if (!fs4.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express4.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path5.resolve(distPath, "index.html"));
  });
}

// server/createDefaultAdmin.ts
async function createDefaultAdmin() {
  try {
    const existingAdmin = await storage.getUserByUsername("isk_conjuhuadmin");
    if (!existingAdmin) {
      console.log("Creating default admin user...");
      const adminUser = await storage.createUser({
        username: "isk_conjuhuadmin",
        password: "isk_conjuhukrishnaconsiousness",
        // In a real app, this would be hashed
        email: "admin@iskconjuhu.org",
        name: "ISKCON Juhu Admin",
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

// server/initializeData.ts
async function initializeStatsAndSchedules() {
  try {
    const existingStats = await db.select().from(stats);
    if (existingStats.length === 0) {
      console.log("Initializing stats data...");
      await db.insert(stats).values([
        {
          value: 300,
          suffix: "cr+",
          label: "Meals Distributed",
          isActive: true,
          orderIndex: 1
        },
        {
          value: 55,
          suffix: "years",
          label: "of service to humanity",
          isActive: true,
          orderIndex: 2
        },
        {
          value: 110,
          suffix: "+",
          label: "Kitchens across India",
          isActive: true,
          orderIndex: 3
        }
      ]);
      console.log("Stats data initialized successfully");
    }
    const existingSchedules = await db.select().from(schedules);
    if (existingSchedules.length === 0) {
      console.log("Initializing temple schedule data...");
      await db.insert(schedules).values([
        {
          title: "Mangala Aarti",
          time: "04:30 AM",
          description: "Morning worship with beautiful prayers and devotional songs",
          isActive: true,
          orderIndex: 1
        },
        {
          title: "Tulsi Aarti",
          time: "05:00 AM",
          description: "Sacred worship of Tulsi Devi with melodious chanting",
          isActive: true,
          orderIndex: 2
        },
        {
          title: "Srimad Bhagavatam Class",
          time: "07:30 AM",
          description: "Daily spiritual discourse on ancient Vedic wisdom",
          isActive: true,
          orderIndex: 3
        },
        {
          title: "Guru Puja",
          time: "08:00 AM",
          description: "Reverent worship and offering to spiritual masters",
          isActive: true,
          orderIndex: 4
        },
        {
          title: "Raj Bhog Aarti",
          time: "12:30 PM",
          description: "Midday offering with elaborate prayers and bhajans",
          isActive: true,
          orderIndex: 5
        },
        {
          title: "Sandhya Aarti",
          time: "07:00 PM",
          description: "Evening worship filled with devotional atmosphere",
          isActive: true,
          orderIndex: 6
        },
        {
          title: "Shayan Aarti",
          time: "08:30 PM",
          description: "Final peaceful aarti before the deities rest",
          isActive: true,
          orderIndex: 7
        }
      ]);
      console.log("Temple schedule data initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing stats and schedules:", error);
  }
}

// server/initializeBlogData.ts
async function initializeBlogData() {
  try {
    const existingPosts = await storage.getBlogPosts();
    if (existingPosts.length > 0) {
      console.log("Blog posts already exist, skipping initialization");
      return;
    }
    const sampleBlogPosts = [
      {
        title: "The Divine Teachings of Bhagavad Gita: A Guide for Modern Life",
        slug: "divine-teachings-bhagavad-gita-modern-life",
        excerpt: "Discover how the timeless wisdom of the Bhagavad Gita can transform your daily life and bring spiritual enlightenment in our modern world.",
        content: `The Bhagavad Gita, often called the Song of God, is one of the most revered spiritual texts in the world. This sacred dialogue between Prince Arjuna and Lord Krishna on the battlefield of Kurukshetra offers profound insights that remain relevant in our contemporary lives.

In our fast-paced modern world, we often find ourselves caught in the whirlwind of material pursuits, losing sight of our true purpose. The Gita teaches us the art of living with awareness, performing our duties without attachment to results.

Lord Krishna's teachings on dharma (righteous duty) remind us that every action should be performed with consciousness and dedication. Whether we are students, professionals, parents, or spiritual seekers, the principles of the Gita can guide us toward a more fulfilling existence.

The concept of yoga in the Gita goes beyond physical postures\u2014it represents the union of the individual soul with the Supreme. Through karma yoga (the path of action), bhakti yoga (the path of devotion), and jnana yoga (the path of knowledge), we can achieve spiritual growth while fulfilling our worldly responsibilities.

As we navigate the challenges of modern life, let us remember Krishna's words: "You have the right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty."`,
        author: "Swami Prabhupada Disciple",
        readTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        isPublished: true,
        publishedAt: /* @__PURE__ */ new Date("2024-06-01")
      },
      {
        title: "Janmashtami Celebrations: Experiencing Krishna's Divine Love",
        slug: "janmashtami-celebrations-krishna-divine-love",
        excerpt: "Join us in celebrating the birth of Lord Krishna and experience the joy, devotion, and spiritual bliss that fills ISKCON Juhu during this sacred festival.",
        content: `Janmashtami, the celebration of Lord Krishna's appearance, is one of the most joyous festivals at ISKCON Juhu. Every year, thousands of devotees gather to commemorate the birth of the Supreme Personality of Godhead with immense devotion and spiritual fervor.

The festival begins with elaborate preparations that transform our temple into a divine abode. Beautiful decorations, fragrant flowers, and melodious kirtans create an atmosphere that transports every visitor to Vrindavan, Krishna's eternal realm.

Our Janmashtami celebrations feature traditional abhishek (bathing ceremony) of the deities, where Lord Krishna is lovingly bathed with milk, honey, ghee, and fragrant waters. The midnight celebration marks the exact moment of Krishna's appearance, filled with ecstatic dancing and singing of the holy names.

The festival is not just about external celebrations\u2014it's an opportunity for inner transformation. As we participate in the festivities, we're reminded of Krishna's teachings about love, compassion, and surrender. The stories of Krishna's childhood pastimes inspire us to develop a loving relationship with the Divine.

Children perform beautiful cultural programs depicting Krishna's leelas (pastimes), while devotees offer heartfelt prayers and participate in communal feasting. The prasadam (sanctified food) distribution continues throughout the day, ensuring that everyone partakes in Krishna's mercy.

For those seeking spiritual growth, Janmashtami serves as a reminder that Krishna consciousness is not confined to a single day but should permeate every moment of our lives.`,
        author: "Temple Committee",
        readTime: 4,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
        isPublished: true,
        publishedAt: /* @__PURE__ */ new Date("2024-08-15")
      },
      {
        title: "The Power of Congregational Chanting: Hare Krishna Mahamantra",
        slug: "power-congregational-chanting-hare-krishna-mahamantra",
        excerpt: "Experience the transformative power of chanting the Hare Krishna mahamantra in congregation and discover how this ancient practice purifies the heart and mind.",
        content: `The Hare Krishna mahamantra\u2014Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare / Hare Rama, Hare Rama, Rama Rama, Hare Hare\u2014is described in the Vedic scriptures as the most powerful spiritual practice for this age of Kali.

At ISKCON Juhu, our daily congregational chanting sessions create waves of spiritual energy that touch every heart present. When devotees come together to chant the holy names, the collective vibration creates an atmosphere of pure devotion and transcendental bliss.

Scientific studies have shown that chanting produces positive changes in brain chemistry, reducing stress and promoting mental clarity. But beyond the psychological benefits, the spiritual effects are profound. The mahamantra is a direct call to Krishna, expressing our desire to serve the Divine with love and devotion.

Our morning and evening kirtan sessions are open to all, regardless of background or experience. Many visitors share how their first experience of congregational chanting brought them peace they had never experienced before. The simple act of repeating these sacred names gradually cleanses the consciousness and awakens dormant love for God.

The beauty of the mahamantra lies in its simplicity\u2014anyone can chant, anywhere, at any time. Whether you're stuck in traffic, walking in the park, or sitting in meditation, these names of God provide a direct connection to the Divine.

Regular participation in congregational chanting strengthens our spiritual foundation and helps us develop the qualities of humility, tolerance, and genuine care for others. As we progress in our chanting practice, we begin to taste the nectar of devotional service.`,
        author: "Kirtan Leader",
        readTime: 6,
        imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop",
        isPublished: true,
        publishedAt: /* @__PURE__ */ new Date("2024-09-20")
      },
      {
        title: "Prasadam: The Science of Sacred Food and Spiritual Nourishment",
        slug: "prasadam-science-sacred-food-spiritual-nourishment",
        excerpt: "Learn about the profound significance of prasadam in Krishna consciousness and how sanctified food becomes a medium for spiritual advancement and divine grace.",
        content: `Prasadam, meaning "mercy of the Lord," refers to food that has been offered to Krishna with love and devotion before being distributed to devotees and visitors. At ISKCON Juhu, the preparation and distribution of prasadam is considered one of our most important services.

The process of preparing prasadam begins with the careful selection of ingredients\u2014only the finest, freshest, and purest foods are chosen. Our cooks, who are experienced devotees, prepare each dish with meditation on Krishna, chanting the holy names throughout the cooking process.

Before any food is distributed, it is first offered to our beautiful deities of Sri Sri Radha Rasabihari, accompanied by prayers and bhajans. This offering transforms ordinary food into prasadam\u2014spiritually potent nourishment that purifies both body and soul.

The Vedic scriptures explain that when we consume prasadam, we're not just nourishing our physical body but also our spiritual essence. The consciousness of devotion infused into the food during preparation and offering creates positive karmic effects for both the cook and the consumer.

Our daily prasadam distribution serves hundreds of people, including temple visitors, local residents, and those in need. The free meal program embodies Krishna's teaching that no one should go hungry, especially when they've come seeking spiritual nourishment.

Many devotees share transformative experiences connected to prasadam\u2014how their first taste opened their hearts to Krishna consciousness, or how regular consumption gradually refined their consciousness and reduced material desires.

The preparation of prasadam is also a meditative practice. Volunteers who join our kitchen service often describe it as one of the most fulfilling spiritual activities, where the simple act of cooking becomes an offering of love to the Divine.`,
        author: "Kitchen Coordinator",
        readTime: 5,
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop",
        isPublished: true,
        publishedAt: /* @__PURE__ */ new Date("2024-10-10")
      }
    ];
    for (const post of sampleBlogPosts) {
      await storage.createBlogPost(post);
    }
    console.log(`Successfully initialized ${sampleBlogPosts.length} blog posts`);
  } catch (error) {
    console.error("Error initializing blog data:", error);
  }
}

// server/index.ts
var app = express5();
app.use(express5.json());
app.use(express5.urlencoded({ extended: false }));
app.use("/api/payments", payment_default);
app.use("/api/receipts", receipt_default);
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path6.startsWith("/api")) {
      let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const paymentValidation = validatePaymentConfig();
  if (!paymentValidation.isValid) {
    console.error("Payment configuration validation failed:");
    paymentValidation.errors.forEach((error) => console.error(`- ${error}`));
    console.log("Note: Some payment features may not work without proper configuration");
  } else {
    console.log("\u2713 Payment system configured for LIVE PRODUCTION MODE");
  }
  await createDefaultAdmin();
  await initializeStatsAndSchedules();
  await initializeBlogData();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Server Error:", err);
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  console.log(`Starting server on port ${port}`);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
