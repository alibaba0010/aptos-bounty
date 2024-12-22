// TODO# 1: Define Module and Marketplace Address
address 0xb4037b16f9c0ea23f4df411e84a49278165c40dd9940ee41b41acb22caae8725 {

    module NFTMarketplace {
        use 0x1::signer;
        use 0x1::vector;
        use 0x1::coin;
        use 0x1::aptos_coin;

        // TODO# 2: Define NFT Structure
struct NFT has store, key {
            id: u64,
            owner: address,
            name: vector<u8>,
            description: vector<u8>,
            uri: vector<u8>,
            price: u64,
            for_sale: bool,
            rarity: u8,  // 1 for common, 2 for rare, 3 for epic, etc.
            made_ofer: bool,
            offer_price: u64,
            offree: address,
            // for auctioning
            on_auction: bool,
            previous_bid: u64,
            current_bid: u64,
            new_offer: bool,
            auction_offer_made: bool,
            previous_bidder: address,
            current_bidder:  address      // New: Array of bid prices
        }

        // TODO# 3: Define Marketplace Structure

         struct Marketplace has key {
            nfts: vector<NFT>
        }
        // TODO# 4: Define ListedNFT Structure
  struct ListedNFT has copy, drop {
            id: u64,
            price: u64,
            rarity: u8
        }
        //TODO: Offers Structure
  struct OfferNFT has copy, drop {
            id: u64,
            name: vector<u8>,
            uri: vector<u8>,
            offree: address,
            price: u64,
            offer_price: u64,
            made_ofer: bool,
            rarity: u8
        }
struct AuctionNFT has copy, drop {
            id: u64,
            name: vector<u8>,
            uri: vector<u8>,
            on_auction: bool,
            previous_bid: u64,
            previous_bidder:address,
            auction_offer_made: bool,
            current_bidder:address,
            current_bid: u64,
            new_offer: bool,
            rarity: u8
}
        // TODO# 5: Set Marketplace Fee
 const MARKETPLACE_FEE_PERCENT: u64 = 2; // 2% fee

        // TODO# 6: Initialize Marketplace        
    public entry fun initialize(account: &signer) {
            let marketplace = Marketplace {
                nfts: vector::empty<NFT>()
            };
            move_to(account, marketplace);
        }

        // TODO# 7: Check Marketplace Initialization
  #[view]
        public fun is_marketplace_initialized(marketplace_addr: address): bool {
            exists<Marketplace>(marketplace_addr)
        }

        // TODO# 8: Mint New NFT
  public entry fun mint_nft(account: &signer, name: vector<u8>, description: vector<u8>, uri: vector<u8>, rarity: u8) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
            let nft_id = vector::length(&marketplace.nfts);
          
            let new_nft = NFT {
                id: nft_id,
                owner: signer::address_of(account),
                name,
                description,
                uri,
                price: 0,
                for_sale: false,
                rarity,
                made_ofer: false,
                offer_price: 0,
                offree: @0x0,
                on_auction: false,
                previous_bid: 0,
                current_bid: 0,
                auction_offer_made: false,
                new_offer: false,
                previous_bidder: @0x0,
                current_bidder: @0x0
            };

            vector::push_back(&mut marketplace.nfts, new_nft);
        }
 
        // TODO# 9: View NFT Details
 #[view]
        public fun get_nft_details(marketplace_addr: address, nft_id: u64): (u64, address, vector<u8>, vector<u8>, vector<u8>, u64, bool, u8) acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);

            (nft.id, nft.owner, nft.name, nft.description, nft.uri, nft.price, nft.for_sale, nft.rarity)
        }
        
        // TODO# 10: List NFT for Sale
   public entry fun list_for_sale(account: &signer, marketplace_addr: address, nft_id: u64, price: u64) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

            assert!(nft_ref.owner == signer::address_of(account), 100); // Caller is not the owner
            assert!(!nft_ref.for_sale, 101); // NFT is already listed
            assert!(price > 0, 102); // Invalid price

            nft_ref.for_sale = true;
            nft_ref.price = price;
        }

        // TODO# 11: Update NFT Price
 public entry fun set_price(account: &signer, marketplace_addr: address, nft_id: u64, price: u64) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

            assert!(nft_ref.owner == signer::address_of(account), 200); // Caller is not the owner
            assert!(price > 0, 201); // Invalid price

            nft_ref.price = price;
        }

        // TODO# 12: Purchase NFT
  public entry fun purchase_nft(account: &signer, marketplace_addr: address, nft_id: u64, payment: u64) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

            assert!(nft_ref.for_sale, 400); // NFT is not for sale
            assert!(payment >= nft_ref.price, 401); // Insufficient payment

            // Calculate marketplace fee
            let fee = (nft_ref.price * MARKETPLACE_FEE_PERCENT) / 100;
            let seller_revenue = payment - fee;

            // Transfer payment to the seller and fee to the marketplace
            coin::transfer<aptos_coin::AptosCoin>(account, marketplace_addr, seller_revenue);
            coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), fee);

            // Transfer ownership
            nft_ref.owner = signer::address_of(account);
            nft_ref.for_sale = false;
            nft_ref.price = 0;
        }

        // TODO# 13: Check if NFT is for Sale
 #[view]
        public fun is_nft_for_sale(marketplace_addr: address, nft_id: u64): bool acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);
            nft.for_sale
        }

        // TODO# 14: Get NFT Price
#[view]
        public fun get_nft_price(marketplace_addr: address, nft_id: u64): u64 acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);
            nft.price
        }

        // TODO# 15: Transfer Ownership
 public entry fun transfer_ownership(account: &signer, marketplace_addr: address, nft_id: u64, new_owner: address) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

            assert!(nft_ref.owner == signer::address_of(account), 300); // Caller is not the owner
            assert!(nft_ref.owner != new_owner, 301); // Prevent transfer to the same owner

            // Update NFT ownership and reset its for_sale status and price
            nft_ref.owner = new_owner;
            nft_ref.for_sale = false;
            nft_ref.price = 0;
        }

        // TODO# 16: Retrieve NFT Owner
 #[view]
        public fun get_owner(marketplace_addr: address, nft_id: u64): address acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft = vector::borrow(&marketplace.nfts, nft_id);
            nft.owner
        }

        // TODO# 17: Retrieve NFTs for Sale
  #[view]
        public fun get_all_nfts_for_owner(marketplace_addr: address, owner_addr: address, limit: u64, offset: u64): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft_ids = vector::empty<u64>();

            let nfts_len = vector::length(&marketplace.nfts);
            let end = min(offset + limit, nfts_len);
            let mut_i = offset;
            while (mut_i < end) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.owner == owner_addr) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                mut_i = mut_i + 1;
            };

            nft_ids
        }

        // TODO# 18: Retrieve NFTs for Sale
 #[view]
        public fun get_all_nfts_for_sale(marketplace_addr: address, limit: u64, offset: u64): vector<ListedNFT> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nfts_for_sale = vector::empty<ListedNFT>();

            let nfts_len = vector::length(&marketplace.nfts);
            let end = min(offset + limit, nfts_len);
            let mut_i = offset;
            while (mut_i < end) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.for_sale) {
                    let listed_nft = ListedNFT { id: nft.id, price: nft.price, rarity: nft.rarity };
                    vector::push_back(&mut nfts_for_sale, listed_nft);
                };
                mut_i = mut_i + 1;
            };

            nfts_for_sale
        }

        // TODO# 19: Define Helper Function for Minimum Value
  // Helper function to find the minimum of two u64 numbers
        public fun min(a: u64, b: u64): u64 {
            if (a < b) { a } else { b }
        }

        // TODO# 20: Retrieve NFTs by Rarity
  // Helper function to find the minimum of two u64 numbers
      // New function to retrieve NFTs by rarity
        #[view]
        public fun get_nfts_by_rarity(marketplace_addr: address, rarity: u8): vector<u64> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            let nft_ids = vector::empty<u64>();

            let nfts_len = vector::length(&marketplace.nfts);
            let mut_i = 0;
            while (mut_i < nfts_len) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.rarity == rarity) {
                    vector::push_back(&mut nft_ids, nft.id);
                };
                mut_i = mut_i + 1;
            };

            nft_ids
        }
        //TODO 21: Make an offer to a NFT
  public entry fun make_offer(account: &signer, marketplace_addr: address, nft_id: u64, offer_price: u64) acquires Marketplace {
            let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);
            assert!(offer_price > 0, 102); // Invalid price

    // Calculate marketplace fee
            let fee = (offer_price * MARKETPLACE_FEE_PERCENT) / 100;
            let payment = offer_price - fee;

            // Transfer payment to the seller and fee to the marketplace
            coin::transfer<aptos_coin::AptosCoin>(account, marketplace_addr, payment);
            coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), fee);
nft_ref.offree = signer::address_of(account);
nft_ref.offer_price = offer_price;
nft_ref.made_ofer = true;
  
  }
  //TOD0 22: Show Offers  
  #[view]
  public fun show_offers(marketplace_addr: address, limit: u64, offset: u64): vector<OfferNFT> acquires Marketplace {
            let marketplace = borrow_global<Marketplace>(marketplace_addr);
            // intialize offerNFT struct
            let offer_nfts = vector::empty<OfferNFT>();
            let nfts_len = vector::length(&marketplace.nfts);
            let end = min(offset + limit, nfts_len);
            let mut_i = offset;
  while (mut_i < end) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.made_ofer) {
                    let offer_nft = OfferNFT { 
                        id: nft.id,
                        name: nft.name,
                        uri: nft.uri,
                        offree: nft.offree,
                        price: nft.price,
                        offer_price: nft.offer_price, 
                        made_ofer: nft.made_ofer, 
                        rarity: nft.rarity };
                    vector::push_back(&mut offer_nfts, offer_nft);
                };
                mut_i = mut_i + 1;
            };

            offer_nfts 
    }
    //TODO23: Accept offer made 
      public entry fun accept_offer(account: &signer, offree: address, nft_id: u64) acquires Marketplace{
            let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);
      // Transfer ownership
            nft_ref.owner = offree;
            nft_ref.for_sale = false;
            nft_ref.price = 0;
            nft_ref.offer_price = 0;
            nft_ref.made_ofer = false;
            nft_ref.offree = @0x0;
      }
//TODO24: Reject offer made
     public entry fun reject_offer(account: &signer, offree: address, nft_id: u64) acquires Marketplace{
            let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

            let fee = (nft_ref.offer_price * MARKETPLACE_FEE_PERCENT) / 100;
            let payment = nft_ref.offer_price - fee;
            // from, to, amount
            coin::transfer<aptos_coin::AptosCoin>(account, offree, payment);
            coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), fee);

            nft_ref.owner = signer::address_of(account);
            nft_ref.offer_price = 0;
            nft_ref.made_ofer = false;
            nft_ref.offree = @0x0;


    }
    //TODO25: Auction NFT by the owner
  public entry fun auction_nft(account: &signer, nft_id: u64) acquires Marketplace{
            let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

nft_ref.on_auction = true;


  }
  //TODO26: Bid for auctioned NFTs
// Update the `auction_bid_nft` function
public entry fun auction_bid_nft(account: &signer, marketplace_addr: address, nft_id: u64, auction_price: u64) acquires Marketplace {
    let marketplace = borrow_global_mut<Marketplace>(marketplace_addr);
    let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

    // Ensure the NFT is currently on auction
    assert!(nft_ref.on_auction, 500); // NFT is not on auction
    // Calculate marketplace fee
    let fee = (auction_price * MARKETPLACE_FEE_PERCENT) / 100;
    let payment = auction_price - fee;
if(nft_ref.auction_offer_made){
    nft_ref.previous_bid = nft_ref.current_bid;
    nft_ref.previous_bidder = nft_ref.current_bidder;
    nft_ref.current_bid =  auction_price;
    nft_ref.current_bidder = signer::address_of(account);
}else{
    nft_ref.current_bid =  auction_price;
    nft_ref.current_bidder = signer::address_of(account);
};
// Transfer payment to the seller and fee to the marketplace
        coin::transfer<aptos_coin::AptosCoin>(account, marketplace_addr, payment);
        coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), fee);
        nft_ref.new_offer= true
 
}

// Add a helper function to retrieve the previous and current bid
#[view]
public fun get_nfts_on_auction(marketplace_addr: address, limit: u64, offset: u64):vector<AuctionNFT> acquires Marketplace {
        let marketplace = borrow_global<Marketplace>(marketplace_addr);
        let auction_nfts = vector::empty<AuctionNFT>();
        let nfts_len = vector::length(&marketplace.nfts);
        let end = min(offset + limit, nfts_len);
        let mut_i = offset;

  while (mut_i < end) {
                let nft = vector::borrow(&marketplace.nfts, mut_i);
                if (nft.on_auction) {
                    let auction_nft = AuctionNFT { 
                        id: nft.id,
                        name: nft.name,
                        uri: nft.uri,
                        current_bidder: nft.current_bidder,
                        current_bid: nft.current_bid, 
                        previous_bidder: nft.previous_bidder,
                        previous_bid: nft.previous_bid,
                        on_auction: nft.on_auction, 
                        auction_offer_made: nft.auction_offer_made,
                        new_offer: nft.new_offer, 
                        rarity: nft.rarity 
                        };
                    vector::push_back(&mut auction_nfts, auction_nft);
                };
                mut_i = mut_i + 1;
            };

            auction_nfts 

}
// Function to accept auction offer
    public entry fun accept_auction_offer(account: &signer, nft_id: u64) acquires Marketplace{
            let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);
            if(nft_ref.auction_offer_made){
                let fee = (nft_ref.previous_bid * MARKETPLACE_FEE_PERCENT) / 100;
                let payment = nft_ref.previous_bid - fee;
                coin::transfer<aptos_coin::AptosCoin>(account, nft_ref.previous_bidder, payment);
                coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), fee);
            };
        nft_ref.auction_offer_made = true;
        nft_ref.new_offer = false;

      
      }
// Function to reject auction offer
     public entry fun reject_auction_offer(account: &signer, nft_id: u64) acquires Marketplace{
            let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
            let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

            let fee = (nft_ref.current_bid * MARKETPLACE_FEE_PERCENT) / 100;
            let payment = nft_ref.current_bid - fee;
            // from, to, amount
            coin::transfer<aptos_coin::AptosCoin>(account, nft_ref.current_bidder, payment);
            coin::transfer<aptos_coin::AptosCoin>(account, signer::address_of(account), fee);

            nft_ref.new_offer = false;

    }
// Add a helper function to finalize the auction
public entry fun finalize_bid(account: &signer, nft_id: u64) acquires Marketplace{
       let marketplace = borrow_global_mut<Marketplace>(signer::address_of(account));
        let nft_ref = vector::borrow_mut(&mut marketplace.nfts, nft_id);

// Transfer ownership
if(nft_ref.auction_offer_made) {

            nft_ref.owner = nft_ref.current_bidder;
            nft_ref.for_sale = false;
            nft_ref.on_auction = false;
            nft_ref.price = 0;
            nft_ref.current_bid = 0;
            nft_ref.current_bidder = @0x0;
            nft_ref.previous_bid = 0;
            nft_ref.previous_bidder = @0x0;
            nft_ref.made_ofer = false;
            nft_ref.auction_offer_made = false;
            nft_ref.new_offer = false;
}else{
            nft_ref.owner = signer::address_of(account);
            nft_ref.on_auction = false;
          
};
}
    }

}
