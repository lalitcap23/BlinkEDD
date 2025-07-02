import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { NextRequest, NextResponse } from 'next/server';

interface ActionGetResponse {
  icon: string;
  title: string;
  description: string;
  label: string;
  links?: {
    actions: Array<{
      label: string;
      href: string;
      parameters?: Array<{
        name: string;
        label: string;
        required?: boolean;
      }>;
    }>;
  };
}

interface ActionPostResponse {
  transaction: string; 
  message?: string;
}

interface ActionError {
  message: string;
}


const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Encoding, Accept-Encoding',
  'Content-Type': 'application/json',
  'X-Action-Version': '2.1.3',
  'X-Blockchain-Ids': 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
};

// GET handler - Returns action metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recipient = searchParams.get('recipient');
    const amount = searchParams.get('amount');
    const label = searchParams.get('label') || 'Solana Transfer';
    const message = searchParams.get('message') || '';

    // Validate parameters
    if (!recipient) {
      return NextResponse.json(
        { message: 'Recipient address is required' } as ActionError,
        { status: 400, headers }
      );
    }

    try {
      new PublicKey(recipient);
    } catch {
      return NextResponse.json(
        { message: 'Invalid recipient address' } as ActionError,
        { status: 400, headers }
      );
    }

    const amountSol = amount ? parseFloat(amount) : 0.001;

    const response: ActionGetResponse = {
      icon: 'https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/',
      title: `Send ${amountSol} SOL`,
      description: message || `Send ${amountSol} SOL to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
      label: label,
      links: {
        actions: [
          {
            label: `Send ${amountSol} SOL`,
            href: `/api/actions/transfer?recipient=${recipient}&amount=${amountSol}&label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}`,
          }
        ]
      }
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('GET /api/actions/transfer error:', error);
    return NextResponse.json(
      { message: 'Internal server error' } as ActionError,
      { status: 500, headers }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json();
    
    const recipient = searchParams.get('recipient');
    const amount = searchParams.get('amount');
    
    // Validate required parameters
    if (!recipient || !amount) {
      return NextResponse.json(
        { message: 'Recipient and amount are required' } as ActionError,
        { status: 400, headers }
      );
    }

    // Validate recipient address
    let recipientPubkey: PublicKey;
    try {
      recipientPubkey = new PublicKey(recipient);
    } catch {
      return NextResponse.json(
        { message: 'Invalid recipient address' } as ActionError,
        { status: 400, headers }
      );
    }

    // Validate sender (from request body)
    if (!body.account) {
      return NextResponse.json(
        { message: 'Sender account is required' } as ActionError,
        { status: 400, headers }
      );
    }

    let senderPubkey: PublicKey;
    try {
      senderPubkey = new PublicKey(body.account);
    } catch {
      return NextResponse.json(
        { message: 'Invalid sender address' } as ActionError,
        { status: 400, headers }
      );
    }

    const amountSol = parseFloat(amount);
    if (amountSol <= 0) {
      return NextResponse.json(
        { message: 'Amount must be greater than 0' } as ActionError,
        { status: 400, headers }
      );
    }

    // Convert SOL to lamports
    const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

    // Create connection (use your RPC endpoint)
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');

    // Create transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: senderPubkey,
      toPubkey: recipientPubkey,
      lamports: lamports,
    });

    // Create transaction
    const transaction = new Transaction({
      feePayer: senderPubkey,
      blockhash: blockhash,
      lastValidBlockHeight: lastValidBlockHeight,
    }).add(transferInstruction);

    // Serialize transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    const base64Transaction = serializedTransaction.toString('base64');

    const response: ActionPostResponse = {
      transaction: base64Transaction,
      message: `Transfer ${amountSol} SOL to ${recipient}`,
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('POST /api/actions/transfer error:', error);
    return NextResponse.json(
      { message: 'Failed to create transaction' } as ActionError,
      { status: 500, headers }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers,
  });
}