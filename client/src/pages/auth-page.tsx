import { useState } from "react";
import { Redirect, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Music } from "lucide-react";

// Define validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  const { isLoading: isUserLoading } = useQuery<any>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          if (res.status === 401) {
            return null;
          }
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        setCurrentUser(data);
        return data;
      } catch (error) {
        // Not authenticated
        return null;
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiRequest("POST", "/api/login", data);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: "Welcome back to Harmny!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterFormValues, "confirmPassword">) => {
      const { confirmPassword, ...registerData } = data as RegisterFormValues;
      const res = await apiRequest("POST", "/api/register", registerData);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: "Welcome to Harmny!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create your account",
        variant: "destructive",
      });
    },
  });

  // Set up forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData as any);
  };

  // If user is already logged in, redirect to home
  if (currentUser && !isUserLoading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="harmny_lover" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Join Harmny to start streaming and sharing music
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="harmny_lover" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending
                          ? "Creating account..."
                          : "Register"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary/20 items-center justify-center">
        <div className="max-w-md text-center p-8">
          <div className="mb-8 text-white">
            <Music className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Harmny</h1>
            <p className="text-xl mb-6">
              Your personal music streaming platform
            </p>
            <div className="space-y-4 text-left">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold">Upload your own music</h3>
                <p className="text-sm opacity-80">
                  Share your creations with the world
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold">Create custom playlists</h3>
                <p className="text-sm opacity-80">
                  Organize your music just the way you like
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold">Seamless playback</h3>
                <p className="text-sm opacity-80">
                  Enjoy high-quality streaming anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}