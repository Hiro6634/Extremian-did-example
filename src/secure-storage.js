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
exports.SecureStorage = void 0;
class SecureStorage {
    constructor() {
        this.map = new Map();
    }
    add(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.map.set(key, data);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.map.get(key);
            return this.get(key);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.map;
        });
    }
    update(key, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.map.set(key, data);
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.map.delete(key);
        });
    }
}
exports.SecureStorage = SecureStorage;
