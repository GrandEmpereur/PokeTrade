'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  Wallet,
  Copy,
  ExternalLink,
  RefreshCw,
  ArrowDownUp,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Plus,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'mint' | 'trade';
  amount: string;
  symbol: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  from?: string;
  to?: string;
  hash?: string;
}

interface NFT {
  id: string;
  name: string;
  image: string;
  description?: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
  tokenId: string;
  contractAddress: string;
}

export default function WalletPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState({
    coins: 0,
    eth: '0.00',
  });
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Récupérer l'utilisateur et ses données
  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true);
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.error("Erreur d'authentification:", error);
          setIsLoading(false);
          return;
        }

        setUserId(user.id);

        // Récupérer les données du wallet (simulées)
        setTimeout(() => {
          // Simuler le portefeuille ETH et le solde
          setBalance({
            coins: 2450,
            eth: '0.0432',
          });

          // Simuler les transactions
          setTransactions([
            {
              id: 'tx1',
              type: 'receive',
              amount: '0.01',
              symbol: 'ETH',
              status: 'completed',
              timestamp: '2023-06-15T12:30:45Z',
              from: '0x1234...5678',
              to: '0xABCD...EF01',
              hash: '0xabcdef1234567890abcdef1234567890',
            },
            {
              id: 'tx2',
              type: 'mint',
              amount: '1',
              symbol: 'NFT',
              status: 'completed',
              timestamp: '2023-06-14T09:15:30Z',
              hash: '0x0987654321fedcba0987654321fedcba',
            },
            {
              id: 'tx3',
              type: 'send',
              amount: '0.005',
              symbol: 'ETH',
              status: 'completed',
              timestamp: '2023-06-12T18:45:22Z',
              from: '0xABCD...EF01',
              to: '0x5678...1234',
              hash: '0xfedcba9876543210fedcba9876543210',
            },
            {
              id: 'tx4',
              type: 'trade',
              amount: '50',
              symbol: 'COIN',
              status: 'completed',
              timestamp: '2023-06-10T14:20:15Z',
            },
            {
              id: 'tx5',
              type: 'swap',
              amount: '0.02',
              symbol: 'ETH',
              status: 'pending',
              timestamp: '2023-06-16T11:05:08Z',
              hash: '0x123456789abcdef123456789abcdef12',
            },
          ]);

          // Simuler les NFTs
          setNFTs([
            {
              id: 'nft1',
              name: 'Pikachu #42',
              image:
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
              description:
                'Un Pikachu unique avec des caractéristiques spéciales.',
              attributes: [
                { trait_type: 'Rareté', value: 'Rare' },
                { trait_type: 'Type', value: 'Électrique' },
                { trait_type: 'Niveau', value: '25' },
              ],
              tokenId: '42',
              contractAddress: '0x1234567890abcdef1234567890abcdef',
            },
            {
              id: 'nft2',
              name: 'Charizard #007',
              image:
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
              description:
                'Un Charizard épique avec une puissance de feu dévastatrice.',
              attributes: [
                { trait_type: 'Rareté', value: 'Épique' },
                { trait_type: 'Type', value: 'Feu/Vol' },
                { trait_type: 'Niveau', value: '36' },
              ],
              tokenId: '007',
              contractAddress: '0x1234567890abcdef1234567890abcdef',
            },
            {
              id: 'nft3',
              name: 'Mewtwo #150',
              image:
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
              description:
                'Un Mewtwo légendaire avec des pouvoirs psychiques inégalés.',
              attributes: [
                { trait_type: 'Rareté', value: 'Légendaire' },
                { trait_type: 'Type', value: 'Psy' },
                { trait_type: 'Niveau', value: '70' },
              ],
              tokenId: '150',
              contractAddress: '0x1234567890abcdef1234567890abcdef',
            },
          ]);

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  // Connecter le wallet MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts.length > 0) {
          setEthAddress(accounts[0]);
          setIsWalletConnected(true);
          toast.success('Wallet connecté avec succès');
        }
      } else {
        toast.error("MetaMask n'est pas installé");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
      toast.error('Erreur lors de la connexion du wallet');
    }
  };

  // Copier l'adresse du wallet
  const copyWalletAddress = () => {
    if (ethAddress) {
      navigator.clipboard.writeText(ethAddress);
      setCopiedAddress(true);
      toast.success('Adresse copiée');
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // Ouvrir Etherscan
  const openEtherscan = (hash?: string) => {
    if (hash) {
      window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
    } else if (ethAddress) {
      window.open(
        `https://sepolia.etherscan.io/address/${ethAddress}`,
        '_blank'
      );
    }
  };

  // Formatter l'adresse Ethereum
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Afficher la date formatée
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-40 bg-muted rounded mb-4"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold">Mon Portefeuille</h1>
          {ethAddress ? (
            <div className="flex items-center mt-2 md:mt-0 space-x-2 p-2 bg-muted rounded-md">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono">
                {formatAddress(ethAddress)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={copyWalletAddress}
              >
                {copiedAddress ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => openEtherscan()}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} className="mt-2 md:mt-0">
              <Wallet className="h-4 w-4 mr-2" />
              Connecter le Wallet
            </Button>
          )}
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="nfts">Mes NFTs</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image
                      src="/pokecoin.png"
                      alt="PokéCoin"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    PokéCoins
                  </CardTitle>
                  <CardDescription>
                    Votre balance de coins pour les transactions dans
                    l'application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {balance.coins.toLocaleString()}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="w-1/2">
                    <Plus className="h-4 w-4 mr-2" />
                    Acheter
                  </Button>
                  <Button variant="outline" className="w-1/2 ml-2">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image
                      src="/ethereum.png"
                      alt="Ethereum"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    Ethereum
                  </CardTitle>
                  <CardDescription>
                    Balance ETH sur le réseau Sepolia (testnet)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{balance.eth} ETH</div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="w-1/2"
                    onClick={ethAddress ? copyWalletAddress : connectWallet}
                  >
                    {ethAddress ? (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copier l'adresse
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Connecter
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/2 ml-2"
                    onClick={() => openEtherscan()}
                    disabled={!ethAddress}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Explorer
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Activité récente */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Activité récente</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Actualiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 3).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div className="flex items-center">
                        <div
                          className={`flex items-center justify-center h-10 w-10 rounded-full ${
                            tx.type === 'receive'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : tx.type === 'send'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : tx.type === 'mint'
                                  ? 'bg-purple-100 dark:bg-purple-900/30'
                                  : tx.type === 'swap'
                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                    : 'bg-orange-100 dark:bg-orange-900/30'
                          }`}
                        >
                          {tx.type === 'receive' && (
                            <ArrowDownUp className="h-5 w-5 text-green-500" />
                          )}
                          {tx.type === 'send' && (
                            <Send className="h-5 w-5 text-red-500" />
                          )}
                          {tx.type === 'mint' && (
                            <Plus className="h-5 w-5 text-purple-500" />
                          )}
                          {tx.type === 'swap' && (
                            <RefreshCw className="h-5 w-5 text-blue-500" />
                          )}
                          {tx.type === 'trade' && (
                            <ArrowDownUp className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium capitalize">
                            {tx.type === 'receive'
                              ? 'Réception'
                              : tx.type === 'send'
                                ? 'Envoi'
                                : tx.type === 'mint'
                                  ? 'Mint NFT'
                                  : tx.type === 'swap'
                                    ? 'Échange'
                                    : 'Trade Pokémon'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(tx.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            tx.type === 'receive'
                              ? 'text-green-500'
                              : tx.type === 'send'
                                ? 'text-red-500'
                                : ''
                          }`}
                        >
                          {tx.type === 'receive'
                            ? '+'
                            : tx.type === 'send'
                              ? '-'
                              : ''}
                          {tx.amount} {tx.symbol}
                        </div>
                        <div className="flex items-center justify-end mt-1">
                          {tx.status === 'completed' && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Complété
                            </Badge>
                          )}
                          {tx.status === 'pending' && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              En cours
                            </Badge>
                          )}
                          {tx.status === 'failed' && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Échoué
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setActiveTab('transactions')}
                >
                  Voir toutes les transactions
                </Button>
              </CardFooter>
            </Card>

            {/* NFTs preview */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Mes NFTs</CardTitle>
                <CardDescription>
                  Collection de NFTs Pokémon que vous possédez
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {nfts.slice(0, 3).map((nft) => (
                    <div
                      key={nft.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="relative aspect-square bg-muted">
                        <Image
                          src={nft.image}
                          alt={nft.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold">{nft.name}</h3>
                        <div className="flex mt-2">
                          {nft.attributes?.slice(0, 2).map((attr, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="mr-1 text-xs"
                            >
                              {attr.trait_type}: {attr.value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setActiveTab('nfts')}
                >
                  Voir tous mes NFTs
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="nfts">
            <Card>
              <CardHeader>
                <CardTitle>Mes Pokémon NFTs</CardTitle>
                <CardDescription>
                  Collection de NFTs Pokémon uniques que vous possédez
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {nfts.map((nft) => (
                    <Card key={nft.id} className="overflow-hidden">
                      <div className="relative aspect-square bg-muted">
                        <Image
                          src={nft.image}
                          alt={nft.name}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{nft.name}</CardTitle>
                        <CardDescription className="text-xs truncate">
                          Token ID: {nft.tokenId}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0">
                        <p className="text-sm text-muted-foreground">
                          {nft.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {nft.attributes?.map((attr, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {attr.trait_type}: {attr.value}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-1" />
                          Transférer
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Explorer
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
                <CardDescription>
                  Toutes vos transactions récentes, y compris les transferts,
                  les mints et les swaps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full pr-4">
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex flex-col md:flex-row justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-start">
                          <div
                            className={`flex items-center justify-center h-10 w-10 rounded-full ${
                              tx.type === 'receive'
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : tx.type === 'send'
                                  ? 'bg-red-100 dark:bg-red-900/30'
                                  : tx.type === 'mint'
                                    ? 'bg-purple-100 dark:bg-purple-900/30'
                                    : tx.type === 'swap'
                                      ? 'bg-blue-100 dark:bg-blue-900/30'
                                      : 'bg-orange-100 dark:bg-orange-900/30'
                            }`}
                          >
                            {tx.type === 'receive' && (
                              <ArrowDownUp className="h-5 w-5 text-green-500" />
                            )}
                            {tx.type === 'send' && (
                              <Send className="h-5 w-5 text-red-500" />
                            )}
                            {tx.type === 'mint' && (
                              <Plus className="h-5 w-5 text-purple-500" />
                            )}
                            {tx.type === 'swap' && (
                              <RefreshCw className="h-5 w-5 text-blue-500" />
                            )}
                            {tx.type === 'trade' && (
                              <ArrowDownUp className="h-5 w-5 text-orange-500" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium capitalize">
                              {tx.type === 'receive'
                                ? 'Réception'
                                : tx.type === 'send'
                                  ? 'Envoi'
                                  : tx.type === 'mint'
                                    ? 'Mint NFT'
                                    : tx.type === 'swap'
                                      ? 'Échange'
                                      : 'Trade Pokémon'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(tx.timestamp)}
                            </div>
                            {(tx.from || tx.to) && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {tx.from && (
                                  <div>De: {formatAddress(tx.from)}</div>
                                )}
                                {tx.to && <div>À: {formatAddress(tx.to)}</div>}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end mt-2 md:mt-0">
                          <div
                            className={`font-medium ${
                              tx.type === 'receive'
                                ? 'text-green-500'
                                : tx.type === 'send'
                                  ? 'text-red-500'
                                  : ''
                            }`}
                          >
                            {tx.type === 'receive'
                              ? '+'
                              : tx.type === 'send'
                                ? '-'
                                : ''}
                            {tx.amount} {tx.symbol}
                          </div>

                          <div className="flex items-center mt-1">
                            {tx.status === 'completed' && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Complété
                              </Badge>
                            )}
                            {tx.status === 'pending' && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                En cours
                              </Badge>
                            )}
                            {tx.status === 'failed' && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Échoué
                              </Badge>
                            )}
                          </div>

                          {tx.hash && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-7 text-xs"
                              onClick={() => openEtherscan(tx.hash)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Voir sur Etherscan
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
