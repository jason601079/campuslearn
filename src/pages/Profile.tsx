import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Bell,
  Shield,
  Camera,
  Save,
  Edit,
} from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Student',
    email: 'john@campus.edu',
    phone: '+1 (555) 123-4567',
    bio: 'Computer Science major with a passion for mathematics and tutoring fellow students.',
    campus: 'University of Technology',
    year: 'Junior',
    major: 'Computer Science',
    location: 'Campus Dormitory Block A'
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    },
    theme: 'system'
  });

  const stats = [
    { label: 'Courses Enrolled', value: '8', icon: BookOpen },
    { label: 'Study Sessions', value: '24', icon: Calendar },
    { label: 'Forum Posts', value: '156', icon: User },
    { label: 'Hours Studied', value: '42h', icon: BookOpen },
  ];

  const achievements = [
    { name: 'Top Contributor', description: 'Active forum participant', color: 'bg-primary' },
    { name: 'Study Streak', description: '30 days straight', color: 'bg-secondary' },
    { name: 'Peer Helper', description: 'Helped 10+ students', color: 'bg-success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src="/api/placeholder/96/96" alt="Profile" />
                  <AvatarFallback className="text-2xl">JS</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mt-4">{profileData.name}</h2>
              <p className="text-muted-foreground">{profileData.major}</p>
              <p className="text-sm text-muted-foreground">{profileData.campus}</p>
              
              <div className="flex justify-center mt-4">
                <Badge variant="secondary">{profileData.year}</Badge>
              </div>
              
              <Separator className="my-4" />
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="flex justify-center mb-1">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="font-semibold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              {/* Achievements */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Achievements</h4>
                {achievements.map((achievement) => (
                  <div key={achievement.name} className="flex items-center space-x-2 text-left">
                    <div className={`w-2 h-2 rounded-full ${achievement.color}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and bio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year</Label>
                      <Select value={profileData.year} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Freshman">Freshman</SelectItem>
                          <SelectItem value="Sophomore">Sophomore</SelectItem>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself..."
                      value={profileData.bio}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campus">Campus</Label>
                      <Input 
                        id="campus" 
                        value={profileData.campus}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, campus: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major</Label>
                      <Input 
                        id="major" 
                        value={profileData.major}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, major: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => 
                          setSettings({
                            ...settings, 
                            notifications: {...settings.notifications, email: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified in your browser</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => 
                          setSettings({
                            ...settings, 
                            notifications: {...settings.notifications, push: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Important updates via SMS</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => 
                          setSettings({
                            ...settings, 
                            notifications: {...settings.notifications, sms: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">Tips, news, and feature updates</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.marketing}
                        onCheckedChange={(checked) => 
                          setSettings({
                            ...settings, 
                            notifications: {...settings.notifications, marketing: checked}
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Control your privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Visibility</Label>
                      <Select value={settings.privacy.profileVisibility}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="campus">Campus Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Email Address</Label>
                        <p className="text-sm text-muted-foreground">Let others see your email</p>
                      </div>
                      <Switch 
                        checked={settings.privacy.showEmail}
                        onCheckedChange={(checked) => 
                          setSettings({
                            ...settings, 
                            privacy: {...settings.privacy, showEmail: checked}
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Phone Number</Label>
                        <p className="text-sm text-muted-foreground">Make your phone visible to others</p>
                      </div>
                      <Switch 
                        checked={settings.privacy.showPhone}
                        onCheckedChange={(checked) => 
                          setSettings({
                            ...settings, 
                            privacy: {...settings.privacy, showPhone: checked}
                          })
                        }
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Account Actions</h4>
                    <div className="flex space-x-2">
                      <Button variant="outline">Change Password</Button>
                      <Button variant="outline">Two-Factor Auth</Button>
                    </div>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}