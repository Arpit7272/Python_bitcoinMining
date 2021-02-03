from hashlib import sha256
import time

def SHA256(text):
    return (sha256(text.encode("ascii")).hexdigest())

def mine(block_number, transactions, previous_hash, prefix_zeros):
    MAX_NONCE=100000000
    prefix_str= '0'*prefix_zeros
    for nonce in range(MAX_NONCE):
        text= str(block_number)+ transactions +previous_hash+ str(nonce)
        new_hash= SHA256(text)
        if new_hash.startswith(prefix_str):
            return new_hash

if __name__ == "__main__":
    transactions =''''
    Dhaval-> Bhavin -> 20,
    Mando -> Cara -> 45
    '''
    difficulty =4                                       
    import time
    start= time.time()
    new_hash= mine(5, transactions,'000050d69dc12ff2e52055f38ee6b1a88ec8ca0c663a67ac4d9f58f36f98d6e6',difficulty )
    total_time= str((time.time()- start))
    print(total_time)
    print(new_hash)
                                          