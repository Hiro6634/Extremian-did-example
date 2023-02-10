"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kms_client_1 = require("@extrimian/kms-client");
const kms_core_1 = require("@extrimian/kms-core");
const secure_storage_1 = require("./secure-storage");
const did_registry_1 = require("@extrimian/did-registry");
const did_resolver_1 = require("@extrimian/did-resolver");
const did_core_1 = require("@extrimian/did-core");
const index = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create DID
    const kms = new kms_client_1.KMSClient({
        lang: kms_core_1.LANG.es,
        storage: new secure_storage_1.SecureStorage()
    });
    // Update DID Document Key
    const updateKey = yield kms.create(kms_core_1.Suite.ES256k);
    // Generate Recovery Key
    const recoveryKey = yield kms.create(kms_core_1.Suite.ES256k);
    // Generate DIDComm Key 
    const didComm = yield kms.create(kms_core_1.Suite.DIDComm);
    // Generate BBS Key
    const bbsbls = yield kms.create(kms_core_1.Suite.Bbsbls2020);
    const didService = new did_registry_1.Did();
    // Create DID Document
    const createDIDResponse = yield didService.createDID({
        updateKeys: [updateKey.publicKeyJWK],
        recoveryKeys: [recoveryKey.publicKeyJWK],
        verificationMethods: [{
                //Claves DIDComm
                id: "didComm",
                type: "X25519KeyAgreementKey2019",
                publicKeyJwk: didComm.publicKeyJWK,
                purpose: [new did_core_1.KeyAgreementPurpose()]
            }, {
                // Clave BBS
                id: "bbsbls",
                type: "Bls12381G1Key2020",
                publicKeyJwk: (yield bbsbls).publicKeyJWK,
                purpose: [new did_core_1.AssertionMethodPurpose()]
            }]
    });
    console.log("STEP 1 - createDIDResponse");
    console.log(createDIDResponse);
    // RESOLVE
    // const resolver = new DIDModenaResolver({
    //     modenaURL: "http://modena.extrimian.com"
    // });
    const resolver = new did_resolver_1.DIDModenaResolver({
        modenaURL: "https://saas.extrimian.com/didethrrsk0x091c2A966a2C1c73E0af36c7B929c8062A1830fA/QndHH7oqggOhsF74/modena-testnet?apikey=St6xioXuox2IsvT3co3KBu27SZTe6HjK"
    });
    console.log("STEP 2 - new Resolver", resolver);
    try {
        const didDocument = yield resolver.resolveDID(createDIDResponse.didUniqueSuffix);
        console.log("STEP 3 - didDocument");
        console.log(didDocument);
        try {
            // const publishResponse = await didService.publishDID({
            //     createDIDResponse: createDIDResponse,
            //     modenaApiURL: "http://modena.extrimian.com"
            // });
            const publishResponse = yield didService.publishDID({
                createDIDResponse: createDIDResponse,
                modenaApiURL: "https://saas.extrimian.com/didethrrsk0x091c2A966a2C1c73E0af36c7B929c8062A1830fA/QndHH7oqggOhsF74/modena-testnet?apikey=St6xioXuox2IsvT3co3KBu27SZTe6HjK"
            });
            console.log("STEP 4 - Publish");
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const didDocument = yield resolver.resolveDID(publishResponse.canonicalId);
                console.log("STEP 5 - resolve from chain");
                console.log(didDocument);
            }), 380000);
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        console.log(error);
    }
});
index();
