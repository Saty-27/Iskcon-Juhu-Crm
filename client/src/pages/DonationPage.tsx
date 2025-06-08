import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Building, BookOpen, Calendar, ArrowRight } from "lucide-react";
import type { DonationCategory, DonationCard, BankDetails } from "@shared/schema";

interface DonationFormData {
  name: string;
  email: string;
  phone: string;
  amount: number;
  message: string;
  categoryId?: number;
  cardId?: number;
}

export default function DonationPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<DonationCard | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [formData, setFormData] = useState<DonationFormData>({
    name: "",
    email: "",
    phone: "",
    amount: 0,
    message: ""
  });
  const [showBankDetails, setShowBankDetails] = useState(false);

  const { data: categories = [] } = useQuery<DonationCategory[]>({
    queryKey: ["/api/donation-categories"]
  });

  const { data: cards = [] } = useQuery<DonationCard[]>({
    queryKey: ["/api/donation-cards"]
  });

  const { data: bankDetails = [] } = useQuery<BankDetails[]>({
    queryKey: ["/api/bank-details"]
  });

  const categoryCards = selectedCategory 
    ? cards.filter(card => card.categoryId === selectedCategory)
    : [];

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSelectedCard(null);
    setSelectedAmount(null);
    setCustomAmount("");
  };

  const handleCardSelect = (card: DonationCard) => {
    setSelectedCard(card);
    setSelectedAmount(null);
    setCustomAmount("");
    setFormData(prev => ({ ...prev, categoryId: selectedCategory!, cardId: card.id }));
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setFormData(prev => ({ ...prev, amount }));
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount > 0) {
      setSelectedAmount(null);
      setFormData(prev => ({ ...prev, amount }));
    }
  };

  const handleInputChange = (field: keyof DonationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDonateNow = () => {
    if (!formData.amount || formData.amount <= 0) {
      alert("Please select or enter a valid donation amount");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    // Use existing PayU integration
    const paymentData = {
      amount: formData.amount,
      firstname: formData.name,
      email: formData.email,
      phone: formData.phone,
      productinfo: selectedCard ? selectedCard.title : "General Donation",
      surl: `${window.location.origin}/donation-success`,
      furl: `${window.location.origin}/donation-failed`,
      udf1: formData.message || "",
      udf2: selectedCategory?.toString() || "",
      udf3: selectedCard?.id?.toString() || ""
    };

    // Create PayU form and submit
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/payment/initiate';
    form.style.display = 'none';

    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('temple') || name.includes('construction')) return Building;
    if (name.includes('food') || name.includes('prasadam')) return Heart;
    if (name.includes('education') || name.includes('school')) return BookOpen;
    if (name.includes('event') || name.includes('festival')) return Calendar;
    return Users;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Our Noble Cause</h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
            Your generous donations help us spread Krishna consciousness and serve the community
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Step 1: Choose Category */}
        {!selectedCategory && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Choose a Donation Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category.name);
                return (
                  <Card 
                    key={category.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-orange-300"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <IconComponent className="h-12 w-12 text-orange-600" />
                      </div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {category.description && (
                        <p className="text-gray-600 text-center">{category.description}</p>
                      )}
                      {category.heading && (
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                          <p className="text-orange-800 font-medium text-center">{category.heading}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Choose Donation Card */}
        {selectedCategory && !selectedCard && (
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(null)}
                className="text-orange-600 hover:text-orange-800"
              >
                ← Back to Categories
              </Button>
            </div>
            
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Select Your Donation
            </h2>
            
            {categoryCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryCards.map((card) => (
                  <Card 
                    key={card.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-orange-300"
                    onClick={() => handleCardSelect(card)}
                  >
                    <CardHeader>
                      <img 
                        src={card.imageUrl} 
                        alt={card.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <CardTitle className="text-xl">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{card.description}</p>
                      {card.suggestedAmounts && card.suggestedAmounts.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-medium text-orange-800">Suggested Amounts:</p>
                          <div className="flex flex-wrap gap-2">
                            {card.suggestedAmounts.map((amount) => (
                              <span 
                                key={amount}
                                className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                              >
                                ₹{amount.toLocaleString()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No donation cards available for this category.</p>
                <Button 
                  onClick={() => {
                    const generalCard: DonationCard = {
                      id: 0,
                      categoryId: selectedCategory,
                      title: "General Donation",
                      description: "Support our general temple activities",
                      imageUrl: "/api/placeholder/400/300",
                      suggestedAmounts: [500, 1000, 2500, 5000],
                      isActive: true,
                      order: 0
                    };
                    handleCardSelect(generalCard);
                  }}
                  className="mt-4 bg-orange-600 hover:bg-orange-700"
                >
                  Proceed with General Donation
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Donation Form */}
        {selectedCard && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCard(null)}
                className="text-orange-600 hover:text-orange-800"
              >
                ← Back to Donations
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Donation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Complete Your Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Card Info */}
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-orange-800 mb-2">{selectedCard.title}</h3>
                    <p className="text-orange-700 text-sm">{selectedCard.description}</p>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-medium">Choose Amount</Label>
                    {selectedCard.suggestedAmounts && selectedCard.suggestedAmounts.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {selectedCard.suggestedAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => handleAmountSelect(amount)}
                            className={selectedAmount === amount ? "bg-orange-600 hover:bg-orange-700" : "border-orange-300 hover:border-orange-500"}
                          >
                            ₹{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter amount in ₹"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Personal Information</h4>
                    
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Add a personal message with your donation"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Donation Summary & Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Donation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Donation Category:</span>
                      <span className="font-medium">
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Donation Type:</span>
                      <span className="font-medium">{selectedCard.title}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-3">
                      <span>Total Amount:</span>
                      <span className="text-orange-600">
                        ₹{formData.amount > 0 ? formData.amount.toLocaleString() : "0"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleDonateNow}
                      disabled={!formData.amount || formData.amount <= 0 || !formData.name || !formData.email || !formData.phone}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                    >
                      Donate Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowBankDetails(!showBankDetails)}
                      className="w-full border-orange-300 hover:border-orange-500"
                    >
                      {showBankDetails ? "Hide" : "Show"} Bank Transfer Details
                    </Button>
                  </div>

                  {/* Bank Details */}
                  {showBankDetails && bankDetails.length > 0 && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">Bank Transfer Details</h4>
                      {bankDetails.map((detail) => (
                        <div key={detail.id} className="text-sm space-y-1">
                          <p><strong>Bank Name:</strong> {detail.bankName}</p>
                          <p><strong>Account Name:</strong> {detail.accountName}</p>
                          <p><strong>Account Number:</strong> {detail.accountNumber}</p>
                          <p><strong>IFSC Code:</strong> {detail.ifscCode}</p>
                          {detail.upiId && <p><strong>UPI ID:</strong> {detail.upiId}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-gray-600 space-y-2">
                    <p>🔒 Your donation is secure and encrypted</p>
                    <p>📧 You will receive an email receipt</p>
                    <p>🙏 Thank you for supporting our mission</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}