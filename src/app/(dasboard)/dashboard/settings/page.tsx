import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Wallet,
  Languages,
  Palette,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold tracking-tight">
                  Paramètres
                </h1>
                <p className="text-muted-foreground">
                  Gérez vos préférences, votre profil et vos paramètres de
                  compte.
                </p>
              </div>

              <div className="px-4 lg:px-6">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="mb-6 grid w-full grid-cols-5">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="security">Sécurité</TabsTrigger>
                    <TabsTrigger value="notifications">
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="payment">Paiement</TabsTrigger>
                    <TabsTrigger value="appearance">Apparence</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informations du profil</CardTitle>
                        <CardDescription>
                          Modifiez vos informations personnelles affichées aux
                          autres utilisateurs
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex flex-col gap-6 md:flex-row">
                          <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24">
                              <AvatarImage
                                src="/avatars/placeholder.jpg"
                                alt="Avatar"
                              />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Changer l'avatar</Button>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="name">Nom d'affichage</Label>
                                <Input
                                  id="name"
                                  placeholder="Votre nom"
                                  defaultValue="John Doe"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="username">
                                  Nom d'utilisateur
                                </Label>
                                <Input
                                  id="username"
                                  placeholder="Nom d'utilisateur"
                                  defaultValue="johndoe"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="Votre email"
                                defaultValue="john.doe@example.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Input
                                id="bio"
                                placeholder="Votre bio"
                                defaultValue="Collectionneur de cartes Pokémon depuis 2010. Spécialisé dans les cartes rares et holographiques."
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button>
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Sécurité</CardTitle>
                        <CardDescription>
                          Gérez vos paramètres de sécurité et de confidentialité
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">
                              Mot de passe actuel
                            </Label>
                            <Input
                              id="current-password"
                              type="password"
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">
                              Nouveau mot de passe
                            </Label>
                            <Input
                              id="new-password"
                              type="password"
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">
                              Confirmer le mot de passe
                            </Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Authentification à deux facteurs
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Authentification par SMS</p>
                              <p className="text-sm text-muted-foreground">
                                Recevez un code de vérification par SMS
                              </p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Authentification par application</p>
                              <p className="text-sm text-muted-foreground">
                                Utilisez une application d'authentification
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Notifications de connexion</p>
                              <p className="text-sm text-muted-foreground">
                                Recevez un email lors d'une nouvelle connexion
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button>Enregistrer</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                          Configurez les notifications que vous souhaitez
                          recevoir
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Email</h3>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Offres et promotions</p>
                              <p className="text-sm text-muted-foreground">
                                Recevez des offres spéciales et des promotions
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Alertes de prix</p>
                              <p className="text-sm text-muted-foreground">
                                Soyez informé des changements de prix sur votre
                                wishlist
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Nouvelles cartes</p>
                              <p className="text-sm text-muted-foreground">
                                Soyez informé des nouvelles sorties et
                                extensions
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Application</h3>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Notifications push</p>
                              <p className="text-sm text-muted-foreground">
                                Activez les notifications push sur votre
                                appareil
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Sons de notification</p>
                              <p className="text-sm text-muted-foreground">
                                Activez les sons pour les notifications
                              </p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button>Enregistrer</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="payment">
                    <Card>
                      <CardHeader>
                        <CardTitle>Méthodes de paiement</CardTitle>
                        <CardDescription>
                          Gérez vos méthodes de paiement et vos préférences
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Cartes enregistrées
                          </h3>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  Visa se terminant par 4242
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Expire le 12/2025
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button variant="outline" size="sm">
                                Supprimer
                              </Button>
                            </div>
                          </div>
                          <Button variant="outline">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Ajouter une carte
                          </Button>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Portefeuilles crypto
                          </h3>
                          <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                <Wallet className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium">Ethereum (ETH)</p>
                                <p className="text-sm text-muted-foreground">
                                  0x1a2b3c4d5e6f...
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button variant="outline" size="sm">
                                Supprimer
                              </Button>
                            </div>
                          </div>
                          <Button variant="outline">
                            <Wallet className="mr-2 h-4 w-4" />
                            Connecter un portefeuille
                          </Button>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button>Enregistrer</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="appearance">
                    <Card>
                      <CardHeader>
                        <CardTitle>Apparence</CardTitle>
                        <CardDescription>
                          Personnalisez l'apparence de votre application
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="theme">Thème</Label>
                            <Select defaultValue="system">
                              <SelectTrigger id="theme">
                                <SelectValue placeholder="Sélectionnez un thème" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Thème</SelectLabel>
                                  <SelectItem value="light">Clair</SelectItem>
                                  <SelectItem value="dark">Sombre</SelectItem>
                                  <SelectItem value="system">
                                    Système
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="language">Langue</Label>
                            <Select defaultValue="fr">
                              <SelectTrigger id="language">
                                <SelectValue placeholder="Sélectionnez une langue" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Langue</SelectLabel>
                                  <SelectItem value="fr">Français</SelectItem>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Español</SelectItem>
                                  <SelectItem value="de">Deutsch</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            Préférences d'affichage
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Mode compact</p>
                              <p className="text-sm text-muted-foreground">
                                Affiche plus d'éléments sur l'écran
                              </p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Animations</p>
                              <p className="text-sm text-muted-foreground">
                                Active les animations dans l'interface
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p>Afficher les prix en €</p>
                              <p className="text-sm text-muted-foreground">
                                Affiche les prix en euros plutôt qu'en dollars
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button>Enregistrer</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
