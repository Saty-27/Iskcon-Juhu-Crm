import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { login, isAuthenticated, user, isPendingLogin } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check for redirect parameter in URL
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('redirect');
      
      if (redirectPath) {
        // If there's a redirect parameter, use it
        setLocation(redirectPath);
      } else {
        // Otherwise redirect based on user role
        if (user && user.role === 'admin') {
          setLocation('/admin');
        } else {
          setLocation('/profile');
        }
      }
    }
  }, [isAuthenticated, user, setLocation]);
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Login - ISKCON Juhu</title>
        <meta name="description" content="Log in to your ISKCON Juhu account to manage your donations and profile information." />
        <meta property="og:title" content="Login - ISKCON Juhu" />
        <meta property="og:description" content="Log in to your ISKCON Juhu account." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <main>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
              <h1 className="font-poppins font-bold text-2xl md:text-3xl text-primary mb-6 text-center">
                Login to Your Account
              </h1>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark font-medium">Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username" 
                            {...field} 
                            className="focus:ring-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-dark font-medium">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter your password" 
                            {...field} 
                            className="focus:ring-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-white font-poppins font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    disabled={isPendingLogin}
                  >
                    {isPendingLogin ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center">
                <p className="font-opensans text-dark">
                  Don't have an account? {' '}
                  <Link href="/register">
                    <a className="text-primary hover:text-secondary font-medium">Register</a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
