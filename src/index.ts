import { KMSClient } from "@extrimian/kms-client";
import { LANG, Suite } from "@extrimian/kms-core";
import { SecureStorage } from "./secure-storage";
import { Did } from "@extrimian/did-registry";
import { DIDModenaResolver } from "@extrimian/did-resolver";
import { AssertionMethodPurpose, KeyAgreementPurpose } from "@extrimian/did-core";

const index = async () => {
    // Create DID
    const kms = new KMSClient({
        lang: LANG.es,
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

    const modenaApiURL = "http://modena.extrimian.com"
    // const modenaApiURL = "https://saas.extrimian.com/didethrrsk0x091c2A966a2C1c73E0af36c7B929c8062A1830fA/QndHH7oqggOhsF74/modena-testnet?apikey=St6xioXuox2IsvT3co3KBu27SZTe6HjK"
    console.log("STEP 1 - createDIDResponse");
    console.log(createDIDResponse);
    // RESOLVE
    const resolver = new DIDModenaResolver({
        modenaURL: modenaApiURL
    });

    console.log("STEP 2 - new Resolver", resolver);
    try{
        const  didDocument = await resolver.resolveDID(createDIDResponse.didUniqueSuffix);

        console.log("STEP 3 - didDocument");
        console.log(didDocument);
    
        try{
            const publishResponse = await didService.publishDID({
                createDIDResponse: createDIDResponse,
                modenaApiURL: modenaApiURL
            });
            console.log("STEP 4 - Publish");
    
            setTimeout(async ()=>{
                const didDocument = await resolver.resolveDID(publishResponse.canonicalId)
                console.log("STEP 5 - resolve from chain");
                console.log(didDocument);
            }, 380000);
    
        } catch(error){
            console.log(error);
        }
    } catch(error){
        console.log(error);

    }

}

index();