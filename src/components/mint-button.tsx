'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import PaymentNFTAbi from '@/abis/PaymentNFT.abi.json';

export function MintButton() {
  const [status, setStatus] = useState('');

  async function handleMint() {
    try {
      if (typeof window.ethereum === 'undefined') {
        setStatus('Please install Metamask.');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('wallet_switchEthereumChain', [{ chainId: '0xaa36a7' }]);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = process.env.NEXT_PUBLIC_PAYMENTNFT_ADDRESS || '';
      if (!address) {
        setStatus('Contract address not defined.');
        return;
      }
      const contract = new ethers.Contract(address, PaymentNFTAbi.abi, signer);
      setStatus('Transaction in progress...');
      const tx = await contract.payAndMint({ value: ethers.parseEther('0.01') });
      setStatus('Waiting for confirmation...');
      await tx.wait();
      setStatus('NFT successfully minted!');
    } catch (err: any) {
      setStatus('Error: ' + (err.message || 'Unknown'));
    }
  }

  return (
    <div>
      <button onClick={handleMint}>Mint NFT</button>
      <p>{status}</p>
    </div>
  );
}
