"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import PaymentNFTAbi from "@/abis/PaymentNFT.abi.json";

export default function MintButton() {
    const [status, setStatus] = useState("");

    async function handleMint() {
        try {
        if (typeof window.ethereum === "undefined") {
            setStatus("Please install Metamask.");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = await provider.getSigner();

        const contractAddress = process.env.NEXT_PUBLIC_PAYMENTNFT_ADDRESS || "";
        if (!contractAddress) {
            setStatus("Contract address not defined.");
            return;
        }
        const paymentNFT = new ethers.Contract(
            contractAddress,
            PaymentNFTAbi.abi,
            signer
        );

        setStatus("Transaction in progress...");

        const tx = await paymentNFT.payAndMint({
            value: ethers.parseEther("0.01"),
        });

        setStatus("Waiting for confirmation...");
        await tx.wait();

        setStatus("NFT successfully minted!");
        } catch (err: any) {
        console.error(err);
        setStatus("Error: " + (err.message || "Unknown"));
        }
    }

    return (
        <div>
            <button onClick={handleMint}>Mint NFT</button>
            <p>{status}</p>
        </div>
    );
}