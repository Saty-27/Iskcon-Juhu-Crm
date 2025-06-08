import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Users, Building, BookOpen, Calendar, CreditCard, Building2 } from "lucide-react";
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

const categoryIcons = {
  1: Building, // Temple Renovation
  2: Users,    // Anna Seva
  3: BookOpen, // Education
  4: Calendar, // Festivals
  5: Heart     // Deity Worship
};

export default function DonationPage() {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(id ? parseInt(id) : null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("online");
  const [formData, setFormData] = useState<DonationFormData>({
    name: "",
    email: "",
    phone: "",
    amount: 0,
    message: ""
  });

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

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setFormData(prev => ({ ...prev, amount }));
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const amount = parseInt(value);
    if (!isNaN(amount)) {
      setSelectedAmount(amount);
      setFormData(prev => ({ ...prev, amount }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedAmount || !formData.name || !formData.email || !formData.phone) {
      alert("Please fill all required fields");
      return;
    }

    if (paymentMethod === "online") {
      // Redirect to PayU payment gateway
      window.location.href = "/donate/payment-gateway";
    } else {
      // Show bank details for manual transfer
      alert("Please transfer the amount using the bank details shown below and share the transaction details with us.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">Support Our Mission</h1>
          <p className="text-lg text-gray-600">Your generous donation helps us serve the community and spread spiritual knowledge</p>
        </div>

        {!selectedCategory ? (
          // Category Selection
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Choose a Donation Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Heart;
                  return (
                    <Card 
                      key={category.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-300"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <Icon className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                        <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Donation Form
          <div className="space-y-6">
            {/* Selected Category Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {(() => {
                      const Icon = categoryIcons[selectedCategory as keyof typeof categoryIcons] || Heart;
                      return <Icon className="w-8 h-8 text-orange-600" />;
                    })()}
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </h2>
                      <p className="text-gray-600">
                        {categories.find(c => c.id === selectedCategory)?.description}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCategory(null)}
                    className="shrink-0"
                  >
                    Change Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Donation Cards */}
            {categoryCards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Choose a Specific Cause</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryCards.map((card) => (
                      <Card 
                        key={card.id}
                        className={`cursor-pointer transition-all duration-200 border-2 ${
                          selectedAmount === card.amount 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'hover:border-orange-300'
                        }`}
                        onClick={() => handleAmountSelect(card.amount)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{card.title}</h3>
                            <span className="text-xl font-bold text-orange-600">
                              ₹{card.amount.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{card.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amount Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Donation Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[500, 1000, 2500, 5000].map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amount)}
                      className={selectedAmount === amount ? "bg-orange-600 hover:bg-orange-700" : ""}
                    >
                      ₹{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
                
                <div>
                  <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {selectedAmount && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-lg font-semibold text-orange-800">
                      Donation Amount: ₹{selectedAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Donor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Share your thoughts or special instructions"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="w-4 h-4" />
                      <span>Online Payment (Credit/Debit Card, UPI, Net Banking)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center space-x-2 cursor-pointer">
                      <Building2 className="w-4 h-4" />
                      <span>Bank Transfer</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "bank" && bankDetails.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Bank Transfer Details</h4>
                    {bankDetails.map((detail) => (
                      <div key={detail.id} className="space-y-1 text-sm">
                        <p><strong>Bank Name:</strong> {detail.bankName}</p>
                        <p><strong>Account Name:</strong> {detail.accountName}</p>
                        <p><strong>Account Number:</strong> {detail.accountNumber}</p>
                        <p><strong>IFSC Code:</strong> {detail.ifscCode}</p>
                        {detail.swiftCode && <p><strong>SWIFT Code:</strong> {detail.swiftCode}</p>}
                      </div>
                    ))}
                    <p className="text-orange-600 text-sm mt-3">
                      After transfer, please email us the transaction details at donations@iskconjuhu.org
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                  disabled={!selectedAmount || !formData.name || !formData.email || !formData.phone}
                >
                  {paymentMethod === "online" ? "Proceed to Payment" : "Complete Donation"}
                </Button>
                
                <div className="text-center text-sm text-gray-600 mt-4 space-y-1">
                  <p>🔒 Your donation is secure and encrypted</p>
                  <p>📧 You will receive an email receipt</p>
                  <p>🙏 Thank you for supporting our mission</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}