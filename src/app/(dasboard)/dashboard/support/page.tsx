import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  HelpCircle,
  FileText,
  Search,
  BookOpen
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SupportPage() {
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
                  Support
                </h1>
                <p className="text-muted-foreground">
                  Besoin d'aide ? Consultez notre centre de support ou contactez-nous directement.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
                {/* Carte 1 - Contact */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                      Contact direct
                    </CardTitle>
                    <CardDescription>Contactez notre équipe pour une assistance personnalisée</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>support@poketrade.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>+33 1 23 45 67 89</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Disponible du lundi au vendredi, de 9h à 18h (CET)
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Commencer un chat
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Carte 2 - FAQ */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                      FAQ
                    </CardTitle>
                    <CardDescription>Réponses aux questions fréquemment posées</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher dans la FAQ..."
                        className="pl-8"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Questions les plus consultées
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Voir toutes les questions
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Carte 3 - Documentation */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Documentation
                    </CardTitle>
                    <CardDescription>Guides détaillés et tutoriels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="rounded-md bg-secondary/50 p-2">
                      <p className="text-sm font-medium">Guide du débutant</p>
                      <p className="text-xs text-muted-foreground">Tout ce que vous devez savoir pour commencer</p>
                    </div>
                    <div className="rounded-md bg-secondary/50 p-2">
                      <p className="text-sm font-medium">Trading de cartes</p>
                      <p className="text-xs text-muted-foreground">Comment échanger et négocier efficacement</p>
                    </div>
                    <div className="rounded-md bg-secondary/50 p-2">
                      <p className="text-sm font-medium">Évaluation des cartes</p>
                      <p className="text-xs text-muted-foreground">Comprendre la valeur de votre collection</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Voir toute la documentation
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Questions fréquemment posées</CardTitle>
                    <CardDescription>Trouvez rapidement des réponses à vos questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Comment puis-je ajouter des cartes à ma collection ?</AccordionTrigger>
                        <AccordionContent>
                          Pour ajouter des cartes à votre collection, rendez-vous dans la section "Ma Collection" et cliquez sur le bouton "Ajouter une carte". Vous pouvez ensuite rechercher la carte que vous souhaitez ajouter par son nom, son numéro ou en scannant le code QR. Remplissez les informations demandées (état, édition, etc.) et validez l'ajout.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Comment fonctionne le système d'évaluation des cartes ?</AccordionTrigger>
                        <AccordionContent>
                          Notre système d'évaluation prend en compte plusieurs facteurs : la rareté de la carte, son état, l'édition, les tendances du marché et les ventes récentes. Les prix sont mis à jour quotidiennement en fonction des données du marché. Pour une évaluation plus précise, vous pouvez demander une expertise professionnelle via la section "Services".
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Comment effectuer un échange sécurisé avec un autre collectionneur ?</AccordionTrigger>
                        <AccordionContent>
                          Pour réaliser un échange sécurisé, utilisez notre système intégré d'échange. Accédez à la section "Trading", sélectionnez les cartes que vous souhaitez échanger et celles que vous recherchez. Une fois l'accord trouvé avec un autre utilisateur, notre système d'escrow sécurise la transaction jusqu'à ce que les deux parties confirment la bonne réception des cartes.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Comment signaler un problème avec une transaction ?</AccordionTrigger>
                        <AccordionContent>
                          Si vous rencontrez un problème avec une transaction, rendez-vous dans la section "Historique" et trouvez la transaction concernée. Cliquez sur "Signaler un problème" et décrivez en détail la situation. Notre équipe de support prendra en charge votre demande dans les 24 heures. Vous pouvez également contacter directement notre support via le chat ou par email.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-5">
                        <AccordionTrigger>Comment fonctionne le système de portefeuille et de paiement ?</AccordionTrigger>
                        <AccordionContent>
                          Notre plateforme propose plusieurs options de paiement : carte bancaire, PayPal, et cryptomonnaies (Bitcoin, Ethereum). Vous pouvez gérer vos méthodes de paiement et consulter l'historique dans la section "Paramètres" > "Paiement". Pour les transactions entre utilisateurs, notre système d'escrow retient le paiement jusqu'à confirmation de la réception par l'acheteur, garantissant la sécurité des deux parties.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
              
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nous contacter</CardTitle>
                    <CardDescription>Envoyez-nous un message et nous vous répondrons dans les plus brefs délais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" placeholder="Votre nom" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Votre email" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Sujet</SelectLabel>
                            <SelectItem value="account">Problème de compte</SelectItem>
                            <SelectItem value="payment">Problème de paiement</SelectItem>
                            <SelectItem value="order">Problème de commande</SelectItem>
                            <SelectItem value="exchange">Problème d'échange</SelectItem>
                            <SelectItem value="valuation">Évaluation de carte</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez votre problème ou votre question en détail..."
                        className="min-h-[150px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="attachments">Pièces jointes (optionnel)</Label>
                      <Input id="attachments" type="file" />
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés : JPG, PNG, PDF. Taille maximale : 10 Mo
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 