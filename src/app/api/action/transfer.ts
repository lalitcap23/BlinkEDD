import { NextApiRequest, NextApiResponse } from 'next';
import { generateBlinkAction } from '../..//utils/generateBlink';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { recipient, amount, label, message, tags } = req.query;
      
      if (!recipient || !amount) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const action = generateBlinkAction(
        recipient as string,
        parseFloat(amount as string),
        label as string,
        message as string,
        tags ? (tags as string).split(',') : undefined
      );

      // Set proper headers for Actions
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      return res.status(200).json(action);
    } catch (error) {
      console.error('Error in transfer action:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'OPTIONS') {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// pages/api/actions/transfer/execute.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { recipient, amount } = req.query;
      const { account } = req.body; // The user's wallet address from the POST body
      
      if (!recipient || !amount || !account) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Create connection to Solana (use your preferred RPC)
      const connection = new Connection(
        process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      );

      // Create the transaction
      const transaction = new Transaction();
      
      // Add transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(account),
          toPubkey: new PublicKey(recipient as string),
          lamports: parseFloat(amount as string) * LAMPORTS_PER_SOL,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(account);

      // Serialize the transaction
      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      // Set proper headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      return res.status(200).json({
        transaction: serializedTransaction.toString('base64'),
        message: `Sending ${amount} SOL to ${recipient}`,
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({ error: 'Failed to create transaction' });
    }
  } else if (req.method === 'OPTIONS') {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}