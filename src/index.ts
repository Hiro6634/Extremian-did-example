import { KMSClient } from "@extrimian/kms-client";
import { LANG, Suite } from "@extrimian/kms-core";
import { SecureStorage } from "./secure-storage";
import { Did } from "@extrimian/did-registry";
import { DIDModenaResolver } from "@extrimian/did-resolver";
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
    const bbsbls = await kms.create(Suite.Bbsbls2020);

    const didService = new Did();

    // Create DID Document
    const createDIDResponse = await didService.createDID({
        updateKeys: [updateKey.publicKeyJWK],
        recoveryKeys: [recoveryKey.publicKeyJWK],
        verificationMethods: [{
            //Claves DIDComm
            id: "didComm",
            type: "X25519KeyAgreementKey2019",
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
    
    // RESOLVE
    const resolver = new DIDModenaResolver({
        modenaURL: "http://modena.extrimian.com"
    });

    const  didDocument = await resolver.resolveDID(createDIDResponse.didUniqueSuffix);

    console.log(didDocument);

    const publishResponse = await didService.publishDID({
        createDIDResponse: createDIDResponse,
        modenaApiURL: "http://modena.extrimian.com"
    });

    setTimeout(async ()=>{
        const didDocument = await resolver.resolveDID(publishResponse.canonicalId)

        console.log(didDocument);
    }, 380000);


}

index();