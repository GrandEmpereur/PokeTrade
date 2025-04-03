'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PaymentNFTAbi from '@/abis/PaymentNFT.abi.json';
import { Button } from './ui/button';
import {
  AlertCircle,
  CheckCircle2,
  Wallet,
  Loader2,
  ArrowUpRight,
  Info,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';

type MintStatus =
  | 'idle'
  | 'connecting'
  | 'checking'
  | 'minting'
  | 'confirming'
  | 'success'
  | 'error'
  | 'insufficient_funds';

export function MintButton() {
  const [status, setStatus] = useState<MintStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState<string>('');
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

  const NFT_PRICE_ETH = 0.01;
  const ESTIMATED_GAS = 0.002; // Estimation approximative pour le gas
  const REQUIRED_ETH = NFT_PRICE_ETH + ESTIMATED_GAS;

  // Vérifier si MetaMask est installé et récupérer le solde dès le chargement
  useEffect(() => {
    const checkWalletStatus = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Vérifier si des comptes sont déjà connectés
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(accounts[0]);
            setBalance(ethers.formatEther(balance));
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du wallet:', error);
        }
      } else {
        setIsMetaMaskInstalled(false);
      }
    };

    checkWalletStatus();
  }, []);

  // Vérifier si l'utilisateur a assez d'ETH pour la transaction
  async function checkBalance(address: string): Promise<boolean> {
    try {
      setStatus('checking');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balance);
      setBalance(balanceEth);

      // Vérifier si le solde est suffisant
      const hasEnoughFunds = Number(balanceEth) >= REQUIRED_ETH;

      if (!hasEnoughFunds) {
        setStatus('insufficient_funds');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification du solde:', error);
      return false;
    }
  }

  async function handleMint() {
    try {
      // Vérifier si Metamask est installé
      if (typeof window.ethereum === 'undefined') {
        setStatus('error');
        setErrorMessage('Veuillez installer Metamask pour continuer.');
        toast.error('Metamask non détecté', {
          description:
            "Veuillez installer l'extension Metamask pour continuer.",
        });
        return;
      }

      // Connexion au wallet
      setStatus('connecting');
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Changer pour le réseau Sepolia testnet
      try {
        await provider.send('wallet_switchEthereumChain', [
          { chainId: '0xaa36a7' }, // Sepolia testnet
        ]);
      } catch (switchError: any) {
        // Si le réseau n'existe pas, on propose de l'ajouter
        if (switchError.code === 4902) {
          try {
            await provider.send('wallet_addEthereumChain', [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ]);
          } catch (addError) {
            setStatus('error');
            setErrorMessage("Impossible d'ajouter le réseau Sepolia");
            return;
          }
        } else {
          setStatus('error');
          setErrorMessage('Impossible de changer de réseau');
          return;
        }
      }

      // Demander l'accès aux comptes
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // Vérifier si l'utilisateur a assez d'ETH
      const hasEnoughFunds = await checkBalance(address);
      if (!hasEnoughFunds) {
        return; // La fonction checkBalance a déjà mis à jour l'état
      }

      // Récupérer l'adresse du contrat
      const contractAddress = process.env.NEXT_PUBLIC_PAYMENTNFT_ADDRESS || '';
      if (!contractAddress) {
        setStatus('error');
        setErrorMessage('Adresse du contrat non définie.');
        return;
      }

      // Créer l'instance du contrat
      const contract = new ethers.Contract(
        contractAddress,
        PaymentNFTAbi.abi,
        signer
      );

      // Lancer la transaction
      setStatus('minting');
      const tx = await contract.payAndMint({
        value: ethers.parseEther('0.01'),
      });

      setTransactionHash(tx.hash);
      toast.info('Transaction envoyée', {
        description: 'Votre transaction a été soumise à la blockchain.',
      });

      // Attendre la confirmation
      setStatus('confirming');
      await tx.wait();

      // Succès
      setStatus('success');
      toast.success('NFT minté avec succès!', {
        description: 'Votre NFT a été créé et ajouté à votre wallet.',
      });
    } catch (err: any) {
      console.error(err);

      // Vérifier spécifiquement les erreurs de fonds insuffisants
      if (
        err.code === 'INSUFFICIENT_FUNDS' ||
        (err.info && err.info.error && err.info.error.code === -32003) ||
        (err.message && err.message.includes('insufficient funds'))
      ) {
        setStatus('insufficient_funds');
        return;
      }

      setStatus('error');

      // Messages d'erreur améliorés
      if (err.code === 4001) {
        setErrorMessage("Transaction refusée par l'utilisateur.");
      } else if (err.code === -32603) {
        setErrorMessage("Erreur interne. Vérifiez que vous avez assez d'ETH.");
      } else {
        setErrorMessage(err.message || 'Une erreur inconnue est survenue.');
      }

      toast.error('Erreur lors du mint', {
        description:
          err.message || 'Une erreur est survenue pendant le processus.',
      });
    }
  }

  function resetState() {
    setStatus('idle');
    setErrorMessage('');
    setTransactionHash('');
  }

  function openEtherscan() {
    if (transactionHash) {
      window.open(
        `https://sepolia.etherscan.io/tx/${transactionHash}`,
        '_blank'
      );
    }
  }

  function openSepoliaFaucet() {
    window.open('https://sepoliafaucet.com/', '_blank');
  }

  // Définir le contenu du bouton en fonction de l'état
  let buttonContent;
  let buttonDisabled = false;

  switch (status) {
    case 'connecting':
      buttonContent = (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connexion au wallet...
        </>
      );
      buttonDisabled = true;
      break;
    case 'checking':
      buttonContent = (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Vérification du solde...
        </>
      );
      buttonDisabled = true;
      break;
    case 'minting':
      buttonContent = (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Transaction en cours...
        </>
      );
      buttonDisabled = true;
      break;
    case 'confirming':
      buttonContent = (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Attente de confirmation...
        </>
      );
      buttonDisabled = true;
      break;
    case 'success':
      buttonContent = (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          NFT minté avec succès!
        </>
      );
      break;
    case 'error':
      buttonContent = (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          Réessayer
        </>
      );
      break;
    case 'insufficient_funds':
      buttonContent = (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          Obtenir des ETH
        </>
      );
      break;
    default:
      buttonContent = (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Acheter ce NFT
        </>
      );
  }

  return (
    <div className="w-full space-y-4 max-w-full">
      <div className="w-full bg-gradient-to-r from-purple-100/20 to-blue-100/20 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200/30 dark:border-purple-800/30 overflow-hidden">
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none"
            >
              Édition NFT
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Ce NFT vous donne la propriété exclusive de ce Pokémon sur
                    la blockchain Sepolia.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-semibold text-base">0.01 ETH</span>
            <span className="text-xs text-muted-foreground">≈ 20.00 $</span>
          </div>
        </div>

        <Separator className="mb-3 bg-purple-200/30 dark:bg-purple-800/30" />

        {walletAddress && (
          <div className="flex justify-between items-center text-xs text-muted-foreground w-full mb-3">
            <div className="flex items-center truncate max-w-[70%]">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 flex-shrink-0"></span>
              <span className="truncate">
                {walletAddress.substring(0, 6)}...
                {walletAddress.substring(walletAddress.length - 4)}
              </span>
            </div>
            {balance && (
              <div
                className={
                  Number(balance) < REQUIRED_ETH
                    ? 'text-red-500 font-medium'
                    : 'text-green-500 font-medium'
                }
              >
                {Number(balance).toFixed(4)} ETH
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full rounded-md bg-destructive/20 p-3 text-xs text-destructive mb-3 break-words"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            </motion.div>
          )}

          {status === 'insufficient_funds' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mb-3"
            >
              <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg p-3 text-amber-700 dark:text-amber-300 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Fonds insuffisants</span>
                </div>
                <div className="text-xs mb-2 pl-6">
                  <p className="break-words">
                    Vous n'avez pas assez d'ETH pour cette transaction. (
                    {REQUIRED_ETH} ETH requis)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs border-amber-500/30 hover:bg-amber-500/20 mt-1"
                  onClick={openSepoliaFaucet}
                >
                  <ExternalLink className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">Obtenir des ETH</span>
                </Button>
              </div>
            </motion.div>
          )}

          {status === 'success' && transactionHash && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full rounded-md bg-green-500/20 p-3 text-xs text-green-600 dark:text-green-400 mb-3"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>NFT minté avec succès!</span>
                </div>
                <button
                  onClick={openEtherscan}
                  className="w-full text-left flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <span>Voir sur Etherscan</span>
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full">
          {status === 'success' ? (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={resetState}
            >
              Mint un autre NFT
            </Button>
          ) : status === 'insufficient_funds' ? (
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white truncate"
              onClick={openSepoliaFaucet}
            >
              <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Obtenir des ETH de test</span>
            </Button>
          ) : (
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              onClick={handleMint}
              disabled={buttonDisabled || !isMetaMaskInstalled}
            >
              {buttonContent}
            </Button>
          )}
        </div>

        {!isMetaMaskInstalled && (
          <div className="mt-2 text-xs text-amber-500 flex items-center gap-1.5 w-full">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              MetaMask n'est pas installé.{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-600"
              >
                Installer
              </a>
            </span>
          </div>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2 w-full">
          <div className="flex flex-col items-center text-center p-2 rounded-md bg-muted/40">
            <span className="text-xs font-medium mb-1">Edition</span>
            <span className="text-xs">1 de 100</span>
          </div>
          <div className="flex flex-col items-center text-center p-2 rounded-md bg-muted/40">
            <span className="text-xs font-medium mb-1">Network</span>
            <span className="text-xs">Sepolia</span>
          </div>
          <div className="flex flex-col items-center text-center p-2 rounded-md bg-muted/40">
            <span className="text-xs font-medium mb-1">Bonus</span>
            <span className="text-xs">+10%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
