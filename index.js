'use strict';
let CryptoJS = require("crypto-js");
let express = require("express");
let bodyParser = require('body-parser');
let WebSocket = require("ws");

let http_port = process.env.HTTP_PORT || 3001;
let p2p_port = process.env.P2P_PORT || 6001;
let initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];


class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        //identifiant du block
        this.index = index;
        //clef crypté du block précédant
        this.previousHash = previousHash.toString();
        //date de création du block
        this.timestamp = timestamp;
        //transactions contenue dans ce block
        this.data = data;
        //clef crypté du block courant
        this.hash = hash.toString();
    }
}


/* ********************  CALCUL HASH ******************** */
/**
 * fonction qui calcul de hash d'un block en fonction 
 * @param { Number } index
 * @param { String } previousHash
 * @param { timestamp } timestamp
 * @param { JSON } timestampdata
 * @return { String } 
 */
let calculateHash = (index, previousHash, timestamp, data) => {
    //NB : on ne peut pas modifier un block sans modifer ceux consécutif 
    //car il prend en compte le previous hach
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

/* ******************** GENESIS BLOCK ******************** */
/**
* crétion du genesis block en dur
* @return { Block } 
*/
let getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "mon genesis block !", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};


/* ********************  GENERER UN BLOCK ******************** */
/**
* crétion du block suivant
* NB : seul la data du block est passé en paramètre et fournis par le user le reste est calculé
* @param { JSON } blockData
* @return { Block } 
*/
let generateNextBlock = (blockData) => {
    let previousBlock = getLatestBlock();
    let nextIndex = previousBlock.index + 1;
    let nextTimestamp = new Date().getTime() / 1000;
    let nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};


/* ********************  STOCKER LA BLOCKCHAIN ******************** */
//Tableau JavaScript pour stocké la blockchain
let blockchain = [getGenesisBlock()];

/* ********************  VALIDER L'INTEGRITE D'UN BLOCK ******************** */
/* 
* Un block est valide si :
*   l’index du block est plus grand que celui du block précédent
*   le previousHash du block correspond au hash du block précédent
*   le hash du block lui-même est valide
*/
/**
* validation d'un block
* @param { Block } newBlock
* @param { Block } previousBlock
* @return { Boolean }
**/
let isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('index invalide');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('previousHash invalide');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('hash invalide: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};


/* ********************  VALIDER DE LA BLOCKCHAIN ******************** */
/** 
 * validation de toute la blockchain
 * @param { Array } blockchainToValidate
 * @return { Boolean } 
**/
let isValidChain = (blockchainToValidate) => {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
        return false;
    }
    let tempBlocks = [blockchainToValidate[0]];
    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
};


/* ********************  GERER LES CONFLITS ******************** */

/** 
 * @param { Block } newBlock
 * @param { Array } 
**/
let replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('La blockchain reçue est valide. Remplacer la blockchain actuelle par la blockchain reçue.');
        blockchain = newBlocks;
        broadcast(responseLatestMsg());
    } else {
        console.log('La blockchain reçue est invalide.');
    }
};


/* ********************  WEBSOCKET ******************** */

/** 
 * connect nouveaux pair aux autres pair
 * @param { Array } newPeers
 * @return { None }
**/
let connectToPeers = (newPeers) => {
    newPeers.forEach((peer) => {
        let ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => {
            console.log('échec de la connexion')
        });
    });
};

let initHttpServer = () => {
    let app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));
    app.post('/mineBlock', (req, res) => {
        let newBlock = generateNextBlock(req.body.data);
        addBlock(newBlock);
        broadcast(responseLatestMsg());
        console.log('block ajouté : ' + JSON.stringify(newBlock));
        res.send();
    });
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeers([req.body.peer]);
        res.send();
    });
    app.listen(http_port, () => console.log('Écoute HTTP sur le port : ' + http_port));
};

console.log('coucou')