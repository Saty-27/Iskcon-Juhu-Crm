import { db } from './db';
import { eq } from 'drizzle-orm';
import {
  users, User, InsertUser,
  banners, Banner, InsertBanner,
  quotes, Quote, InsertQuote,
  donationCategories, DonationCategory, InsertDonationCategory,
  events, Event, InsertEvent,
  gallery, Gallery, InsertGallery,
  videos, Video, InsertVideo,
  testimonials, Testimonial, InsertTestimonial,
  contactMessages, ContactMessage, InsertContactMessage,
  socialLinks, SocialLink, InsertSocialLink,
  donations, Donation, InsertDonation,
  subscriptions, Subscription, InsertSubscription
} from '@shared/schema';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return result.length > 0;
  }
  
  // Banner management
  async getBanners(): Promise<Banner[]> {
    return await db.select().from(banners);
  }
  
  async getBanner(id: number): Promise<Banner | undefined> {
    const [banner] = await db.select().from(banners).where(eq(banners.id, id));
    return banner || undefined;
  }
  
  async createBanner(banner: InsertBanner): Promise<Banner> {
    const [newBanner] = await db
      .insert(banners)
      .values(banner)
      .returning();
    return newBanner;
  }
  
  async updateBanner(id: number, bannerData: Partial<Banner>): Promise<Banner | undefined> {
    const [updatedBanner] = await db
      .update(banners)
      .set(bannerData)
      .where(eq(banners.id, id))
      .returning();
    return updatedBanner || undefined;
  }
  
  async deleteBanner(id: number): Promise<boolean> {
    const result = await db
      .delete(banners)
      .where(eq(banners.id, id))
      .returning({ id: banners.id });
    return result.length > 0;
  }
  
  // Quote management
  async getQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes);
  }
  
  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || undefined;
  }
  
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await db
      .insert(quotes)
      .values(quote)
      .returning();
    return newQuote;
  }
  
  async updateQuote(id: number, quoteData: Partial<Quote>): Promise<Quote | undefined> {
    const [updatedQuote] = await db
      .update(quotes)
      .set(quoteData)
      .where(eq(quotes.id, id))
      .returning();
    return updatedQuote || undefined;
  }
  
  async deleteQuote(id: number): Promise<boolean> {
    const result = await db
      .delete(quotes)
      .where(eq(quotes.id, id))
      .returning({ id: quotes.id });
    return result.length > 0;
  }
  
  // Donation category management
  async getDonationCategories(): Promise<DonationCategory[]> {
    return await db.select().from(donationCategories);
  }
  
  async getDonationCategory(id: number): Promise<DonationCategory | undefined> {
    const [category] = await db.select().from(donationCategories).where(eq(donationCategories.id, id));
    return category || undefined;
  }
  
  async createDonationCategory(category: InsertDonationCategory): Promise<DonationCategory> {
    // Handle array correctly before inserting
    const { suggestedAmounts, ...rest } = category;
    const [newCategory] = await db
      .insert(donationCategories)
      .values({
        ...rest,
        suggestedAmounts: suggestedAmounts || null
      })
      .returning();
    return newCategory;
  }
  
  async updateDonationCategory(id: number, categoryData: Partial<DonationCategory>): Promise<DonationCategory | undefined> {
    const [updatedCategory] = await db
      .update(donationCategories)
      .set(categoryData)
      .where(eq(donationCategories.id, id))
      .returning();
    return updatedCategory || undefined;
  }
  
  async deleteDonationCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(donationCategories)
      .where(eq(donationCategories.id, id))
      .returning({ id: donationCategories.id });
    return result.length > 0;
  }
  
  // Event management
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    // Handle array correctly before inserting
    const { suggestedAmounts, ...rest } = event;
    const [newEvent] = await db
      .insert(events)
      .values({
        ...rest,
        suggestedAmounts: suggestedAmounts || null
      })
      .returning();
    return newEvent;
  }
  
  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set(eventData)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent || undefined;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    const result = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning({ id: events.id });
    return result.length > 0;
  }
  
  // Gallery management
  async getGalleryItems(): Promise<Gallery[]> {
    return await db.select().from(gallery);
  }
  
  async getGalleryItem(id: number): Promise<Gallery | undefined> {
    const [galleryItem] = await db.select().from(gallery).where(eq(gallery.id, id));
    return galleryItem || undefined;
  }
  
  async createGalleryItem(galleryItem: InsertGallery): Promise<Gallery> {
    const [newGalleryItem] = await db
      .insert(gallery)
      .values(galleryItem)
      .returning();
    return newGalleryItem;
  }
  
  async updateGalleryItem(id: number, galleryData: Partial<Gallery>): Promise<Gallery | undefined> {
    const [updatedGalleryItem] = await db
      .update(gallery)
      .set(galleryData)
      .where(eq(gallery.id, id))
      .returning();
    return updatedGalleryItem || undefined;
  }
  
  async deleteGalleryItem(id: number): Promise<boolean> {
    const result = await db
      .delete(gallery)
      .where(eq(gallery.id, id))
      .returning({ id: gallery.id });
    return result.length > 0;
  }
  
  // Video management
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos);
  }
  
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }
  
  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values(video)
      .returning();
    return newVideo;
  }
  
  async updateVideo(id: number, videoData: Partial<Video>): Promise<Video | undefined> {
    const [updatedVideo] = await db
      .update(videos)
      .set(videoData)
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo || undefined;
  }
  
  async deleteVideo(id: number): Promise<boolean> {
    const result = await db
      .delete(videos)
      .where(eq(videos.id, id))
      .returning({ id: videos.id });
    return result.length > 0;
  }
  
  // Testimonial management
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }
  
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial || undefined;
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }
  
  async updateTestimonial(id: number, testimonialData: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set(testimonialData)
      .where(eq(testimonials.id, id))
      .returning();
    return updatedTestimonial || undefined;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning({ id: testimonials.id });
    return result.length > 0;
  }
  
  // Contact message management
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }
  
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }
  
  async updateContactMessage(id: number, messageData: Partial<ContactMessage>): Promise<ContactMessage | undefined> {
    const [updatedMessage] = await db
      .update(contactMessages)
      .set(messageData)
      .where(eq(contactMessages.id, id))
      .returning();
    return updatedMessage || undefined;
  }
  
  async deleteContactMessage(id: number): Promise<boolean> {
    const result = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning({ id: contactMessages.id });
    return result.length > 0;
  }
  
  // Social link management
  async getSocialLinks(): Promise<SocialLink[]> {
    return await db.select().from(socialLinks);
  }
  
  async getSocialLink(id: number): Promise<SocialLink | undefined> {
    const [link] = await db.select().from(socialLinks).where(eq(socialLinks.id, id));
    return link || undefined;
  }
  
  async createSocialLink(link: InsertSocialLink): Promise<SocialLink> {
    const [newLink] = await db
      .insert(socialLinks)
      .values(link)
      .returning();
    return newLink;
  }
  
  async updateSocialLink(id: number, linkData: Partial<SocialLink>): Promise<SocialLink | undefined> {
    const [updatedLink] = await db
      .update(socialLinks)
      .set(linkData)
      .where(eq(socialLinks.id, id))
      .returning();
    return updatedLink || undefined;
  }
  
  async deleteSocialLink(id: number): Promise<boolean> {
    const result = await db
      .delete(socialLinks)
      .where(eq(socialLinks.id, id))
      .returning({ id: socialLinks.id });
    return result.length > 0;
  }
  
  // Donation management
  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations);
  }
  
  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation || undefined;
  }
  
  async getDonationByPaymentId(paymentId: string): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.paymentId, paymentId));
    return donation || undefined;
  }

  async getUserDonations(userId: number): Promise<Donation[]> {
    return db
      .select()
      .from(donations)
      .where(eq(donations.userId, userId))
      .execute();
  }
  
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [result] = await db
      .insert(donations)
      .values(donation)
      .returning();
    return result;
  }
  
  async updateDonation(id: number, donationData: Partial<Donation>): Promise<Donation | undefined> {
    const [updatedDonation] = await db
      .update(donations)
      .set(donationData)
      .where(eq(donations.id, id))
      .returning();
    return updatedDonation || undefined;
  }
  
  async deleteDonation(id: number): Promise<boolean> {
    const result = await db
      .delete(donations)
      .where(eq(donations.id, id))
      .returning({ id: donations.id });
    return result.length > 0;
  }
  
  // Subscription management
  async getSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions);
  }
  
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || undefined;
  }
  
  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.email, email));
    return subscription || undefined;
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }
  
  async updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set(subscriptionData)
      .where(eq(subscriptions.id, id))
      .returning();
    return updatedSubscription || undefined;
  }
  
  async deleteSubscription(id: number): Promise<boolean> {
    const result = await db
      .delete(subscriptions)
      .where(eq(subscriptions.id, id))
      .returning({ id: subscriptions.id });
    return result.length > 0;
  }
}

export const dbStorage = new DatabaseStorage();