import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { DonationCategory } from '@shared/schema';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const Donate = () => {
  const { data: categories = [], isLoading } = useQuery<DonationCategory[]>({
    queryKey: ['/api/donation-categories'],
  });
  
  return (
    <>
      <Helmet>
        <title>Donate - ISKCON Juhu</title>
        <meta name="description" content="Support ISKCON Juhu's initiatives including temple maintenance, food distribution, and spiritual education programs through your generous donations." />
        <meta property="og:title" content="Donate - ISKCON Juhu" />
        <meta property="og:description" content="Support ISKCON Juhu's initiatives through your generous donations. Your contributions help maintain the temple and support our spiritual and community services." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-primary">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-white font-poppins font-bold text-4xl md:text-5xl mb-4">
              Support Our Divine Mission
            </h1>
            <p className="text-white font-opensans text-lg md:text-xl max-w-3xl mx-auto">
              Your generosity enables us to maintain the temple, distribute prasadam to the needy,
              and spread spiritual knowledge throughout society.
            </p>
          </div>
        </section>
        
        {/* Donation Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-primary mb-4">
                Ways to Contribute
              </h2>
              <p className="font-opensans text-lg max-w-2xl mx-auto text-dark">
                Choose from various donation initiatives that resonate with your heart.
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <Skeleton className="w-full h-48" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton key={j} className="h-8 w-16 rounded-full" />
                        ))}
                      </div>
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:transform hover:scale-105"
                  >
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-poppins font-semibold text-xl text-primary mb-2">{category.name}</h3>
                      <p className="font-opensans text-dark mb-4">{category.description}</p>
                      <Link 
                        href={`/donate/${category.id}`}
                        className="w-full bg-primary text-white font-poppins font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors block text-center"
                      >
                        Donate Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Tax Benefits Section */}
        <section className="py-16 bg-neutral">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
              <h2 className="font-poppins font-bold text-2xl md:text-3xl text-primary mb-6 text-center">
                Tax Benefits for Donors
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-poppins font-semibold text-xl mb-2">Tax Exemption Under 80G</h3>
                  <p className="font-opensans text-dark">
                    Donations made to ISKCON Juhu are eligible for tax exemption under Section 80G of the Income Tax Act.
                    You can claim a deduction of 50% of the donation amount from your taxable income.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-poppins font-semibold text-xl mb-2">How to Claim Tax Benefits</h3>
                  <ul className="list-disc list-inside font-opensans text-dark space-y-2">
                    <li>Make sure to provide your PAN details while making the donation</li>
                    <li>Keep the donation receipt safely for your records</li>
                    <li>Claim the deduction while filing your income tax return</li>
                    <li>For online donations, an acknowledgment will be sent to your registered email</li>
                  </ul>
                </div>
                
                <div className="bg-neutral p-4 rounded-lg">
                  <p className="font-opensans text-dark text-sm italic">
                    Note: For specific tax-related queries, we recommend consulting with your tax advisor or chartered accountant.
                    Tax benefits are subject to changes in the Income Tax Act provisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Donate;
