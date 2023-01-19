import { KMSClient } from "@extrimian/kms-client";
import { LANG, Suite } from "@extrimian/kms-core";
import { SecureStorage } from "./secure-storage";
import { Did } from "@extrimian/did-registry";
import { AssertionMethodPurpose, KeyAgreementPurpose } from "@extrimian/did-core";

const index = async () => {
    // Create DID

    const kms = new KMSClient({
        lang: LANG.en,
        storage: new SecureStorage()
    });

    // Update DID Document Key
    const updateKey = await kms.create(Suite.ES256k);

    // Generate Recovery Key
    const recoveryKey = await kms.create(Suite.ES256k);

    // Generate DIDComm Key 
    const didComm = await kms.create(Suite.DIDComm);

    // Generate BBS Key
    const bbsbls = kms.create(Suite.Bbsbls2020);

    const didService = new Did();

    // Create DID Document
    const longDID = await didService.createDID({
        updateKeys: [updateKey.publicKeyJWK],
        recoveryKeys: [recoveryKey.publicKeyJWK],
        verificationMethods: [{
            //Claves DIDComm
            id: "didComm",
            type: "X25519KeyAgreemenKey2019",
            publicKeyJwk: didComm.publicKeyJWK,
            purpose: [new KeyAgreementPurpose()]
        }, {
            // Clave BBS
            id: "bbsbls",
            type: "Bls12381G1Key2020",
            publicKeyJwk: (await bbsbls).publicKeyJWK,
            purpose: [new AssertionMethodPurpose()]
        }]
    });
    
}

index();