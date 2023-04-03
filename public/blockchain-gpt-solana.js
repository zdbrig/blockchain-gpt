        const solanaNetwork = 'https://api.mainnet-beta.solana.com';
        const connection = new solanaWeb3.Connection(solanaNetwork);

        async function _connectToPhantomWallet() {
            const wallet = solanaWalletAdapterWallets.getPhantomWallet();

            if (!wallet) {
                console.log('Please install Phantom Wallet to use this feature');
                return null;
            }

            if (wallet.connected) {
                console.log('You are already connected to Phantom Wallet');
                return wallet.publicKey.toBase58();
            }

            try {
                await wallet.connect();
                localStorage.setItem('solanaPublicKey', wallet.publicKey.toBase58());
                return wallet.publicKey.toBase58();
            } catch (error) {
                console.log('Failed to connect to Phantom Wallet: ' + error.message);
                return null;
            }
        }

        async function _disconnectFromPhantomWallet() {
            const wallet = solanaWalletAdapterWallets.getPhantomWallet();

            if (!wallet) {
                console.log('Please install Phantom Wallet to use this feature');
                return null;
            }

            if (!wallet.connected) {
                console.log('You are already disconnected from Phantom Wallet');
                return null;
            }

            try {
                await wallet.disconnect();
                localStorage.removeItem('solanaPublicKey');
                console.log('You have successfully disconnected from Phantom Wallet');
            } catch (error) {
                console.log('Failed to disconnect from Phantom Wallet: ' + error.message);
                return null;
            }
        }

        async function _getSolanaPublicKey() {
            const wallet = solanaWalletAdapterWallets.getPhantomWallet();

            if (!wallet) {
                console.log('Please install Phantom Wallet to use this feature');
                return null;
            }

            if (!wallet.connected) {
                console.log('You are not connected to Phantom Wallet');
                return null;
            }

            try {
                return wallet.publicKey.toBase58();
            } catch (error) {
                console.log('Failed to retrieve public key from Phantom Wallet: ' + error.message);
                return null;
            }
        }

        async function _getSolanaNetworkInfo() {
            const networkInfo = {
                rpcUrl: solanaNetwork,
                networkName: 'Solana Mainnet Beta'
            };

            return networkInfo;
        }

        async function _getSolanaBalance(address) {
            if (!address) {
                console.log('Invalid address');
                return null;
            }

            try {
                const publicKey = new solanaWeb3.PublicKey(address);
                const balance = await connection.getBalance(publicKey);
                const lamportsToSol = balance / 1e9;
                return lamportsToSol;
            } catch (error) {
                console.log('Failed to retrieve balance: ' + error.message);
                return null;
            }
        }