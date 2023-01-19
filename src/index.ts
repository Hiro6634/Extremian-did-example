import { KMSClient } from "@extrimian/kms-client";
import { LANG } from "@extrimian/kms-core";
import { SecureStorage } from "./secure-storage";

const index = async () => {
    // Create DID

    const kms = new KMSClient({
        lang: LANG.en,
        storage: new SecureStorage()
    });

    // Update DID Document
    // Generate Recovery Key

    // Generate DIDComm Key 

    // Generate BBS Key

    // Create DID Document
    // Claves DIDComm y EBS
}

index();